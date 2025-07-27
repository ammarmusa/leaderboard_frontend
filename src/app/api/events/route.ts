import eventEmitter from "@/lib/event-emitter"; // Import the shared emitter
import { WebhookPayload } from "@/app/types";

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection confirmation
      controller.enqueue(
        `data: ${JSON.stringify({
          type: "connected",
          message: "SSE connection established",
        })}\n\n`
      );

      const onWebhookEvent = (data: WebhookPayload) => {
        console.log("SSE route caught event, sending to client:", data.event);
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Start listening for events from the webhook
      eventEmitter.on("webhook-event", onWebhookEvent);
      console.log("SSE client connected and listening for events.");

      // When the client disconnects, stop listening
      request.signal.addEventListener("abort", () => {
        eventEmitter.off("webhook-event", onWebhookEvent);
        console.log("SSE client disconnected.");
        try {
          controller.close();
        } catch (error) {
          console.log("Controller already closed");
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
