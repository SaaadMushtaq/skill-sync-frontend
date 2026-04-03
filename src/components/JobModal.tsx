import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  type Job,
  useAddJobMutation,
  useUpdateJobMutation,
} from "../api/jobsApi";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Job;
}

const todayISO = () => new Date().toISOString().split("T")[0];

const STATUS_OPTIONS: Job["status"][] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

interface FormState {
  company: string;
  role: string;
  status: Job["status"];
  notes: string;
  appliedAt: string;
}

const buildForm = (job?: Job): FormState => ({
  company: job?.company ?? "",
  role: job?.role ?? "",
  status: job?.status ?? "Applied",
  notes: job?.notes ?? "",
  appliedAt: job?.appliedAt ? job.appliedAt.split("T")[0] : todayISO(),
});

export default function JobModal({
  isOpen,
  onClose,
  initialData,
}: JobModalProps) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<FormState>(() => buildForm(initialData));
  const [error, setError] = useState<string | null>(null);

  const [addJob, { isLoading: isAdding }] = useAddJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const isLoading = isAdding || isUpdating;

  // React "adjust state during render" pattern — avoids useEffect for derived state.
  // Track a key representing which job (or blank form) is open so we reset when it changes.
  const formKey = isOpen ? (initialData?._id ?? "new") : "closed";
  const [prevFormKey, setPrevFormKey] = useState(formKey);
  if (prevFormKey !== formKey) {
    setPrevFormKey(formKey);
    setForm(buildForm(isOpen ? initialData : undefined));
    setError(null);
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditMode) {
        await updateJob({ id: initialData._id, ...form }).unwrap();
      } else {
        await addJob(form).unwrap();
      }
      onClose();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal panel — stop propagation so clicking inside doesn't close */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isEditMode ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            {isEditMode ? "Edit Job" : "Add Job"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Company <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Acme Corp"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Role <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Frontend Engineer"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setField("status", e.target.value as Job["status"])
              }
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&>option]:bg-slate-800"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Applied At */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Applied At
            </label>
            <input
              type="date"
              value={form.appliedAt}
              onChange={(e) => setField("appliedAt", e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 scheme-dark"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Optional notes..."
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {isLoading && (
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
              {isEditMode ? "Update Job" : "Add Job"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
