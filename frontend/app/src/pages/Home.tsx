import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../contexts/LanguageProvider";
import { motion } from "framer-motion";
import {
  Timer,
  ShieldCheck,
  Truck,
  Award,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import UserCard from "../components/UserCard";
import bannerImg from "../assets/images/home_banner.png";
import useDragScroll from "../hooks/useDragScroll";
import { useNavigate } from "react-router-dom";

type ChatUser = {
  id: number;
  name: string;
  email: string;
  color: string;
  role: string;
};

type UsersPageResponse = {
  content: ChatUser[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type ApiErrorResponse = {
  message?: string;
};

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [timeLeft] = useState("02 : 45 : 12");
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");

  const flashSaleSlider = useDragScroll();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUsersError("Please login to see users.");
      return;
    }

    setIsLoadingUsers(true);
    setUsersError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/users?page=0&size=10",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: UsersPageResponse | ApiErrorResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiErrorResponse).message || "Failed to load users"
        );
      }

      const pageData = data as UsersPageResponse;

      setUsers(pageData.content.slice(0, 10));
    } catch (error) {
      if (error instanceof Error) {
        setUsersError(error.message);
      } else {
        setUsersError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChat = (userId: number) => {
    navigate(`/chats/${userId}`);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{t("home")}</title>
      </Helmet>

      {/* Hero Section - Mobile Focused Header, Large Desktop Presence */}
      <section className="relative w-full h-[400px] md:h-[430px] overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={bannerImg}
            className="w-full h-full object-cover brightness-[0.8]"
            alt="Restorative Comfort"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 md:bg-black/20" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-3 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-semibold text-white tracking-tight mb-6">
              {t("slogan1")},<br />
              {t("slogan2")}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-md">
              {t("heroDesc")}
            </p>

            <button className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary/80 cursor-pointer">
              {t("shopNow")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Flash Sale - Now showing users */}
      <section className="py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            {/* Title */}
            <div>
              <span className="text-primary font-bold text-sm uppercase mb-2">
                {t("limitedTime")}
              </span>

              <h2 className="text-text text-2xl md:text-5xl font-semibold">
                {t("flashSale")}
              </h2>

              {/* Countdown - MOBILE */}
              <div className="flex items-center gap-2 mt-3 md:hidden">
                <Timer size={16} className="text-primary" strokeWidth={2.5} />
                <span className="text-base text-text-secondary">
                  {t("endsIn")}
                </span>
                <span className="text-base text-text font-mono font-semibold">
                  {timeLeft}
                </span>
              </div>
            </div>

            {/* Countdown - DESKTOP */}
            <div className="hidden md:flex items-center gap-3 text-sm bg-bg-secondary px-4 py-2 rounded-full border border-border">
              <Timer size={16} className="text-primary" strokeWidth={2.5} />
              <span className="text-text-secondary">{t("endsIn")}</span>
              <span className="text-text text-base font-mono font-semibold">
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-2 md:mt-4">
            <button
              onClick={() => navigate("/chats")}
              className="text-primary font-semibold flex items-center gap-2 cursor-pointer"
            >
              {t("viewAll")} <ChevronRight size={15} />
            </button>
          </div>

          {isLoadingUsers && (
            <div className="mt-4 flex items-center justify-center rounded-2xl border border-border bg-bg py-12">
              <div className="flex items-center gap-3 text-text-secondary">
                <Loader2 size={22} className="animate-spin" />
                <span className="font-medium">Loading users...</span>
              </div>
            </div>
          )}

          {!isLoadingUsers && usersError && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Cannot load users</p>
                <p className="mt-1 text-sm">{usersError}</p>
              </div>
            </div>
          )}

          {!isLoadingUsers && !usersError && users.length > 0 && (
            <div
              ref={flashSaleSlider.sliderRef}
              {...flashSaleSlider.dragEvents}
              className="
                flex gap-3 lg:gap-5
                overflow-x-auto hide-scrollbar
                cursor-grab active:cursor-grabbing
                select-none
                touch-pan-y
                py-2 md:py-3
              "
            >
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  email={user.email}
                  color={user.color}
                  className="w-[176px] lg:w-[220px] shrink-0"
                  onChat={handleChat}
                />
              ))}
            </div>
          )}

          {!isLoadingUsers && !usersError && users.length === 0 && (
            <div className="mt-4 rounded-2xl border border-border bg-bg py-12 text-center">
              <p className="text-lg font-semibold text-text">No users found</p>
              <p className="mt-2 text-text-secondary">
                There are no users available to chat with.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Restful Icons */}
      <section className="py-12 md:py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <FeatureCard
              icon={
                <Award
                  className="text-primary/70"
                  size={40}
                  strokeWidth={1}
                />
              }
              title={t("highQuality")}
              desc={t("highQualityDesc")}
            />

            <FeatureCard
              icon={
                <Truck
                  className="text-primary/70"
                  size={40}
                  strokeWidth={1}
                />
              }
              title={t("fastDelivery")}
              desc={t("fastDeliveryDesc")}
            />

            <FeatureCard
              icon={
                <ShieldCheck
                  className="text-primary/70"
                  size={40}
                  strokeWidth={1}
                />
              }
              title={t("warranty")}
              desc={t("warrantyDesc")}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full border border-border bg-bg flex items-center justify-center mb-5 shadow-sm hover:scale-110 transition-transform duration-500">
        {icon}
      </div>

      <h4 className="text-text text-2xl font-semibold mb-4 tracking-tight">
        {title}
      </h4>

      <p className="text-text-secondary text-base max-w-xs">{desc}</p>
    </div>
  );
}