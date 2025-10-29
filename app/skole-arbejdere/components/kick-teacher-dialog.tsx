import React from "react";

import { Button as ButtonUi } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/plugins/form";
import { Form } from "@/plugins/form";

import { kickTeacherAction } from "../actions";

interface KickTeacherDialogProps {
  uuid: string;
  name: string;
}

export default function KickTeacherDialog({
  uuid,
  name,
}: KickTeacherDialogProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{"Smid ud " + name}</DialogTitle>

        <DialogDescription>
          Er du sikker på, at du vil smide {name} ud af denne skole?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Form
          schemaKey="kick-teacher"
          context={{
            uuid,
            name,
          }}
          autoCloseDialog="kick-user-close"
          onSubmit={kickTeacherAction}
        >
          <div className="space-x-2">
            <DialogClose asChild>
              <ButtonUi id="kick-user-close" variant="ghost">
                Fortryd
              </ButtonUi>
            </DialogClose>

            <Button
              text="Smid læren ud"
              className="bg-destructive text-white hover:bg-destructive/90 shadow-xs"
            />
          </div>
        </Form>
      </DialogFooter>
    </>
  );
}
