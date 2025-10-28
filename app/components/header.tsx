"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/constants/routes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import initials from "initials";
import Link from "next/link";

export default function Header() {
  const session = useSession();

  return (
    <>
      <header
        id="site-header"
        role="banner"
        className="bg-foreground absolute top-0 left-0 z-10 w-full px-4"
      >
        <nav
          aria-label="Main navigation"
          className="grid mx-auto container grid-cols-10 grid-rows-1 gap-4 p-2"
        >
          <div className="col-span-8 flex items-center md:col-span-4">
            <Link href="/" className="flex items-center gap-x-3 p-2">
              <Image src="/logo.svg" alt="Logo" width={140} height={34} />
            </Link>
          </div>

          <div className="col-span-6 hidden items-center justify-end space-x-8 text-sm md:flex md:text-base">
            <Link
              href={ROUTES.WRITE_A_REVIEW}
              className="text-background hover:text-primary font-medium transition"
            >
              Skriv en anmeldelse
            </Link>

            {session.status === "authenticated" ? (
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-background">
                  {session.data.user.name}
                </span>

                {session.data.user.image ? (
                  <Image
                    src={session.data.user.image}
                    alt="Profil billede"
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: session.data.user.profileColor }}
                    className="text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium"
                  >
                    {initials(session.data.user.name!)}
                  </div>
                )}
              </div>
            ) : session.status === "loading" ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="text-background hover:text-primary font-medium transition"
              >
                Log ind
              </Link>
            )}
          </div>
        </nav>
      </header>

      <div className="h-16.5" />
    </>
  );
}
