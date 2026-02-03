import React, { useEffect, useState } from "react";
import { ImageService } from "@/services/ImageService";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserImage } from "@/models/entities/UserImage";

export const ModerationPanel: React.FC = () => {
  const { user } = useAuthContext();
  const [pendingImages, setPendingImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const images = await ImageService.listPendingImages();
      setPendingImages(images);
    } catch (err) {
      setError("Erro ao carregar imagens pendentes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleApprove = async (img: UserImage) => {
    if (!user) return;
    setActionLoading(img.id);
    setError(null);
    setSuccess(null);
    try {
      await ImageService.approveImage(img, user.uid);
      setSuccess("Imagem aprovada com sucesso!");
      // Atualiza a lista buscando novamente do backend para garantir consistência
      await fetchImages();
    } catch (err: any) {
      console.error("Erro detalhado ao aprovar imagem:", err);
      let msg = "Erro ao aprovar imagem. ";
      if (err?.message) msg += err.message;
      else if (typeof err === "string") msg += err;
      else msg += JSON.stringify(err);
      setError(msg);
      alert(msg); // feedback imediato
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (img: UserImage) => {
    setActionLoading(img.id);
    try {
      await ImageService.deleteImage(img);
      // Atualiza a lista buscando novamente do backend para garantir consistência
      await fetchImages();
    } catch (err) {
      console.error("Erro detalhado ao excluir imagem:", err);
      setError("Erro ao excluir imagem. " + (err?.message || err));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Painel de Moderação</h2>
      {loading && <div>Carregando imagens...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {!loading && pendingImages.length === 0 && <div>Nenhuma imagem pendente.</div>}
      <div className="grid gap-4">
        {pendingImages.map(img => (
          <Card key={img.id} className="flex items-center gap-4 p-4">
            <img
              src={img.storage_path ? undefined : ""}
              alt={img.title || "Imagem enviada"}
              className="w-32 h-32 object-cover rounded"
              ref={async (el) => {
                if (el && img.storage_path) {
                  try {
                    // Só tenta buscar signed URL se a imagem ainda existir no storage
                    const url = await ImageService.getSignedUrl(img.storage_path);
                    el.src = url;
                  } catch {
                    el.src = ""; // Se não existir, não mostra nada
                  }
                }
              }}
            />
            <div className="flex-1">
              <div className="font-semibold">{img.title || <span className="italic text-gray-500">Sem título</span>}</div>
              <div className="text-xs text-gray-500">Enviada por: {img.user_id}</div>
              <div className="text-xs text-gray-500">{img.filename}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                disabled={!!actionLoading}
                onClick={() => handleApprove(img)}
              >
                {actionLoading === img.id ? "Aprovando..." : "Aprovar"}
              </Button>
              <Button
                variant="destructive"
                disabled={!!actionLoading}
                onClick={() => handleReject(img)}
              >
                {actionLoading === img.id ? "Excluindo..." : "Rejeitar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
