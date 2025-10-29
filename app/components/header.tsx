import { ROUTES } from "@/lib/constants/routes";
import Image from "next/image";
import initials from "initials";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutItem from "./logout-item";
import { auth } from "@/services/auth";

export default async function Header() {
  const session = await auth();

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
            {session?.user ? (
              <>
                {session.user.role === "teacher" && (
                  <Link
                    href={ROUTES.VERIFY_REVIEWS}
                    className="text-background hover:text-primary font-medium transition"
                  >
                    Verificer anmeldelser
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
                    <span className="whitespace-nowrap text-background">
                      {session.user.name}
                    </span>

                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profil billede"
                        width={32}
                        height={32}
                        className="size-8 rounded-full"
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor: session.user.profileColor,
                        }}
                        className="text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium"
                      >
                        {initials(session.user.name!)}
                      </div>
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <LogoutItem />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-background hover:text-primary font-medium transition"
                >
                  Log ind
                </Link>

                <Link
                  href={ROUTES.SIGNUP}
                  className="bg-primary hover:bg-secondary text-primary-foreground relative rounded-3xl px-6 py-3 transition-colors"
                >
                  For lærepladser
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <div className="h-16.5" />
    </>
  );
}
