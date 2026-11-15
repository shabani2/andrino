"use server";

import { idPattern, getVisitorId } from "@/lib/visitor";
import { privateSupabase } from "@/lib/supabase";

const pagePath = /^\/(fr|en)(?:\/[^?#]+)?$/;

export async function trackPageView(path: string, entryId?: string) {
  if (!pagePath.test(path) || path.length > 250) return;
  if (entryId && !idPattern.test(entryId)) return;

  const { error } = await privateSupabase().rpc("record_site_page_view", {
    p_visitor_id: await getVisitorId(),
    p_path: path,
    p_entry_id: entryId ?? null,
  });
  if (error) console.error("Unable to record page view", error.message);
}
