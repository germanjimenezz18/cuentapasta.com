import { auth } from "@/auth";
import { AuthToggleClient } from "./auth-toggle-client";

export default async function AuthToggle() {
  const session = await auth();

  return <AuthToggleClient user={session?.user} />;
}
