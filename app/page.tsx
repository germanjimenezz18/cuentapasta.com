import { auth } from "@/auth";
import CuentaPasta from "@/components/cuenta-pasta";
import SignIn from "@/components/sign-in";
import { SignOut } from "@/components/sign-out";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="grid  items-center justify-items-center min-h-screen p-4 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className=" commtainer mx-auto  pb-2 space-y-6 px-4 sm:px-0  ">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ModeToggle />

        {session?.user ? (
          <div>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="User Avatar"
                width={25}
                height={25}
              />
            )}
            <SignOut />
          </div>
        ) : (
          <SignIn />
        )}
      </header>
      <main className="flex flex-col gap-2 items-center sm:items-start w-full overflow-x-auto">
        <CuentaPasta />
      </main>
    </div>
  );
}
