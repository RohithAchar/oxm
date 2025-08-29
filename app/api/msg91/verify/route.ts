import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const providedAccessToken: string | undefined =
      body?.accessToken ||
      body?.access_token ||
      body?.["access-token"] ||
      body?.token;

    if (!providedAccessToken) {
      return NextResponse.json(
        { error: "Missing access token from MSG91 widget" },
        { status: 400 }
      );
    }

    const authkey = process.env.MSG91_AUTHKEY;
    if (!authkey) {
      return NextResponse.json(
        { error: "Server misconfiguration: MSG91_AUTHKEY is not set" },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken"
    );

    const verifyResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        authkey,
        "access-token": providedAccessToken,
      }),
      cache: "no-store",
    });

    const verifyJson = await verifyResponse.json().catch(() => ({}));

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "MSG91 verification failed", details: verifyJson },
        { status: 400 }
      );
    }

    // Return MSG91 verification result to client
    return NextResponse.json(verifyJson, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error", details: String(error) },
      { status: 500 }
    );
  }
}
