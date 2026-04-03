import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginUserMutation } from "../api/authApi";
import AnimatedBlob from "../components/AnimatedBlob";
import { setCredentials } from "../store/slices/authSlice";

const inputVariants = {
  rest: { scale: 1 },
  focus: { scale: 1.01 },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  const errorMessage =
    error &&
    ("data" in error
      ? ((error.data as { message?: string })?.message ?? "Login failed.")
      : "Login failed.");

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative"
      animate={{
        background: [
          "linear-gradient(135deg, #0f172a, #1e1b4b)",
          "linear-gradient(135deg, #1e1b4b, #0f172a)",
          "linear-gradient(135deg, #0f172a, #1e1b4b)",
        ],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedBlob
          color="bg-blue-500/35"
          size="w-96 h-96"
          position="absolute top-[-5%] left-[-10%]"
          duration={9}
        />
        <AnimatedBlob
          color="bg-indigo-500/40"
          size="w-md h-112"
          position="absolute bottom-[-10%] right-[-5%]"
          duration={11}
          delay={1}
        />
        <AnimatedBlob
          color="bg-violet-500/35"
          size="w-72 h-72"
          position="absolute top-[30%] right-[10%]"
          duration={8}
          delay={2}
        />
        <AnimatedBlob
          color="bg-cyan-500/30"
          size="w-80 h-80"
          position="absolute bottom-[20%] left-[5%]"
          duration={12}
          delay={0.5}
        />
        <AnimatedBlob
          color="bg-purple-500/30"
          size="w-64 h-64"
          position="absolute top-[10%] right-[30%]"
          duration={7}
          delay={3}
        />
        <AnimatedBlob
          color="bg-sky-500/25"
          size="w-72 h-72"
          position="absolute bottom-[10%] right-[25%]"
          duration={10}
          delay={1.5}
        />

        {/* Floating particles */}
        {[
          { top: "10%", left: "15%", dur: 4, delay: 0 },
          { top: "20%", left: "80%", dur: 5, delay: 0.8 },
          { top: "35%", left: "5%", dur: 3.5, delay: 1.2 },
          { top: "55%", left: "90%", dur: 6, delay: 0.3 },
          { top: "70%", left: "20%", dur: 4.5, delay: 2 },
          { top: "80%", left: "70%", dur: 3, delay: 0.6 },
          { top: "15%", left: "50%", dur: 5.5, delay: 1.8 },
          { top: "45%", left: "60%", dur: 4, delay: 2.5 },
          { top: "60%", left: "40%", dur: 3.5, delay: 0.4 },
          { top: "88%", left: "45%", dur: 5, delay: 1.4 },
          { top: "30%", left: "35%", dur: 6, delay: 2.2 },
          { top: "75%", left: "55%", dur: 4.5, delay: 0.9 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{ top: p.top, left: p.left }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Pulsing glow behind card */}
        <motion.div
          className="absolute -inset-1 rounded-3xl bg-blue-600/30 blur-xl"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Card with floating effect */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10"
        >
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-600/40">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              SkillSync
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Sign in to your account
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div
              variants={inputVariants}
              animate={focusedField === "email" ? "focus" : "rest"}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${focusedField === "email" ? "border-blue-500 shadow-md shadow-blue-500/20" : "border-white/10"} bg-white/5`}
              >
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              variants={inputVariants}
              animate={focusedField === "password" ? "focus" : "rest"}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div
                className={`relative rounded-xl border transition-all duration-200 ${focusedField === "password" ? "border-blue-500 shadow-md shadow-blue-500/20" : "border-white/10"} bg-white/5`}
              >
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
                >
                  <svg
                    className="w-4 h-4 text-red-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-sm text-slate-400"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Register
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
