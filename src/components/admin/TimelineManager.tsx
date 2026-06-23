import React, { useEffect, useState } from "react";
import { TimelineService, TimelineEvent } from "@/models/services/TimelineService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const empty = { year: new Date().getFullYear(), title: "", description: "", icon: "", display_order: 0 };

export const TimelineManager: React.FC = () => {
  const [items, setItems] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TimelineEvent | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await TimelineService.list());
    } catch (e: any) {
      toast.error("Erro ao carregar timeline: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (it: TimelineEvent) => {
    setEditing(it);
    setForm({
      year: it.year,
      title: it.title,
      description: it.description || "",
      icon: it.icon || "",
      display_order: it.display_order,
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.title.trim()) return toast.error("Título obrigatório");
    if (!Number.isInteger(Number(form.year))) return toast.error("Ano inválido");
    setSaving(true);
    try {
      const payload = {
        year: Number(form.year),
        title: form.title.trim(),
        description: form.description || null,
        icon: form.icon || null,
        display_order: Number(form.display_order) || 0,
      };
      if (editing) await TimelineService.update(editing.id, payload);
      else await TimelineService.create(payload);
      toast.success("Salvo");
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it: TimelineEvent) => {
    if (!confirm(`Excluir "${it.title}"?`)) return;
    try {
      await TimelineService.remove(it.id);
      toast.success("Excluído");
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Linha do tempo ({items.length})</h3>
        <Button onClick={openNew}>+ Novo evento</Button>
      </div>
      {loading && <div>Carregando...</div>}
      {!loading && items.length === 0 && (
        <div className="text-sm text-muted-foreground">Nenhum evento cadastrado.</div>
      )}
      <div className="grid gap-3">
        {items.map((it) => (
          <Card key={it.id} className="p-4 flex items-start gap-4">
            <div className="text-xl font-bold text-primary w-16">{it.year}</div>
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              {it.description && <p className="text-sm text-muted-foreground">{it.description}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(it)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(it)}>Excluir</Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar evento" : "Novo evento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Ano*</Label>
              <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Título*</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Ordem de exibição</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
