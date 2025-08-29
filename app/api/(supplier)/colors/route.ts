import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("supplier_colors")
    .select("id, name, hex_code, created_at")
    .eq("supplier_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name: string | undefined = body?.name;
  const hex: string | undefined = body?.hex || body?.hex_code;

  if (!name || !hex) {
    return NextResponse.json(
      { error: "name and hex are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("supplier_colors")
    .insert({ supplier_id: user.id, name, hex_code: hex })
    .select("id, name, hex_code, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}
