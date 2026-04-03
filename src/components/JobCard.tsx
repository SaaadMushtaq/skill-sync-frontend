import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { type Job, useDeleteJobMutation } from "../api/jobsApi";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
}

const statusBadge: Record<Job["status"], string> = {
  Applied: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Interview: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
  Offer: "bg-green-500/20 text-green-400 border border-green-500/20",
  Rejected: "bg-red-500/20 text-red-400 border border-red-500/20",
};

const statusStrip: Record<Job["status"], string> = {
  Applied: "bg-blue-500",
  Interview: "bg-yellow-400",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

const statusInitialBg: Record<Job["status"], string> = {
  Applied: "bg-blue-500/15 text-blue-400",
  Interview: "bg-yellow-500/15 text-yellow-400",
  Offer: "bg-green-500/15 text-green-400",
  Rejected: "bg-red-500/15 text-red-400",
};

export default function JobCard({ job, onEdit }: JobCardProps) {
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job._id,
    data: { job },
  });

  const formattedDate = new Date(job.appliedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const handleConfirmDelete = async () => {
    await deleteJob(job._id);
    setConfirmDelete(false);
  };

  return (
    <>
      {/* Delete confirmation modal — rendered via portal so it always escapes overflow/stacking contexts */}
      {confirmDelete &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(false)}
          >
            <div
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-1">
                Delete job?
              </h3>
              <p className="text-sm text-slate-400 text-center mb-6">
                <span className="text-white font-medium">{job.role}</span> at{" "}
                <span className="text-white font-medium">{job.company}</span>{" "}
                will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting && (
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <motion.div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing touch-none ${
          isDragging ? "opacity-0" : ""
        }`}
        whileHover={
          isDragging ? {} : { y: -2, backgroundColor: "rgba(255,255,255,0.08)" }
        }
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Status colour strip at top */}
        <div className={`h-1 w-full ${statusStrip[job.status]}`} />

        <div className="p-5 flex flex-col gap-4">
          {/* Company initial + name/role + status badge */}
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${statusInitialBg[job.status]}`}
            >
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-white leading-tight truncate">
                {job.company}
              </p>
              <p className="text-xs text-slate-400 mt-1 truncate">{job.role}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusBadge[job.status]}`}
            >
              {job.status}
            </span>
          </div>

          {/* Date + action buttons */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-xs text-slate-500">{formattedDate}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {/* Edit — stop pointer events so drag doesn't activate */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onEdit(job)}
                className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                aria-label="Edit job"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              {/* Delete */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setConfirmDelete(true)}
                className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label="Delete job"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
