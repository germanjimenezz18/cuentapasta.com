"use client";
import CuentaPasta from "@/components/cuenta-pasta";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";

export default function Home() {
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
      </header>
      <main className="flex flex-col gap-2  items-center sm:items-start">
        <CuentaPasta />
      </main>
    </div>
  );
}
