import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone } = await req.json();

  try {
    const res = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: process.env.MSG91_AUTH_KEY!, // 🔑 from env
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID, // set in env
        mobile: phone,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
