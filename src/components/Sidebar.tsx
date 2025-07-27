"use client";

import { Job, Contractor } from "@/app/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, User, Briefcase } from "lucide-react";

interface SidebarProps {
  jobs: Job[];
  contractors: Contractor[];
}

const Sidebar = ({ jobs, contractors }: SidebarProps) => {
  const totalJobs = jobs.length;
  const assignedJobs = jobs.filter(
    (job) => job.status !== "new" && job.status !== "completed"
  ).length;

  return (
    <div className="h-full w-full bg-gray-900 p-4 space-y-6 overflow-y-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Job Overview</CardTitle>
          <CardDescription className="text-gray-300">
            Live statistics of all jobs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md border border-gray-600">
            <div className="flex items-center space-x-3">
              <Briefcase className="text-blue-400 w-5 h-5" />
              <span className="font-medium text-gray-100">Total Jobs</span>
            </div>
            <span className="font-bold text-xl text-white">{totalJobs}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md border border-gray-600">
            <div className="flex items-center space-x-3">
              <User className="text-orange-400 w-5 h-5" />
              <span className="font-medium text-gray-100">Assigned Jobs</span>
            </div>
            <span className="font-bold text-xl text-white">{assignedJobs}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Contractor Leaderboard</CardTitle>
          <CardDescription className="text-gray-300">
            Top performing contractors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-600 hover:bg-gray-700">
                <TableHead className="w-[50px] text-gray-300 font-semibold">
                  Rank
                </TableHead>
                <TableHead className="text-gray-300 font-semibold">
                  Contractor
                </TableHead>
                <TableHead className="text-right text-gray-300 font-semibold">
                  Jobs
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((contractor, index) => (
                <TableRow
                  key={contractor.name}
                  className="border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="font-medium text-center text-gray-100">
                    {index === 0 ? (
                      <Award className="text-yellow-400 mx-auto w-5 h-5" />
                    ) : (
                      <span className="text-gray-300">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-100 font-medium">
                    {contractor.name}
                  </TableCell>
                  <TableCell className="text-right font-bold text-white">
                    {contractor.assignedJobs}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
