/**
 * Represents a job in the system.
 */
export interface Job {
  id: number;
  title: string;
  type?: number; // Optional type field from API
  status: "new" | "assigned" | "in_progress" | "completed";
  contractor: string | null;
  latitude: string | number; // API returns string, but we can handle both
  longitude: string | number; // API returns string, but we can handle both
  address: string;
}

export interface Contractor {
  name: string;
  assignedJobs: number;
}

export interface WebhookPayload {
  event: "new-job" | "status-update";
  data: Job;
}
