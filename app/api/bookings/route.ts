import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, date, time, notes } = body;
    if (![name, phone, service, date, time].every(v => typeof v === "string" && v.trim())) {
      return NextResponse.json({ error: "Please complete all required booking fields." }, { status: 400 });
    }
    if (name.length > 100 || phone.length > 40 || (email && email.length > 150) || notes?.length > 1000) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }
    const db = supabaseAdmin();
    const { error } = await db.from("appointments").insert({
      customer_name: name.trim(), phone: phone.trim(), email: email?.trim() || null,
      service: service.trim(), appointment_date: date, appointment_time: time,
      notes: notes?.trim() || null, status: "Pending"
    });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ error: "Booking could not be saved. Check your Supabase setup and try again." }, { status: 500 });
  }
}
