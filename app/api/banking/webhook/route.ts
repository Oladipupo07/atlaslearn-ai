import { NextResponse } from "next/server";

/**
 * Webhook receiver for real-time MFB credit/debit transaction alerts
 */
export async function POST(req: Request) {
  try {
    const signature = req.headers.get("mono-webhook-secret");
    const webhookSecret = process.env.MONO_WEBHOOK_SECRET;

    // Optional webhook signature verification
    if (webhookSecret && signature && signature !== webhookSecret) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    // Handle transaction events
    if (event === "mono.events.account_updated" || event === "mono.events.transactions_created") {
      console.log(`[MFB Webhook] Received ${event} for account:`, data?.account?._id);
      // In production, update Firestore user budget ledger or send notification
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
