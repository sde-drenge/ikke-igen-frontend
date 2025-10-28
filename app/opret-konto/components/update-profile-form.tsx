import { Button, Control, Form } from "@/plugins/form";
import PhoneControl from "@/plugins/form/controls/phone";
import { updateProfileSignupAction } from "../actions";
import SelectSchool from "./select-school";
import SelectEducation from "./select-education";

export default function UpdateProfileForm() {
  return (
    <Form
      schemaKey="update-profile-signup"
      onSubmit={updateProfileSignupAction}
      className="w-full px-8"
    >
      <div className="mt-8 space-y-6">
        <Control
          type="text"
          name="firstName"
          label="Fornavn"
          placeholder="Fornavn"
          maxLength={150}
          required
        />

        <Control
          type="text"
          name="lastName"
          label="Efternavn"
          placeholder="Efternavn"
          maxLength={150}
          required
        />

        <Control
          input={PhoneControl}
          name="phoneNumber"
          label="Telefonnummer"
          inputClassName="flex-1 bg-transparent! border-input! text-foreground!"
        />

        <SelectSchool />

        <SelectEducation />

        <Button
          text="Opret"
          aria-label="Opret"
          className="mt-4 w-full rounded-xl"
        />
      </div>
    </Form>
  );
}
