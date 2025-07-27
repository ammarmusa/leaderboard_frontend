// Test script to simulate webhook calls
// Run this with: node test-webhook.js

const testWebhook = async () => {
  const webhookUrl = "http://localhost:3000/api/events/webhook";

  // Test new job
  const newJobPayload = {
    event: "new-job",
    data: {
      id: Math.floor(Math.random() * 1000),
      title: `Test Job ${new Date().toLocaleTimeString()}`,
      status: "new",
      contractor: null,
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.006 + (Math.random() - 0.5) * 0.1,
      address: `${Math.floor(Math.random() * 999)} Test St, New York, NY`,
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJobPayload),
    });

    const result = await response.json();
    console.log("Webhook response:", result);
    console.log("Status:", response.status);
  } catch (error) {
    console.error("Error calling webhook:", error);
  }
};

// Test job status update
const testStatusUpdate = async () => {
  const webhookUrl = "http://localhost:3000/api/events/webhook";

  const statusUpdatePayload = {
    event: "status-update",
    data: {
      id: 1, // Assuming job with ID 1 exists
      title: "Updated Test Job",
      status: "assigned",
      contractor: "John Doe",
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Updated St, New York, NY",
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusUpdatePayload),
    });

    const result = await response.json();
    console.log("Status update response:", result);
    console.log("Status:", response.status);
  } catch (error) {
    console.error("Error calling webhook:", error);
  }
};

// Run tests
console.log("Testing webhook endpoints...");
console.log("Make sure your Next.js app is running on localhost:3000");

setTimeout(() => {
  console.log("\n1. Testing new job webhook...");
  testWebhook();
}, 1000);

setTimeout(() => {
  console.log("\n2. Testing status update webhook...");
  testStatusUpdate();
}, 3000);
