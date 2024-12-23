"use client";

import { useTransition } from "react";
import { signOutWithGoogle } from "@/app/actions/authentication";
import { LogOut } from "lucide-react";

export default function SignIn() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutWithGoogle();
    });
  };

  return (
    <div onClick={handleSignOut} className="flex flex-row flex-nowrap items-center gap-x-2">
      <LogOut className="size-4" />
      {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
    </div>
  );
}
