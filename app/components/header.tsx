import { ROUTES } from "@/lib/constants/routes";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
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

            <Link
              href={ROUTES.LOGIN}
              className="text-background hover:text-primary font-medium transition"
            >
              Log ind
            </Link>
          </div>
        </nav>
      </header>

      <div className="h-16.5" />
    </>
  );
}
