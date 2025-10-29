import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import DataTable from "./components/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRoundPlusIcon } from "lucide-react";
import { Button as ButtonUI } from "@/components/ui/button";
import { Button, Control, Form } from "@/plugins/form";
import { inviteTeacherAction } from "./actions";

export default function page() {
  return (
    <div className="flex-col md:flex max-w-6xl mx-auto py-10 px-6">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="flex items-center space-x-2 text-3xl font-bold">
            <span>Lærer</span>
          </h2>

          <p className="text-muted-foreground">
            Her kan du som skolearbejder se andre lærer i din skole.
          </p>
        </div>

        <Card className="not-sm:-mx-4 gap-0">
          <CardHeader className="pb-0">
            <Dialog>
              <DialogTrigger asChild>
                <ButtonUI className="w-fit gap-2 cursor-pointer">
                  <UserRoundPlusIcon className="size-4!" />

                  <span>Inviter en lærer</span>
                </ButtonUI>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inviter en lærer</DialogTitle>

                  <DialogDescription>
                    Indtast e-mailadressen du ønsker at invitere som lærer på
                    din skole.
                  </DialogDescription>
                </DialogHeader>

                <Form
                  schemaKey="invite-teacher"
                  onSubmit={inviteTeacherAction}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <Control
                    type="email"
                    name="email"
                    label="E-mailadresse"
                    placeholder="john@doe.com"
                    wrapperClassName="flex-1"
                  />

                  <Button
                    text="Send invitation"
                    className="hover:bg-secondary mt-auto"
                  />
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            <Suspense fallback={<></>}>
              <DataTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
