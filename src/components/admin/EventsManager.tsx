import React, { useEffect, useState } from "react";
import { EventService, MuseumEvent } from "@/models/services/EventService";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const empty = { title: "", description: "", event_date: "", location: "" };

export const EventsManager: React.FC = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState<MuseumEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MuseumEvent | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await EventService.listAll());
    } catch (e: any) {
      toast.error("Erro ao carregar eventos: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (it: MuseumEvent) => {
    setEditing(it);
    setForm({
      title: it.title,
      description: it.description || "",
      event_date: it.event_date.slice(0, 16),
      location: it.location || "",
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!user) return;
    if (!form.title.trim()) return toast.error("Título obrigatório");
    if (!form.event_date) return toast.error("Data obrigatória");
    if (!editing && new Date(form.event_date) < new Date()) {
      return toast.error("Data não pode estar no passado para novos eventos");
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        event_date: new Date(form.event_date).toISOString(),
        location: form.location || null,
      };
      if (editing) await EventService.update(editing.id, payload);
      else await EventService.create(payload, user.uid);
      toast.success("Salvo");
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it: MuseumEvent) => {
    if (!confirm(`Excluir "${it.title}"?`)) return;
    try {
      await EventService.remove(it.id);
      toast.success("Excluído");
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Eventos ({items.length})</h3>
        <Button onClick={openNew}>+ Novo evento</Button>
      </div>
      {loading && <div>Carregando...</div>}
      {!loading && items.length === 0 && (
        <div className="text-sm text-muted-foreground">Nenhum evento cadastrado.</div>
      )}
      <div className="grid gap-3">
        {items.map((it) => (
          <Card key={it.id} className="p-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(it.event_date).toLocaleString("pt-BR")}
                {it.location && ` · ${it.location}`}
              </div>
              {it.description && <p className="text-sm mt-1 line-clamp-2">{it.description}</p>}
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
              <Label>Título*</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Data e hora*</Label>
              <Input
                type="datetime-local"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Local</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.description} rows={4} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
