import { useState, useEffect } from "react";
import {
  motion,
  animate as motionAnimate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../store/store";
import {
  type Job,
  useGetJobsQuery,
  useUpdateJobMutation,
  jobsApi,
} from "../api/jobsApi";
import AnimatedBlob from "../components/AnimatedBlob";
import KanbanColumn from "../components/KanbanColumn";
import JobModal from "../components/JobModal";
import Navbar from "../components/Navbar";

const STATUSES: Job["status"][] = ["Applied", "Interview", "Offer", "Rejected"];

function useCountUp(target: number, delay = 0) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    let stopFn: (() => void) | undefined;
    const timeout = setTimeout(() => {
      const controls = motionAnimate(count, target, { duration: 1.5 });
      stopFn = () => controls.stop();
    }, delay * 1000);
    return () => {
      clearTimeout(timeout);
      stopFn?.();
    };
  }, [count, target, delay]);

  return rounded;
}

interface StatCardProps {
  label: string;
  count: number;
  delay?: number;
}

function StatCard({ label, count, delay = 0 }: StatCardProps) {
  const displayCount = useCountUp(count, delay);

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-1">
      <motion.div
        className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, delay, repeatDelay: 1 }}
      />
      <motion.span className="text-2xl sm:text-3xl font-bold text-white">
        {displayCount}
      </motion.span>
      <span className="text-xs sm:text-sm text-slate-400 text-center">
        {label}
      </span>
    </div>
  );
}

const previewStrip: Record<Job["status"], string> = {
  Applied: "bg-blue-500",
  Interview: "bg-yellow-400",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};
const previewBadge: Record<Job["status"], string> = {
  Applied: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  Interview: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
  Offer: "bg-green-500/20 text-green-400 border border-green-500/20",
  Rejected: "bg-red-500/20 text-red-400 border border-red-500/20",
};
const previewInitialBg: Record<Job["status"], string> = {
  Applied: "bg-blue-500/15 text-blue-400",
  Interview: "bg-yellow-500/15 text-yellow-400",
  Offer: "bg-green-500/15 text-green-400",
  Rejected: "bg-red-500/15 text-red-400",
};

function DragPreviewCard({ job }: { job: Job }) {
  return (
    <div className="bg-slate-800/95 backdrop-blur-xl border border-indigo-500/50 rounded-xl overflow-hidden shadow-2xl shadow-black/60 rotate-2 w-60 cursor-grabbing">
      <div className={`h-0.5 w-full ${previewStrip[job.status]}`} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${previewInitialBg[job.status]}`}
          >
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {job.company}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{job.role}</p>
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${previewBadge[job.status]}`}
          >
            {job.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: jobs = [], isLoading, isError } = useGetJobsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const openAdd = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const dispatch = useDispatch<AppDispatch>();
  const [updateJob] = useUpdateJobMutation();
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveJob((event.active.data.current as { job: Job }).job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);
    if (!over) return;
    const job = (active.data.current as { job: Job }).job;
    const newStatus = over.id as Job["status"];
    if (job.status === newStatus) return;
    dispatch(
      jobsApi.util.updateQueryData("getJobs", undefined, (draft) => {
        const target = draft.find((j) => j._id === job._id);
        if (target) target.status = newStatus;
      }),
    );
    updateJob({ id: job._id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-950 to-slate-900">
        <svg
          className="h-10 w-10 animate-spin text-blue-500"
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
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-950 to-slate-900">
        <p className="text-red-400 text-sm bg-white/5 border border-red-500/30 rounded-lg px-5 py-3">
          Failed to load jobs. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col pt-14">
      {/* Animated gradient background */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)",
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <AnimatedBlob
        color="bg-blue-500/35"
        size="w-96 h-96"
        position="fixed top-0 right-0 z-0 pointer-events-none"
        duration={12}
      />
      <AnimatedBlob
        color="bg-violet-500/30"
        size="w-80 h-80"
        position="fixed bottom-0 left-0 z-0 pointer-events-none"
        duration={15}
      />
      <AnimatedBlob
        color="bg-cyan-500/25"
        size="w-72 h-72"
        position="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        duration={10}
      />

      <Navbar />

      <main className="relative z-10 flex-1 px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Job Tracker
          </h1>
          <motion.button
            onClick={openAdd}
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 0 0px rgba(99,102,241,0.4)",
                "0 0 20px rgba(99,102,241,0.8)",
                "0 0 0px rgba(99,102,241,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Job
          </motion.button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total Applied" count={jobs.length} delay={0} />
          <StatCard
            label="Interviews"
            count={jobs.filter((j) => j.status === "Interview").length}
            delay={0.1}
          />
          <StatCard
            label="Offers"
            count={jobs.filter((j) => j.status === "Offer").length}
            delay={0.2}
          />
          <StatCard
            label="Rejections"
            count={jobs.filter((j) => j.status === "Rejected").length}
            delay={0.3}
          />
        </div>

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATUSES.map((status, i) => (
              <motion.div
                key={status}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(99,102,241,0)",
                    "0 0 20px rgba(99,102,241,0.1)",
                    "0 0 0px rgba(99,102,241,0)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
                className="rounded-2xl"
              >
                <KanbanColumn
                  title={status}
                  status={status}
                  jobs={jobs.filter((j) => j.status === status)}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
            {activeJob ? <DragPreviewCard job={activeJob} /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      <JobModal
        isOpen={isModalOpen}
        onClose={handleClose}
        initialData={selectedJob ?? undefined}
      />
    </div>
  );
}
