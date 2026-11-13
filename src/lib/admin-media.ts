import "server-only";
import { randomUUID } from "node:crypto";
import type { adminSessionClient } from "@/lib/admin-session";

type SessionClient = Awaited<ReturnType<typeof adminSessionClient>>;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadPublicImage(client: SessionClient, file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!extensions[file.type] || file.size > 4_000_000) {
    throw new Error("Image refusée. Choisissez un JPEG, PNG, WebP ou AVIF de moins de 4 Mo.");
  }
  const path = `${folder}/${randomUUID()}.${extensions[file.type]}`;
  const { error } = await client.storage.from("site-media")
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
  if (error) throw new Error("Envoi de l’image impossible. Réessayez avec un fichier plus petit.");
  return client.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export function validImagePath(path: string) {
  if (!path) return true;
  if (path.startsWith("/images/")) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base && path.startsWith(`${base}/storage/v1/object/public/site-media/`));
}
