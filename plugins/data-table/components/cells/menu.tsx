import React, { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IMenuLink {
  name: string;
  link: string | undefined;
  active?: boolean;
  icon?: React.JSX.Element;
  action?: never;
  modalContent?: never;
}

interface IMenuAction<Item> {
  name: string;
  action: (item: Item) => Promise<ActionResponse>;
  active?: boolean;
  icon?: React.JSX.Element;
  link?: never;
  modalContent?: never;
}

interface IMenuModal {
  name: string;
  modalContent: React.ReactNode;
  active?: boolean;
  icon?: React.JSX.Element;
  action?: never;
  link?: never;
}

export type IMenu<Item> = IMenuLink | IMenuAction<Item> | IMenuModal;

export function Menu<Item>({
  value,
  item,
}: {
  value: IMenu<Item>[];
  item: Item;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );

  const handleNavigation = (link: string) => {
    router.push(link);
  };

  const handlePrefetch = (link: string) => router.prefetch(link);

  const handleAction = async (
    action: (item: Item) => Promise<ActionResponse>
  ) => {
    const response = await action(item);

    if (response.error) {
      const errorMessage =
        typeof response.error === "string"
          ? response.error
          : "Ups noget gik galt!";

      toast.error(errorMessage);
      return;
    }

    if (response.success) {
      toast.success(response.success);
    }
  };

  const handleModal = (content: React.ReactNode) => {
    setModalContent(content);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setModalContent(null);
    setOpen(false);
  };

  if (!value.length) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex cursor-pointer items-center">
          <EllipsisIcon size={16} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-fit min-w-32 items-center p-1"
        >
          {value.map(({ active = true, ...menuItem }) => {
            const isLink = "link" in menuItem && menuItem.link;
            const isAction = "action" in menuItem && menuItem.action;
            const isModal = "modalContent" in menuItem && menuItem.modalContent;

            const handleClick = () => {
              if (isLink && menuItem.link) {
                handleNavigation(menuItem.link);
              } else if (isAction) handleAction(menuItem.action);
              else if (isModal) handleModal(menuItem.modalContent);
            };

            const handleMouseOver = () => {
              if (isLink && menuItem.link) handlePrefetch(menuItem.link);
            };

            const isDisabled =
              !active || ((!isLink || !menuItem.link) && !isAction && !isModal);

            return (
              <DropdownMenuItem
                key={menuItem.name}
                disabled={isDisabled}
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                className="h-9"
              >
                {menuItem.icon}

                {menuItem.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={handleDialogClose}>
        {modalContent && <DialogContent>{modalContent}</DialogContent>}
      </Dialog>
    </>
  );
}
