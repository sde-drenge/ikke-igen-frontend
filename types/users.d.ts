interface User {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string | null;
  profileColor: string;
  profilePictureUrl: string | null;
  role: "student" | "teacher" | "teacher-admin";
  createdAt: string;
}

type LightUser = Omit<User, "createdAt" | "isActive" | "phoneNumber">;

interface UserPagination extends Pagination {
  results: LightUser[];
}
