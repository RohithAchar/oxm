import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 400 });
    }

    const response = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        authkey: process.env.MSG91_API_KEY, // ✅ only server knows this
        "access-token": accessToken,
      }),
    });

    const result = await response.json();
    console.log("MSG91 verification:", result);

    if (result?.message === "success") {
      return NextResponse.json({ valid: true, result });
    } else {
      return NextResponse.json({ valid: false, result }, { status: 401 });
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
