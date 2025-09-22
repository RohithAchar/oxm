import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "20", 10) || 20,
    100
  );
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("supplier_businesses")
    .select("profile_id, business_name", { count: "exact" })
    .order("business_name", { ascending: true });

  if (q) {
    query = query.or(`business_name.ilike.%${q}%,profile_id.ilike.%${q}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count, page, limit });
}
