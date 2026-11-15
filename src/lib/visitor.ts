import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export { idPattern };

export async function getVisitorId() {
  const jar = await cookies();
  const stored = jar.get("andrino-visitor")?.value;
  if (stored && idPattern.test(stored)) return stored;

  const value = randomUUID();
  jar.set("andrino-visitor", value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return value;
}
