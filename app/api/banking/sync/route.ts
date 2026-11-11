import { NextResponse } from "next/server";

/**
 * Sync balances and recent bank transactions from Mono / MFB API
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    const monoSecKey = process.env.MONO_SECRET_KEY;

    if (monoSecKey && accountId && !accountId.startsWith("mfb_acc_") && !accountId.startsWith("mfb_mono_")) {
      // Live Mono Account fetch
      const [accRes, txnRes] = await Promise.all([
        fetch(`https://api.withmono.com/v2/accounts/${accountId}`, {
          headers: { "mono-sec-key": monoSecKey },
        }),
        fetch(`https://api.withmono.com/v2/accounts/${accountId}/transactions?limit=20`, {
          headers: { "mono-sec-key": monoSecKey },
        }),
      ]);

      const accData = await accRes.json();
      const txnData = await txnRes.json();

      return NextResponse.json({
        account: accData.account,
        transactions: txnData.data || [],
        isLive: true,
      });
    }

    return NextResponse.json({
      success: true,
      isLive: false,
      message: "Sandbox account active. Syncing local ledger.",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
