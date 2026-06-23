import React, { useEffect, useState } from "react";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { ProfileService } from "@/models/services/ProfileService";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { HistoriaHeader } from "@/components/HistoriaHeader";
import { toast } from "sonner";
import { Loading } from "@/components/Loading";

const ProfileInner: React.FC = () => {
  const { user } = useAuthContext();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    ProfileService.getMine(user.uid)
      .then((p) => {
        setDisplayName(p?.display_name || user.displayName || "");
        setAvatarUrl(p?.avatar_url || user.photoURL || "");
      })
      .catch(() => toast.error("Erro ao carregar perfil"))
      .finally(() => setLoading(false));
  }, [user]);

  const save = async () => {
    if (!user) return;
    if (displayName.trim().length < 2) {
      toast.error("Nome deve ter no mínimo 2 caracteres");
      return;
    }
    setSaving(true);
    try {
      await ProfileService.update(user.uid, {
        display_name: displayName.trim(),
        avatar_url: avatarUrl || null,
      });
      toast.success("Perfil atualizado");
    } catch (e: any) {
      toast.error("Erro: " + (e.message || ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;


  return (
    <div className="min-h-screen bg-museum-dark">
      <HistoriaHeader />
      <section className="museum-section">
        <div className="museum-container max-w-2xl">
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Meu perfil</h2>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div>
              <Label>Nome de exibição</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80} />
            </div>
            <div>
              <Label>URL do avatar</Label>
              <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
              {avatarUrl && (
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full mt-2 object-cover" />
              )}
            </div>
            <Button onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

const Profile: React.FC = () => (
  <PrivateRoute>
    <ProfileInner />
  </PrivateRoute>
);

export default Profile;
