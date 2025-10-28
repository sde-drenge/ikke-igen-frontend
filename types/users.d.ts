interface User {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string | null;
  profileColor: string;
  role: "student" | "teacher";
  createdAt: string;
}

type LightUser = Omit<User, "createdAt" | "isActive" | "phoneNumber">;
