import React, { useEffect, useState } from "react";
import { AcervoService, AcervoItem } from "@/models/services/AcervoService";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const empty = { title: "", description: "", category: "", dating: "" };

const CoverImage: React.FC<{ path: string | null }> = ({ path }) => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!path) return;
    AcervoService.getSignedUrl(path).then(setUrl).catch(() => setUrl(""));
  }, [path]);
  if (!path) return <div className="w-24 h-24 bg-muted rounded" />;
  return url ? (
    <img src={url} alt="Capa" className="w-24 h-24 object-cover rounded" />
  ) : (
    <div className="w-24 h-24 bg-muted animate-pulse rounded" />
  );
};

export const AcervoManager: React.FC = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState<AcervoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AcervoItem | null>(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await AcervoService.list());
    } catch (e: any) {
      toast.error("Erro ao carregar acervo: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setFile(null);
    setOpen(true);
  };

  const openEdit = (it: AcervoItem) => {
    setEditing(it);
    setForm({
      title: it.title,
      description: it.description || "",
      category: it.category || "",
      dating: it.dating || "",
    });
    setFile(null);
    setOpen(true);
  };

  const submit = async () => {
    if (!user) return;
    if (form.title.trim().length < 3 || form.title.length > 120) {
      toast.error("Título deve ter entre 3 e 120 caracteres");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Categoria é obrigatória");
      return;
    }
    if ((form.description || "").length > 2000) {
      toast.error("Descrição não pode passar de 2000 caracteres");
      return;
    }
    setSaving(true);
    try {
      let image_path = editing?.image_path || null;
      if (file) image_path = await AcervoService.uploadCover(file);
      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        category: form.category || null,
        dating: form.dating || null,
        image_path,
      };
      if (editing) {
        await AcervoService.update(editing.id, payload, user.uid);
        toast.success("Item atualizado");
      } else {
        await AcervoService.create(payload, user.uid);
        toast.success("Item criado");
      }
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error("Erro ao salvar: " + (e.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const archive = async (it: AcervoItem) => {
    if (!user) return;
    if (!confirm(`Arquivar "${it.title}"? Não aparecerá publicamente.`)) return;
    try {
      await AcervoService.archive(it.id, user.uid);
      toast.success("Item arquivado");
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    }
  };

  const restore = async (it: AcervoItem) => {
    if (!user) return;
    try {
      await AcervoService.restore(it.id, user.uid);
      toast.success("Item restaurado");
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    }
  };

  const remove = async (it: AcervoItem) => {
    if (!confirm(`Excluir definitivamente "${it.title}"?`)) return;
    try {
      await AcervoService.remove(it.id);
      toast.success("Item excluído");
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Acervo ({items.length})</h3>
        <Button onClick={openNew}>+ Novo item</Button>
      </div>

      {loading && <div>Carregando...</div>}
      {!loading && items.length === 0 && (
        <div className="text-sm text-muted-foreground">Nenhum item cadastrado.</div>
      )}

      <div className="grid gap-3">
        {items.map((it) => (
          <Card key={it.id} className="flex items-start gap-4 p-4">
            <CoverImage path={it.image_path} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">{it.title}</span>
                <Badge variant={it.status === "active" ? "default" : "secondary"}>
                  {it.status === "active" ? "Ativo" : "Arquivado"}
                </Badge>
              </div>
              {it.category && <div className="text-xs text-muted-foreground">{it.category}</div>}
              {it.dating && <div className="text-xs text-muted-foreground">{it.dating}</div>}
              {it.description && <p className="text-sm mt-1 line-clamp-2">{it.description}</p>}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => openEdit(it)}>Editar</Button>
              {it.status === "active" ? (
                <Button size="sm" variant="secondary" onClick={() => archive(it)}>Arquivar</Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => restore(it)}>Restaurar</Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => remove(it)}>Excluir</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar item" : "Novo item do acervo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Título*</Label>
              <Input value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Categoria*</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex.: Cerâmica, Foto, Documento" />
            </div>
            <div>
              <Label>Datação</Label>
              <Input value={form.dating} onChange={(e) => setForm({ ...form, dating: e.target.value })} placeholder="Ex.: 1920, Séc. XIX" />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.description} maxLength={2000} rows={4} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Imagem de capa {editing && "(deixe vazio para manter)"}</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={submit} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
