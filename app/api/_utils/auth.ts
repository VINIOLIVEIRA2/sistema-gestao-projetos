import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type AuthPayload = {
  userId: string;
};

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  return { userId: payload.userId };
}
