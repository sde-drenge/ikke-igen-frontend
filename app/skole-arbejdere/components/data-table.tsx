import { safeGet } from "@/lib/api";
import { FieldConfig } from "@/plugins/data-table/components/auto-generate-columns";
import { IMenu } from "@/plugins/data-table/components/cells/menu";
import { Table } from "@/plugins/data-table/table";
import { UserXIcon } from "lucide-react";
import KickTeacherDialog from "./kick-teacher-dialog";

type TableTeacherData = User & {
  name: string;
  menu: IMenu<User>[];
};

export default async function DataTable() {
  const [{ data, error }, { data: currentUser }] = await Promise.all([
    safeGet<UserPagination>(`/schools/my-school/teachers/`),
    safeGet<User>(`/users/current/`),
  ]);

  if (!currentUser) {
    return null;
  }

  const teachers = data?.results || [];

  const errorMessage = error ? "Noget gik galt med at hente lærerene" : "";

  const fieldMapping: Partial<
    Record<keyof TableTeacherData, FieldConfig<TableTeacherData>>
  > = {
    name: {
      sortable: true,
      header: "Navn",
    },
    email: {
      sortable: true,
    },
    phoneNumber: {
      header: "Telefonnummer",
    },
    menu: { type: "menu", header: " ", headerClassName: "w-12.5" },
  };

  const tableData = teachers.map((teacher) => ({
    ...teacher,
    name: `${teacher.firstName} ${teacher.lastName}`,
    menu:
      currentUser.role === "teacher-admin" && teacher.uuid !== currentUser.uuid
        ? [
            {
              name: "Smid lærer ud",
              icon: <UserXIcon className="text-destructive" />,
              modalContent: (
                <KickTeacherDialog
                  uuid={teacher.uuid}
                  name={teacher.firstName + " " + teacher.lastName}
                />
              ),
            },
          ]
        : undefined,
  })) as Partial<TableTeacherData>[];

  return (
    <Table
      data={tableData.length > 0 ? tableData : ({} as [])}
      visibleProperties={["name", "email", "phoneNumber", "menu"]}
      fieldMapping={fieldMapping}
      filterableColumns={["name", "email"]}
      filterPlaceholder="Søg efter navn eller email..."
      errorMessage={errorMessage}
      pagination
    />
  );
}
