import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../infra/firebaseService";
import { getUserRole } from "../services/RoleService";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        return;
      }

      const role = await getUserRole(user.uid);
      setAllowed(role === "admin");
    });

    return () => unsub();
  }, []);

  if (allowed === null) return <div>Carregando...</div>;
  if (!allowed) return <div>Você não tem permissão.</div>;

  return <>{children}</>;
}
