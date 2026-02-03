import { supabase } from "@/infra/supabaseClient";
import { UserImage } from "@/models/entities/UserImage";

export class ImageService {
  static BUCKET = "museum-images";

  static async uploadUserImage({
    file,
    userId,
    title,
  }: {
    file: File;
    userId: string;
    title?: string;
  }): Promise<UserImage> {
    const uuid = ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(
      /[018]/g,
      (c: any) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );

    const baseName = file.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.-]/g, "");

    const filename = `${uuid}_${baseName}`;
    const storagePath = `pending/${userId}/${filename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(ImageService.BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    console.log("[ImageService] Resultado do upload:", uploadData, uploadError);
    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from("user_images")
      .insert([
        {
          user_id: userId,
          title,
          storage_bucket: ImageService.BUCKET,
          storage_path: storagePath,
          filename,
          mimetype: file.type,
          filesize: file.size,
          status: "pending",
        },
      ])
      .select("*")
      .single();

    console.log("[ImageService] Resultado do insert:", data, error);
    if (error) throw error;

    return data as UserImage;
  }

  static async listPendingImages(): Promise<UserImage[]> {
    const { data, error } = await supabase
      .from("user_images")
      .select("*")
      .eq("status", "pending");

    if (error) throw error;
    return (data ?? []) as UserImage[];
  }

  /**
   * Checa existência do arquivo no Storage.
   * Importante: se policies estiverem bloqueando leitura/listagem, pode "parecer" que não existe.
   */
  private static async assertFileExistsInPending(
    userId: string,
    fileName: string,
    fullStoragePath: string
  ): Promise<void> {
    const pendingFolder = `pending/${userId}`;

    // 1) Checagem padrão: listar pasta do usuário e procurar pelo nome
    const { data: listData, error: listError } = await supabase.storage
      .from(ImageService.BUCKET)
      .list(pendingFolder, { search: fileName, limit: 50 });

    console.log("[ImageService] Checagem existência (list pending):", {
      pendingFolder,
      fileName,
      listData,
      listError,
    });

    const found = (listData ?? []).some((f) => f.name === fileName);
    if (found) return; // Se achou, ok

    // 2) Diagnóstico adicional: tenta listar o diretório pai do path completo
    // Isso ajuda a descobrir se o storage_path no banco está divergente.
    const parentDir = fullStoragePath.split("/").slice(0, -1).join("/");
    const { data: parentList, error: parentErr } = await supabase.storage
      .from(ImageService.BUCKET)
      .list(parentDir, { limit: 100 });

    console.log("[ImageService] Diagnóstico (list parentDir):", {
      parentDir,
      parentList,
      parentErr,
    });

    // --- Correção principal ---
    // Só lança erro se houver erro explícito de listagem (provável policy ou bucket errado)
    if (listError || parentErr) {
      throw new Error(
        `[ImageService] Não foi possível confirmar existência do arquivo no Storage. ` +
          `Isso normalmente indica falta de policy de SELECT/LIST no bucket para o usuário atual ` +
          `(o Supabase pode mascarar como "Object not found"). ` +
          `Bucket="${ImageService.BUCKET}", path="${fullStoragePath}".`
      );
    }

    // Se não houve erro, mas não encontrou, NÃO lança erro aqui!
    // O move() será o teste real de existência/autorização.
    // Isso evita bloquear o fluxo por causa de policies de leitura restritivas.
    // Apenas loga para diagnóstico.
    console.warn(
      `[ImageService] Não foi possível confirmar existência do arquivo via listagem, mas não houve erro explícito. ` +
      `O fluxo seguirá para o move(), que será o teste real de permissão/existência. ` +
      `Path: ${fullStoragePath}`
    );
    return;
  }

  static async approveImage(image: UserImage, adminId: string): Promise<void> {
    const fileName = image.storage_path.split("/").pop();
    if (!fileName) {
      throw new Error(`[ImageService] storage_path inválido: "${image.storage_path}"`);
    }

    const publicPath = `public/${image.user_id}/${fileName}`;

    // 0) Checagem de existência (para separar path incorreto vs policy)
    await ImageService.assertFileExistsInPending(
      image.user_id,
      fileName,
      image.storage_path
    );

    console.log("[ImageService] Movendo arquivo:", image.storage_path, "->", publicPath);

    // 1) Move no storage
    const { error: moveError } = await supabase.storage
      .from(ImageService.BUCKET)
      .move(image.storage_path, publicPath);

    if (moveError) {
      console.error("[ImageService] Erro ao mover arquivo:", moveError);

      // Mensagem mais útil para orientar policy vs path
      throw new Error(
        `[ImageService] Falha no move (pending -> public): ${moveError.message}. ` +
          `Causas mais prováveis: (1) policy de UPDATE no storage.objects para admin não existe; ` +
          `(2) o objeto não está no caminho "${image.storage_path}".`
      );
    }

    // 2) Atualiza registro no banco (forçando retorno)
    const updatePayload = {
      status: "approved",
      storage_path: publicPath,
      moderated_by: adminId,
      moderated_at: new Date().toISOString(),
    };

    console.log("[ImageService] Atualizando registro no banco:", {
      id: image.id,
      ...updatePayload,
    });

    const { data: updated, error: updateError } = await supabase
      .from("user_images")
      .update(updatePayload)
      .eq("id", image.id)
      .select("id,status,storage_path,moderated_by,moderated_at")
      .single();

    if (updateError || !updated) {
      console.error("[ImageService] Falha ao atualizar banco. Possível RLS/policy.", {
        updateError,
        updated,
      });

      // 3) Rollback do move (public -> pending) para manter consistência
      try {
        console.warn(
          "[ImageService] Revertendo move (public -> pending) devido a falha no banco..."
        );
        const { error: rollbackError } = await supabase.storage
          .from(ImageService.BUCKET)
          .move(publicPath, image.storage_path);

        if (rollbackError) {
          console.error("[ImageService] Falha ao reverter move:", rollbackError);
        }
      } catch (e) {
        console.error("[ImageService] Exceção ao reverter move:", e);
      }

      if (updateError) throw updateError;
      throw new Error(
        "[ImageService] UPDATE não afetou nenhuma linha. Provável bloqueio por RLS/policy."
      );
    }

    console.log("[ImageService] Aprovação concluída. Registro atualizado:", updated);
  }

  static async deleteImage(image: UserImage): Promise<void> {
    const { error: removeError } = await supabase.storage
      .from(ImageService.BUCKET)
      .remove([image.storage_path]);

    if (removeError && removeError.message !== "The resource was not found") {
      console.error("[ImageService] Erro ao remover arquivo do storage:", removeError);
      throw removeError;
    }

    const { data: deleted, error: deleteError } = await supabase
      .from("user_images")
      .delete()
      .eq("id", image.id)
      .select("id")
      .single();

    if (deleteError || !deleted) {
      console.error("[ImageService] Falha ao deletar registro. Possível RLS/policy.", {
        deleteError,
        deleted,
      });

      if (deleteError) throw deleteError;
      throw new Error(
        "[ImageService] DELETE não afetou nenhuma linha. Provável bloqueio por RLS/policy."
      );
    }
  }

  static async listApprovedImages({
    page = 1,
    pageSize = 20,
  }: {
    page?: number;
    pageSize?: number;
  } = {}): Promise<UserImage[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("user_images")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return (data ?? []) as UserImage[];
  }

  static async getSignedUrl(storagePath: string, expiresIn = 60 * 60): Promise<string> {
    const { data, error } = await supabase.storage
      .from(ImageService.BUCKET)
      .createSignedUrl(storagePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  }
}
