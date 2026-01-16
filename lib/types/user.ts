export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "user" | "editor"; // Custom field
  createdAt: number;
  isPremium: boolean;
}
