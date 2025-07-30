"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import { Job, Contractor, WebhookPayload } from "@/app/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Dynamically import the MapComponent to ensure it's only rendered on the client side
const MapWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();

  // Fetch initial jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/jobs"); // Use local proxy API
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jobsData: Job[] = await response.json();

        // Convert string coordinates to numbers for consistent handling
        const normalizedJobs = jobsData.map((job) => ({
          ...job,
          latitude:
            typeof job.latitude === "string"
              ? parseFloat(job.latitude)
              : job.latitude,
          longitude:
            typeof job.longitude === "string"
              ? parseFloat(job.longitude)
              : job.longitude,
        }));

        setJobs(normalizedJobs);
        toast.success(`Loaded ${normalizedJobs.length} jobs from API`);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs from API");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Establish connection to the Server-Sent Events endpoint
    const eventSource = new EventSource("/api/events");

    eventSource.onopen = () => {
      console.log("SSE connection established");
      setIsConnected(true);
      toast.success("Connected to live updates!");
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData: WebhookPayload | { type: "connected" } = JSON.parse(
          event.data
        );

        if ("type" in parsedData && parsedData.type === "connected") {
          return; // Skip connection confirmation message
        }

        const payload = parsedData as WebhookPayload;
        const updatedJob = {
          ...payload.data,
          latitude:
            typeof payload.data.latitude === "string"
              ? parseFloat(payload.data.latitude)
              : payload.data.latitude,
          longitude:
            typeof payload.data.longitude === "string"
              ? parseFloat(payload.data.longitude)
              : payload.data.longitude,
        };

        setJobs((prevJobs) => {
          const jobExists = prevJobs.some((job) => job.id === updatedJob.id);
          if (jobExists) {
            // Update existing job
            return prevJobs.map((job) =>
              job.id === updatedJob.id ? updatedJob : job
            );
          } else {
            // Add new job
            return [...prevJobs, updatedJob];
          }
        });

        if (payload.event === "new-job") {
          toast.success(`New Job Added: ${updatedJob.title}`);
        } else {
          toast(`Job Updated: ${updatedJob.title} is now ${updatedJob.status}`);
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      toast.error("Disconnected from live updates. Retrying...");
      setIsConnected(false);
    };

    // Cleanup on component unmount
    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, []);

  const contractors = useMemo(() => {
    const contractorMap = new Map<string, number>();
    jobs.forEach((job) => {
      if (job.contractor) {
        contractorMap.set(
          job.contractor,
          (contractorMap.get(job.contractor) || 0) + 1
        );
      }
    });

    const sortedContractors: Contractor[] = Array.from(contractorMap.entries())
      .map(([name, assignedJobs]) => ({ name, assignedJobs }))
      .sort((a, b) => b.assignedJobs - a.assignedJobs);

    return sortedContractors;
  }, [jobs]);

  return (
    <ProtectedRoute>
      <main className="flex h-screen w-screen bg-gray-100">
        <Toaster position="top-center" />
        <div className="flex-grow h-full relative">
          {/* User info and logout */}
          <div className="absolute top-4 left-4 z-[1000] flex gap-2">
            <div className="px-3 py-2 rounded-lg bg-gray-800 shadow-xl border border-gray-700">
              <div className="flex items-center space-x-2">
                <span
                  className={`h-3 w-3 rounded-full inline-block ${
                    isConnected
                      ? "bg-green-400 shadow-green-400/50 shadow-lg animate-pulse"
                      : "bg-red-400 shadow-red-400/50 shadow-lg"
                  }`}
                ></span>
                <span
                  className={`text-sm font-medium ${
                    isConnected ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {isConnected ? "Live Updates" : "Disconnected"}
                </span>
              </div>
            </div>

            {/* User info */}
            <div className="px-3 py-2 rounded-lg bg-gray-800 shadow-xl border border-gray-700">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-300">
                  {user?.username || "User"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-300 hover:text-red-200 hover:bg-red-900/20"
                  onClick={logout}
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Jobs count indicator */}
          <div className="absolute top-4 right-4 z-[1000] px-3 py-2 rounded-lg bg-gray-800 shadow-xl border border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-300">
                {isLoading ? "Loading..." : `${jobs.length} Jobs`}
              </span>
            </div>
          </div>

          <MapWithNoSSR jobs={jobs} />
        </div>
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full shadow-lg">
          <Sidebar jobs={jobs} contractors={contractors} />
        </aside>
      </main>
    </ProtectedRoute>
  );
}
