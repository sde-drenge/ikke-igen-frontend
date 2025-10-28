import { ROUTES } from "@/lib/constants/routes";
import { Button, Control, Form } from "@/plugins/form";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { technicalDataSignupAction } from "../actions";

export default function TechnicalDataForm() {
  return (
    <Form
      schemaKey="technical-data-signup"
      encryptedFields={["email", "password", "password2"]}
      onSubmit={technicalDataSignupAction}
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

        <div className="relative">
          <LockIcon
            size={16}
            aria-hidden="true"
            className="absolute top-8 left-3"
          />

          <Control
            type="password"
            name="password2"
            label="Bekræft Adgangskode"
            placeholder="••••••••••••"
            required
            className="pl-9"
          />
        </div>

        <Button
          text="Fortsæt"
          aria-label="Fortsæt"
          className="mt-4 w-full rounded-xl"
        />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {"Har du allerede en konto? "}
          </span>

          <Link
            href={ROUTES.LOGIN}
            className="text-primary hover:text-primary/90"
          >
            {"Log ind"}
          </Link>
        </div>
      </div>
    </Form>
  );
}
