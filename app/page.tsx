import AuthToggle from "@/components/auth-toggle";
import CuentaPasta from "@/components/cuenta-pasta";
import Github from "@/components/github-icon";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-4 pb-20 gap-4 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex w-full pb-2 space-y-6  sm:px-0  ">
        
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-row gap-x-2 justify-end w-full mx-5">
          <Link
            target="_blank"
            href="https://github.com/germanjimenezz18/cuentapasta.com"
            passHref
          >
            <Button variant="outline" size="icon">
              <Github/>
            </Button>
          </Link>
          <ModeToggle />
          <AuthToggle />
        </div>
      </header>
      <main className="flex flex-col gap-2 items-center sm:items-start w-full overflow-x-auto">
        <CuentaPasta />
      </main>
    </div>
  );
}
