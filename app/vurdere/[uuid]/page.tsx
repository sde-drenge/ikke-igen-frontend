import { Card, CardHeader } from "@/components/ui/card";
import { Button, Control, Form } from "@/plugins/form";
import TextareaControl from "@/plugins/form/controls/textarea";
import StarsControl from "./components/stars-control";
import { createReviewAction } from "./actions";
import { safeGet } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/services/auth";
import { ROUTES } from "@/lib/constants/routes";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function page({ params }: PageProps) {
  const [{ uuid }, session] = await Promise.all([params, auth()]);

  if (!session) {
    redirect(ROUTES.LOGIN + "?redirect=" + ROUTES.EVALUATE(uuid));
  }

  const { data } = await safeGet<Workplace>(`/workplaces/${uuid}/`);

  if (!data) {
    return notFound();
  }

  return (
    <div className="mt-22">
      <h1 className="text-center text-3xl font-bold">{data.name}</h1>

      <Card className="mx-auto w-full max-w-lg gap-0 mt-10">
        <CardHeader className="pt-4 text-center text-2xl font-bold">
          Hvordan vil du bedømme din oplevelse?
        </CardHeader>

        <Form
          schemaKey="create-review"
          context={{
            workplaceUuid: uuid,
          }}
          redirect={ROUTES.REVIEW(uuid)}
          onSubmit={createReviewAction}
          className="w-full px-8 space-y-6"
        >
          <StarsControl />

          <Control
            input={TextareaControl}
            name="comment"
            label="Fortæl os om din oplevelse"
            placeholder="Beskriv din oplevelse."
          />

          <Control
            name="title"
            label="Giv din anmeldelse en titel"
            placeholder="Hvad vil du helst fremhæve ved din oplevelse?"
          />

          <Button text="Opret anmeldelse" />
        </Form>
      </Card>
    </div>
  );
}
