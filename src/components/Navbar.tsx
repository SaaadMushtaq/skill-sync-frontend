import { useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { type RootState } from "../store/store";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogoutConfirmed = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/50"
            animate={{
              boxShadow: [
                "0 0 10px rgba(99,102,241,0.4)",
                "0 0 22px rgba(99,102,241,0.7)",
                "0 0 10px rgba(99,102,241,0.4)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </motion.div>
          <span className="text-lg font-bold tracking-tight bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            SkillSync
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-indigo-300">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">
                {user.name}
              </span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmLogout(true)}
            className="cursor-pointer text-xs font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            Logout
          </motion.button>
        </div>
        {/* Animated gradient border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </nav>

      {/* Logout confirmation modal */}
      {confirmLogout &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmLogout(false)}
          >
            <div
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-1">
                Sign out?
              </h3>
              <p className="text-sm text-slate-400 text-center mb-6">
                You'll need to sign in again to access your jobs.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-slate-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirmed}
                  className="cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
