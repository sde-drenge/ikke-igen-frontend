import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import TechnicalDataForm from "./components/technical-data-form";
import VerificationCodeForm from "./components/verification-code-form";
import UpdateProfileForm from "./components/update-profile-form";

interface PageProperties {
  searchParams: Promise<{
    uuid?: string;
    verified?: string;
  }>;
}

export default async function page({ searchParams }: PageProperties) {
  const awaitedSearchParameters = await searchParams;

  let defaultStep = 0;

  if (awaitedSearchParameters.verified === "true") {
    defaultStep = 2;
  } else if (awaitedSearchParameters.uuid) {
    defaultStep = 1;
  }

  const uuid = awaitedSearchParameters?.uuid || "";

  return (
    <Card className="mx-auto mt-32 w-full max-w-md gap-0">
      <CardHeader className="pt-4 text-center gap-1">
        <CardTitle className="text-2xl font-bold">
          {defaultStep === 0
            ? "Opret en ny konto"
            : defaultStep === 1
            ? "Bekræft din konto"
            : "Færdiggør oprettelse"}
        </CardTitle>

        {defaultStep === 1 && (
          <p>Indtast de 6-tegn kode vi har sendt til dig</p>
        )}
      </CardHeader>

      {defaultStep === 0 ? (
        <TechnicalDataForm key={defaultStep} />
      ) : defaultStep === 1 ? (
        <VerificationCodeForm key={defaultStep} uuid={uuid} />
      ) : defaultStep === 2 ? (
        <UpdateProfileForm key={defaultStep} />
      ) : null}
    </Card>
  );
}
