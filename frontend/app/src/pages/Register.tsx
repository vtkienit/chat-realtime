import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Zap,
  AlertCircle,
} from "lucide-react";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<RegisterForm>;

type RegisterResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ApiErrorResponse = {
  message?: string;
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
  };

  const validate = () => {
    const newErrors: RegisterErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Password does not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setApiError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data: RegisterResponse | ApiErrorResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiErrorResponse).message || "Register failed"
        );
      }

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-subtle text-text">
      <Helmet>
        <title>Register</title>
      </Helmet>

      <Link
        to="/"
        className="
          fixed left-4 top-4 z-30
          inline-flex items-center gap-2
          rounded-full border border-border bg-bg/90
          px-4 py-2 text-sm font-semibold text-text
          shadow-sm backdrop-blur
          hover:border-primary hover:text-primary
          transition-colors
        "
      >
        <ArrowLeft size={17} />
        Home
      </Link>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-300/10 blur-3xl" />
      </div>

      <section className="relative z-10 min-h-screen max-w-7xl mx-auto px-3 lg:px-8 py-20 flex items-center justify-center">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <Sparkles size={16} />
              Start your realtime journey
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-text leading-tight">
              Create your account,
              <br />
              chat faster with everyone.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              Register to build your personal profile, join conversations, and
              experience smooth realtime messaging.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
              <InfoCard
                icon={<MessageCircle size={22} />}
                title="Chat"
                desc="Send and receive messages instantly."
              />

              <InfoCard
                icon={<ShieldCheck size={22} />}
                title="Safe"
                desc="Your account is protected."
              />

              <InfoCard
                icon={<Zap size={22} />}
                title="Fast"
                desc="Realtime update with WebSocket."
              />

              <InfoCard
                icon={<UserPlus size={22} />}
                title="Simple"
                desc="Create account in seconds."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="
              w-full rounded-3xl border border-border
              bg-bg/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.12)]
              backdrop-blur sm:p-8
            "
          >
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-500/20">
                <UserPlus size={28} strokeWidth={2.3} />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-text">
                Create account
              </h2>

              <p className="mt-2 text-base text-text-secondary">
                Join us and start chatting in realtime.
              </p>
            </div>

            {apiError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Name
                </label>

                <div
                  className="
                    flex items-center gap-3 rounded-xl border border-border
                    bg-bg-secondary px-4 py-3
                    focus-within:border-primary focus-within:bg-bg
                    transition-colors
                  "
                >
                  <User size={20} className="text-text-secondary" />

                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="
                      w-full bg-transparent text-base text-text outline-none
                      placeholder:text-text-tertiary
                    "
                  />
                </div>

                {errors.name && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Email
                </label>

                <div
                  className="
                    flex items-center gap-3 rounded-xl border border-border
                    bg-bg-secondary px-4 py-3
                    focus-within:border-primary focus-within:bg-bg
                    transition-colors
                  "
                >
                  <Mail size={20} className="text-text-secondary" />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="
                      w-full bg-transparent text-base text-text outline-none
                      placeholder:text-text-tertiary
                    "
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Password
                </label>

                <div
                  className="
                    flex items-center gap-3 rounded-xl border border-border
                    bg-bg-secondary px-4 py-3
                    focus-within:border-primary focus-within:bg-bg
                    transition-colors
                  "
                >
                  <Lock size={20} className="text-text-secondary" />

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create your password"
                    className="
                      w-full bg-transparent text-base text-text outline-none
                      placeholder:text-text-tertiary
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Confirm password
                </label>

                <div
                  className="
                    flex items-center gap-3 rounded-xl border border-border
                    bg-bg-secondary px-4 py-3
                    focus-within:border-primary focus-within:bg-bg
                    transition-colors
                  "
                >
                  <Lock size={20} className="text-text-secondary" />

                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="
                      w-full bg-transparent text-base text-text outline-none
                      placeholder:text-text-tertiary
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full rounded-xl bg-primary px-5 py-3
                  text-base font-semibold text-white
                  shadow-lg shadow-blue-500/20
                  hover:bg-primary/85 active:scale-[0.99]
                  transition-all cursor-pointer
                  disabled:cursor-not-allowed disabled:opacity-70
                "
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary/80"
              >
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-text">{title}</h3>

      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
        {desc}
      </p>
    </div>
  );
}