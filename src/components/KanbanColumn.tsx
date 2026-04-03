import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { type Job } from "../api/jobsApi";
import JobCard from "./JobCard";

interface KanbanColumnProps {
  title: string;
  status: Job["status"];
  jobs: Job[];
  onEdit: (job: Job) => void;
}

const borderColors: Record<Job["status"], string> = {
  Applied: "border-blue-500",
  Interview: "border-yellow-400",
  Offer: "border-green-500",
  Rejected: "border-red-500",
};

const badgeColors: Record<Job["status"], string> = {
  Applied: "bg-blue-500/20 text-blue-400",
  Interview: "bg-yellow-500/20 text-yellow-400",
  Offer: "bg-green-500/20 text-green-400",
  Rejected: "bg-red-500/20 text-red-400",
};

const dotColors: Record<Job["status"], string> = {
  Applied: "bg-blue-500",
  Interview: "bg-yellow-400",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

export default function KanbanColumn({
  title,
  status,
  jobs,
  onEdit,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col backdrop-blur-sm border border-t-4 rounded-2xl min-h-48 max-h-[70vh] sm:max-h-none sm:min-h-64 transition-colors duration-200 ${borderColors[status]} ${
        isOver ? "bg-white/10 border-white/25" : "bg-white/5 border-white/10"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-white/5">
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotColors[status]}`} />
        <h2 className="font-bold text-white text-sm tracking-wide flex-1">
          {title}
        </h2>
        <motion.span
          key={jobs.length}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`text-xs font-bold px-2 py-0.5 rounded-full min-w-6 text-center ${badgeColors[status]}`}
        >
          {jobs.length}
        </motion.span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 px-4 pb-4 overflow-y-auto flex-1">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-8 opacity-40">
            <svg
              className="w-8 h-8 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
              />
            </svg>
            <p className="text-sm text-slate-500">No jobs here yet</p>
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job._id} job={job} onEdit={onEdit} />)
        )}
      </div>
    </div>
  );
}
