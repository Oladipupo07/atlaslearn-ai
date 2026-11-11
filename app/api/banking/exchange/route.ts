import { NextResponse } from "next/server";

/**
 * Exchange temporary authorization code for permanent account ID
 * Supports live Mono API if MONO_SECRET_KEY is defined, else graceful sandbox fallback
 */
export async function POST(req: Request) {
  try {
    const { code, institutionId } = await req.json();

    const monoSecKey = process.env.MONO_SECRET_KEY;

    if (monoSecKey && code && !code.startsWith("sandbox_")) {
      const response = await fetch("https://api.withmono.com/v2/accounts/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": monoSecKey,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "Failed to authenticate with Mono" },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        accountId: data.id,
        isLive: true,
      });
    }

    // Default Sandbox fallback response
    return NextResponse.json({
      success: true,
      accountId: `mfb_mono_${Date.now()}`,
      institutionId: institutionId || "kuda",
      isLive: false,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
