import { NextRequest, NextResponse } from "next/server";
import { WebhookPayload } from "@/app/types";
import eventEmitter from "@/lib/event-emitter"; // Import the shared emitter

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    console.log("Webhook received, emitting event:", payload.event);

    // Emit a named event with the payload.
    // The /api/events route will be listening for this exact event.
    eventEmitter.emit("webhook-event", payload);

    return NextResponse.json(
      { message: "Webhook received and event emitted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
