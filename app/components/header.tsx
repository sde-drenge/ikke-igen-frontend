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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "@/components/ui/separator";

export default async function Header() {
  const session = await auth();

  return (
    <>
      <header
        id="site-header"
        role="banner"
        className="bg-foreground absolute top-0 left-0 z-10 w-full px-4 flex"
      >
        <nav
          aria-label="Main navigation"
          className="grid mx-auto container grid-cols-10 grid-rows-1 gap-4 p-2"
        >
          <div className="col-span-8 flex items-center md:col-span-4">
            <Link href="/" className="flex items-center gap-x-3 p-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-background">
                Ikke igen
              </span>
            </Link>
          </div>

          <div className="col-span-6 hidden items-center justify-end space-x-8 text-sm md:flex md:text-base">
            {session?.user ? (
              <>
                {(session.user.role === "teacher" ||
                  session.user.role === "teacher-admin") && (
                  <>
                    <Link
                      href={ROUTES.VERIFY_REVIEWS}
                      className="text-background hover:text-primary font-medium transition"
                    >
                      Verificer anmeldelser
                    </Link>

                    <Link
                      href={ROUTES.SCHOOL_WORKERS}
                      className="text-background hover:text-primary font-medium transition"
                    >
                      Lærere
                    </Link>
                  </>
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
              </>
            )}
          </div>
        </nav>

        <Sheet>
          <SheetTrigger aria-label="Åben menu" className="px-3 md:hidden">
            <MenuIcon
              size={32}
              aria-hidden="true"
              className="text-background"
            />
          </SheetTrigger>

          <SheetContent side="right" className="w-1/2">
            <SheetHeader className="text-left">
              <VisuallyHidden>
                <SheetTitle>Navigations menu</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="flex flex-col space-y-4"
            >
              {session?.user ? (
                <>
                  {(session.user.role === "teacher" ||
                    session.user.role === "teacher-admin") && (
                    <>
                      <SheetClose asChild>
                        <Link
                          href={ROUTES.VERIFY_REVIEWS}
                          className="text-foreground px-5 py-2 hover:text-primary font-medium transition"
                        >
                          Verificer anmeldelser
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href={ROUTES.SCHOOL_WORKERS}
                          className="text-foreground px-5 py-2 hover:text-primary font-medium transition"
                        >
                          Lærere
                        </Link>
                      </SheetClose>

                      <Separator />
                    </>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-5 w-fit py-2 cursor-pointer">
                      <span className="whitespace-nowrap text-foreground">
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
                <SheetClose asChild>
                  <Link
                    href={ROUTES.LOGIN}
                    className="text-foreground px-5 py-2 hover:text-primary font-medium transition"
                  >
                    Log ind
                  </Link>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <div className="h-16.5" />
    </>
  );
}
