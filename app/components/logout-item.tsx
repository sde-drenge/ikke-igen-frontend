"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/lib/constants/routes";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutItem() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });

    router.replace(ROUTES.LOGIN);
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOutIcon />

      <span>Log ud</span>
    </DropdownMenuItem>
  );
}
