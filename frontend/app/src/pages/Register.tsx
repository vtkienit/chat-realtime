import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageProvider";
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
  const { t } = useLanguage();

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
      newErrors.name = t("registerNameRequired");
    } else if (form.name.trim().length < 2) {
      newErrors.name = t("registerNameMinLength");
    }

    if (!form.email.trim()) {
      newErrors.email = t("registerEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("registerEmailInvalid");
    }

    if (!form.password.trim()) {
      newErrors.password = t("registerPasswordRequired");
    } else if (form.password.length < 4) {
      newErrors.password = t("registerPasswordMinLength");
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = t("registerConfirmPasswordRequired");
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = t("registerPasswordNotMatch");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getApiErrorMessage = (message?: string) => {
    if (!message) return t("registerFailed");

    if (message === "Email already exists") {
      return t("registerEmailAlreadyExists");
    }

    return message;
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
        throw new Error(getApiErrorMessage((data as ApiErrorResponse).message));
      }

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError(t("somethingWentWrong"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-subtle text-text">
      <Helmet>
        <title>{t("register")}</title>
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
        {t("home")}
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
              {t("registerBadge")}
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-text leading-tight">
              {t("registerHeroTitle1")}
              <br />
              {t("registerHeroTitle2")}
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              {t("registerHeroDesc")}
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
              <InfoCard
                icon={<MessageCircle size={22} />}
                title={t("registerFeatureChatTitle")}
                desc={t("registerFeatureChatDesc")}
              />

              <InfoCard
                icon={<ShieldCheck size={22} />}
                title={t("registerFeatureSafeTitle")}
                desc={t("registerFeatureSafeDesc")}
              />

              <InfoCard
                icon={<Zap size={22} />}
                title={t("registerFeatureFastTitle")}
                desc={t("registerFeatureFastDesc")}
              />

              <InfoCard
                icon={<UserPlus size={22} />}
                title={t("registerFeatureSimpleTitle")}
                desc={t("registerFeatureSimpleDesc")}
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
                {t("signup")}
              </h2>

              <p className="mt-2 text-base text-text-secondary">
                {t("registerFormDesc")}
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
                  {t("name")}
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
                    placeholder={t("registerNamePlaceholder")}
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
                  {t("email")}
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
                    placeholder={t("registerEmailPlaceholder")}
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
                  {t("password")}
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
                    placeholder={t("registerPasswordPlaceholder")}
                    className="
                      w-full bg-transparent text-base text-text outline-none
                      placeholder:text-text-tertiary
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                    aria-label={
                      showPassword
                        ? t("registerHidePassword")
                        : t("registerShowPassword")
                    }
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
                  {t("confirmPassword")}
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
                    placeholder={t("registerConfirmPasswordPlaceholder")}
                    className="
                      w-full bg-transparent text-base text-text outline-none
                      placeholder:text-text-tertiary
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                    aria-label={
                      showConfirmPassword
                        ? t("registerHideConfirmPassword")
                        : t("registerShowConfirmPassword")
                    }
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
                {isSubmitting ? t("creatingAccount") : t("createAccount")}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-text-secondary">
              {t("alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary/80"
              >
                {t("login")}
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