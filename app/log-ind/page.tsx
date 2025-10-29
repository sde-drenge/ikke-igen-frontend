import { Card, CardHeader } from "@/components/ui/card";
import { Button, Control, Form } from "@/plugins/form";
import { loginAction } from "./actions";
import Link from "next/link";
import { LockIcon, MailIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import TriggerFlash from "@/components/trigger-flash";

interface PageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function page({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;

  const redirect = awaitedSearchParams?.redirect || ROUTES.FRONTPAGE;

  return (
    <>
      <Card className="mx-auto mt-32 w-full max-w-md gap-0">
        <CardHeader className="pt-4 text-center text-2xl font-bold">
          Log ind til din konto
        </CardHeader>

        <Form
          schemaKey="login"
          encryptedFields={["email", "password"]}
          onSubmit={loginAction}
          redirect={redirect}
          refresh
          className="w-full px-8"
        >
          <div className="mt-8 space-y-6">
            <div className="relative">
              <MailIcon
                size={16}
                style={{ top: 33 }}
                aria-hidden="true"
                className="absolute left-3"
              />

              <Control
                type="email"
                name="email"
                label="Email adresse"
                placeholder="johndoe@gmail.com"
                required
                className="pl-9"
              />
            </div>

            <div className="relative">
              <LockIcon
                size={16}
                aria-hidden="true"
                className="absolute top-8 left-3"
              />

              <Control
                type="password"
                name="password"
                label="Adgangskode"
                placeholder="••••••••••••"
                required
                className="pl-9"
              />
            </div>

            <Button
              text="Log ind"
              aria-label="Log ind"
              className="mt-4 w-full rounded-xl"
            />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {"Du har ikke en konto? "}
              </span>

              <Link
                href={ROUTES.SIGNUP}
                className="text-primary hover:text-primary/90"
              >
                {"Opret en konto"}
              </Link>
            </div>
          </div>
        </Form>
      </Card>

      <TriggerFlash />
    </>
  );
}
