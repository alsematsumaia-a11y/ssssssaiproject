import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { services } from "@/lib/services";

export async function POST(request: Request) {
  try {
    const { serviceIds } = await request.json();
    if (!Array.isArray(serviceIds) || serviceIds.length < 1 || serviceIds.length > services.length) {
      return NextResponse.json({ error: "Choose at least one valid service." }, { status: 400 });
    }
    const chosen = services.filter(s => serviceIds.includes(s.id));
    if (chosen.length !== new Set(serviceIds).size) {
      return NextResponse.json({ error: "One or more selected services are invalid." }, { status: 400 });
    }
    const db = supabaseAdmin();
    const { error } = await db.from("packages").insert({
      service_ids: chosen.map(s => s.id),
      service_names: chosen.map(s => s.name),
      estimated_total: chosen.reduce((sum, s) => sum + s.price, 0)
    });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Package API error:", error);
    return NextResponse.json({ error: "Package could not be saved. Check your Supabase setup and try again." }, { status: 500 });
  }
}
