import MainLayout from "../layouts/MainLayout";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../contexts/LanguageProvider";
import { motion } from "framer-motion";
import {
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  User,
  Code2,
  Database,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const email = "vtkien,it@gmail.com";

  return (
    <MainLayout>
      <Helmet>
        <title>{t("contact")}</title>
      </Helmet>

      <main className="bg-bg-subtle text-text">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute top-20 -right-28 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-300/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-3 lg:px-8 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                  <Sparkles size={16} />
                  {t("contactBadge")}
                </div>

                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-text">
                  {t("contactTitle")}
                </h1>

                <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-text-secondary">
                  {t("contactDesc")}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${email}`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-full bg-primary px-6 py-3
                      text-sm font-semibold text-white
                      hover:bg-primary/85 active:scale-[0.98]
                      transition-all cursor-pointer
                    "
                  >
                    <Send size={18} />
                    {t("contactSendEmail")}
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate("/chats")}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-full border border-border bg-bg px-6 py-3
                      text-sm font-semibold text-text-secondary
                      hover:border-primary hover:text-primary
                      transition-colors cursor-pointer
                    "
                  >
                    <MessageCircle size={18} />
                    {t("contactOpenChat")}
                  </button>
                </div>
              </motion.div>

              {/* PROFILE CARD */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="
                  rounded-[2rem] border border-border bg-bg p-6 md:p-7
                  shadow-[0_22px_70px_rgba(0,0,0,0.10)]
                "
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className="
                      flex h-28 w-28 items-center justify-center
                      rounded-full bg-primary text-white
                      text-4xl font-bold shadow-lg shadow-blue-500/25
                    "
                  >
                    K
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold text-text">
                    {t("contactProfileName")}
                  </h2>

                  <p className="mt-1 text-text-secondary">
                    {t("contactProfileRole")}
                  </p>
                </div>

                <div className="mt-7 space-y-3">
                  <ContactInfoRow
                    icon={<User size={19} />}
                    label={t("contactNameLabel")}
                    value={t("contactProfileName")}
                  />

                  <ContactInfoRow
                    icon={<Calendar size={19} />}
                    label={t("contactBirthYearLabel")}
                    value={t("contactBirthYearValue")}
                  />

                  <ContactInfoRow
                    icon={<GraduationCap size={19} />}
                    label={t("contactSchoolLabel")}
                    value={t("contactSchoolValue")}
                  />

                  <ContactInfoRow
                    icon={<Mail size={19} />}
                    label={t("contactEmailLabel")}
                    value={email}
                  />

                  <ContactInfoRow
                    icon={<MapPin size={19} />}
                    label={t("contactLocationLabel")}
                    value={t("contactLocationValue")}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT + SKILLS */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8">
              {/* ABOUT */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="rounded-3xl border border-border bg-bg p-6 md:p-8 shadow-sm"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <User size={28} />
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-text">
                  {t("contactAboutTitle")}
                </h2>

                <p className="mt-4 leading-relaxed text-text-secondary">
                  {t("contactAboutDesc1")}
                </p>

                <p className="mt-4 leading-relaxed text-text-secondary">
                  {t("contactAboutDesc2")}
                </p>
              </motion.div>

              {/* SKILLS */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="rounded-3xl border border-border bg-bg p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-text">
                  {t("contactSkillsTitle")}
                </h2>

                <p className="mt-3 text-text-secondary">
                  {t("contactSkillsDesc")}
                </p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SkillCard
                    icon={<Code2 size={24} />}
                    title={t("contactFrontendSkill")}
                    desc={t("contactFrontendSkillDesc")}
                  />

                  <SkillCard
                    icon={<Database size={24} />}
                    title={t("contactBackendSkill")}
                    desc={t("contactBackendSkillDesc")}
                  />

                  <SkillCard
                    icon={<ShieldCheck size={24} />}
                    title={t("contactSecuritySkill")}
                    desc={t("contactSecuritySkillDesc")}
                  />

                  <SkillCard
                    icon={<Globe2 size={24} />}
                    title={t("contactRealtimeSkill")}
                    desc={t("contactRealtimeSkillDesc")}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            <div
              className="
                relative overflow-hidden rounded-[2rem] border border-border
                bg-primary px-6 py-10 md:px-10 md:py-12 text-white
                shadow-[0_22px_70px_rgba(59,130,246,0.25)]
              "
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-4xl font-semibold">
                    {t("contactCtaTitle")}
                  </h2>

                  <p className="mt-3 max-w-2xl text-white/80">
                    {t("contactCtaDesc")}
                  </p>
                </div>

                <a
                  href={`mailto:${email}`}
                  className="
                    inline-flex shrink-0 items-center justify-center gap-2
                    rounded-full bg-white px-6 py-3
                    text-sm font-semibold text-primary
                    hover:bg-white/90 active:scale-[0.98]
                    transition-all cursor-pointer
                  "
                >
                  <Mail size={18} />
                  {t("contactEmailMe")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}

function ContactInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-bg-secondary px-4 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-text break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function SkillCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="
        rounded-2xl border border-border bg-bg-subtle p-5
        hover:-translate-y-1 hover:shadow-md
        transition-all duration-300
      "
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="font-semibold text-text">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {desc}
      </p>
    </div>
  );
}