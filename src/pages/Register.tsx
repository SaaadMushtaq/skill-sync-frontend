import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterUserMutation } from "../api/authApi";
import AnimatedBlob from "../components/AnimatedBlob";
import { setCredentials } from "../store/slices/authSlice";

const inputVariants = {
  rest: { scale: 1 },
  focus: { scale: 1.01 },
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser({ name, email, password }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      navigate("/dashboard");
    } catch (e) {
      console.log("error", e);
    }
  };

  const errorMessage =
    error &&
    ("data" in error
      ? ((error.data as { message?: string })?.message ??
        "Registration failed.")
      : "Registration failed.");

  const fields = [
    {
      id: "name",
      label: "Name",
      type: "text",
      value: name,
      onChange: (v: string) => setName(v),
      placeholder: "John Doe",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      value: email,
      onChange: (v: string) => setEmail(v),
      placeholder: "you@example.com",
      icon: (
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
      ),
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      value: password,
      onChange: (v: string) => setPassword(v),
      placeholder: "••••••••",
      icon: (
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
      ),
    },
  ];

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative"
      animate={{
        background: [
          "linear-gradient(135deg, #0f172a, #164e63)",
          "linear-gradient(135deg, #164e63, #1e1b4b)",
          "linear-gradient(135deg, #1e1b4b, #0f172a)",
          "linear-gradient(135deg, #0f172a, #164e63)",
        ],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      {/* Moving grid overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedBlob
          color="bg-teal-500/20"
          size="w-96 h-96"
          position="absolute -top-20 -left-20"
          duration={10}
        />
        <AnimatedBlob
          color="bg-cyan-500/20"
          size="w-80 h-80"
          position="absolute -bottom-24 -right-16"
          duration={12}
          delay={1}
        />
        <AnimatedBlob
          color="bg-purple-600/20"
          size="w-72 h-72"
          position="absolute top-[40%] -right-10"
          duration={9}
          delay={2.5}
        />
        <AnimatedBlob
          color="bg-indigo-500/15"
          size="w-64 h-64"
          position="absolute -top-16 right-[20%]"
          duration={11}
          delay={0.8}
        />
        <AnimatedBlob
          color="bg-sky-500/15"
          size="w-72 h-72"
          position="absolute bottom-[15%] left-[10%]"
          duration={8}
          delay={1.5}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md flex items-center justify-center"
      >
        {/* Rotating rings behind card */}
        <motion.div
          className="absolute w-125 h-125 rounded-full border-2 border-purple-500/20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-100 h-100 rounded-full border-2 border-blue-500/20 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Card with floating effect */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10"
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
            <p className="text-sm text-slate-400 mt-1">Create your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field, i) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                variants={inputVariants}
                whileInView={focusedField === field.id ? "focus" : "rest"}
              >
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {field.label}
                </label>
                <div
                  className={`relative rounded-xl border transition-all duration-200 ${
                    focusedField === field.id
                      ? "border-blue-500 shadow-md shadow-blue-500/20"
                      : "border-white/10"
                  } bg-white/5`}
                >
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    {field.icon}
                  </span>
                  <input
                    type={field.type}
                    required
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onFocus={() => setFocusedField(field.id)}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white placeholder-slate-500 text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none"
                    placeholder={field.placeholder}
                  />
                </div>
              </motion.div>
            ))}

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
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-slate-400"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
