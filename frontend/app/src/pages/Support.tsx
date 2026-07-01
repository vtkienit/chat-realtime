import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../contexts/LanguageProvider";
import { motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Wifi,
} from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const faqItems = [
  {
    icon: <Wifi size={22} />,
    questionKey: "supportFaqRealtimeQuestion",
    answerKey: "supportFaqRealtimeAnswer",
  },
  {
    icon: <UserPlus size={22} />,
    questionKey: "supportFaqCreateAccountQuestion",
    answerKey: "supportFaqCreateAccountAnswer",
  },
  {
    icon: <Lock size={22} />,
    questionKey: "supportFaqLoginQuestion",
    answerKey: "supportFaqLoginAnswer",
  },
  {
    icon: <MessageCircle size={22} />,
    questionKey: "supportFaqStartChatQuestion",
    answerKey: "supportFaqStartChatAnswer",
  },
  {
    icon: <ShieldCheck size={22} />,
    questionKey: "supportFaqConversationQuestion",
    answerKey: "supportFaqConversationAnswer",
  },
  {
    icon: <HelpCircle size={22} />,
    questionKey: "supportFaqMessageErrorQuestion",
    answerKey: "supportFaqMessageErrorAnswer",
  },
] as const;

export default function Support() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{t("support")}</title>
      </Helmet>

      <main className="bg-bg-subtle text-text">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute top-24 -right-24 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-3 lg:px-8 py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                <Sparkles size={16} />
                {t("supportBadge")}
              </div>

              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-text leading-tight">
                {t("supportTitle")}
              </h1>

              <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-text-secondary">
                {t("supportDesc")}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/chats")}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-full bg-primary px-6 py-3
                    text-sm font-semibold text-white
                    hover:bg-primary/85 active:scale-[0.98]
                    transition-all cursor-pointer
                  "
                >
                  <MessageCircle size={18} />
                  {t("supportChatNow")}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/contact")}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-full border border-border bg-bg px-6 py-3
                    text-sm font-semibold text-text-secondary
                    hover:border-primary hover:text-primary
                    transition-colors cursor-pointer
                  "
                >
                  <Mail size={18} />
                  {t("supportContactUs")}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* QUICK HELP */}
        <section className="py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-4xl font-semibold text-text">
                {t("supportQuickHelp")}
              </h2>

              <p className="mt-3 max-w-2xl text-text-secondary">
                {t("supportQuickHelpDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <SupportCard
                icon={<UserPlus size={26} />}
                title={t("supportAccountTitle")}
                desc={t("supportAccountDesc")}
              />

              <SupportCard
                icon={<ShieldCheck size={26} />}
                title={t("supportPrivacyTitle")}
                desc={t("supportPrivacyDesc")}
              />

              <SupportCard
                icon={<Wifi size={26} />}
                title={t("supportRealtimeTitle")}
                desc={t("supportRealtimeDesc")}
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-3 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
              <div>
                <div className="mb-7">
                  <h2 className="text-2xl md:text-4xl font-semibold text-text">
                    {t("supportFaqTitle")}
                  </h2>

                  <p className="mt-3 max-w-2xl text-text-secondary">
                    {t("supportFaqDesc")}
                  </p>
                </div>

                <div className="space-y-3">
                  {faqItems.map((item, index) => {
                    const isOpen = openIndex === index;

                    return (
                      <motion.div
                        key={item.questionKey}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        className="
                          overflow-hidden rounded-2xl border border-border
                          bg-bg shadow-sm
                        "
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          className="
                            flex w-full items-center justify-between gap-4
                            px-4 md:px-5 py-4 text-left
                            hover:bg-bg-secondary/70
                            transition-colors cursor-pointer
                          "
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={clsx(
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                                isOpen
                                  ? "bg-primary text-white"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              {item.icon}
                            </div>

                            <h3 className="font-semibold text-text text-base md:text-lg">
                              {t(item.questionKey)}
                            </h3>
                          </div>

                          <ChevronDown
                            size={21}
                            className={clsx(
                              "shrink-0 text-text-secondary transition-transform duration-200",
                              isOpen && "rotate-180 text-primary"
                            )}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 md:px-5 pb-5 pl-[72px] md:pl-[76px]">
                            <p className="text-sm md:text-base leading-relaxed text-text-secondary">
                              {t(item.answerKey)}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* SIDE CARD */}
              <aside className="lg:sticky lg:top-28 h-fit">
                <div
                  className="
                    rounded-3xl border border-border bg-bg
                    p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]
                  "
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-500/20">
                    <HelpCircle size={28} />
                  </div>

                  <h3 className="text-2xl font-semibold text-text">
                    {t("supportNeedHelpTitle")}
                  </h3>

                  <p className="mt-3 text-text-secondary leading-relaxed">
                    {t("supportNeedHelpDesc")}
                  </p>

                  <div className="mt-6 rounded-2xl bg-bg-secondary p-4">
                    <p className="text-sm font-semibold text-text">
                      {t("supportEmailLabel")}
                    </p>

                    <p className="mt-1 text-sm text-primary font-medium break-all">
                      vtkien.it@gmail.com
                    </p>
                  </div>

                  <p className="mt-4 text-sm text-text-tertiary">
                    {t("supportResponseTime")}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}

function SupportCard({
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
        rounded-3xl border border-border bg-bg p-6
        shadow-sm hover:shadow-lg hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-text">{title}</h3>

      <p className="mt-2 text-sm md:text-base leading-relaxed text-text-secondary">
        {desc}
      </p>
    </div>
  );
}