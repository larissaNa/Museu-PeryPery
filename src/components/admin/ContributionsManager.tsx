import React, { useEffect, useState } from "react";
import { ContributionService, Contribution } from "@/models/services/ContributionService";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const ContributionsManager: React.FC = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<Contribution | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await ContributionService.listPending());
    } catch (e: any) {
      toast.error("Erro ao carregar contribuições: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (c: Contribution) => {
    if (!user) return;
    setBusy(c.id);
    try {
      await ContributionService.approve(c.id, user.uid);
      toast.success("Contribuição aprovada");
      await load();
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    } finally {
      setBusy(null);
    }
  };

  const confirmReject = async () => {
    if (!user || !rejectTarget) return;
    setBusy(rejectTarget.id);
    try {
      await ContributionService.reject(rejectTarget.id, user.uid, reason);
      toast.success("Contribuição rejeitada");
      setRejectTarget(null);
      setReason("");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Erro ao rejeitar");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Contribuições pendentes ({items.length})</h3>
      {loading && <div>Carregando...</div>}
      {!loading && items.length === 0 && (
        <div className="text-sm text-muted-foreground">Nenhuma contribuição pendente.</div>
      )}
      <div className="grid gap-3">
        {items.map((c) => (
          <Card key={c.id} className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge>{c.contribution_type}</Badge>
              <span className="font-semibold">{c.title || "Sem título"}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Por: {c.author_name || c.author_email || c.author_user_id || "Anônimo"}
            </div>
            {c.content && <p className="text-sm whitespace-pre-wrap">{c.content}</p>}
            <div className="flex gap-2 pt-2">
              <Button size="sm" disabled={busy === c.id} onClick={() => approve(c)}>
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy === c.id}
                onClick={() => { setRejectTarget(c); setReason(""); }}
              >
                Rejeitar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar contribuição</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Informe o motivo (mín. 10 caracteres). Ficará registrado para auditoria.
          </p>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!!busy}>
              Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
