import { Button, Control, Form } from "@/plugins/form";
import { verificationsCodeSignupAction } from "../actions";
import OTPControl from "@/plugins/form/controls/otp";

interface VerificationsCodeFormProps {
  uuid: User["uuid"];
}

export default function VerificationCodeForm({
  uuid,
}: VerificationsCodeFormProps) {
  return (
    <Form
      schemaKey="verifications-code-signup"
      context={{
        uuid,
      }}
      onSubmit={verificationsCodeSignupAction}
      className="w-full px-8"
    >
      <div className="mt-8 space-y-6">
        <Control input={OTPControl} name="verificationCode" maxLength={6} />

        <Button
          text="Bekræft"
          aria-label="Bekræft"
          className="mt-4 w-full rounded-xl"
        />
      </div>
    </Form>
  );
}
