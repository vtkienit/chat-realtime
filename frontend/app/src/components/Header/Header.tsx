import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, LogOut } from "lucide-react";
import Language from "../../assets/icons/language.svg?react";
import User from "../../assets/icons/user.svg?react";
import clsx from "clsx";
import styles from "./Header.module.css";
import ThemeToggle from "../ThemeToggle";
import { useLanguage } from "../../contexts/LanguageProvider";
import { useTheme } from "../../contexts/ThemeProvider";

type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const getStoredUser = (): StoredUser | null => {
  const userJson = localStorage.getItem("user");

  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as StoredUser;
  } catch {
    return null;
  }
};

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() =>
    getStoredUser()
  );
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItemOpen, setMenuItemOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setCurrentUser(getStoredUser());
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenuItem = (id: number) => {
    setMenuItemOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");

    setCurrentUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);

    navigate("/login");
  };

  return (
    <header className="w-full bg-bg sticky top-0 z-50">
      {/* TOP HEADER */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between px-3 lg:px-8 py-1.5 max-w-7xl mx-auto">
          <div>
            <span className="text-base font-medium text-primary">
              {t("slogan")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* LANGUAGE */}
            <div
              className={clsx(
                styles["header__top-lang"],
                "relative cursor-pointer group"
              )}
            >
              <button className="flex gap-2 items-center cursor-pointer text-text-secondary hover:text-primary">
                <Language width={16} height={16} />
                <span>{lang === "vi" ? "Tiếng Việt" : "English"}</span>
                <ChevronDown
                  size={16}
                  className={clsx(
                    "transition-transform duration-200",
                    "group-hover:rotate-180"
                  )}
                />
              </button>

              <div className="absolute pt-1.5 z-[100]">
                <div className="hidden group-hover:block text-text-secondary top-full bg-bg border border-border rounded shadow-lg">
                  <p
                    className={clsx(
                      "text-center px-6 py-2 cursor-pointer whitespace-nowrap hover:bg-bg-secondary",
                      lang === "vi" && "text-primary"
                    )}
                    onClick={() => setLang("vi")}
                  >
                    {t("vietnamese")}
                  </p>

                  <p
                    className={clsx(
                      "text-center px-6 py-2 cursor-pointer whitespace-nowrap hover:bg-bg-secondary",
                      lang === "en" && "text-primary"
                    )}
                    onClick={() => setLang("en")}
                  >
                    {t("english")}
                  </p>
                </div>
              </div>
            </div>

            {/* THEME */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-y border-border">
        <div className="flex items-center justify-between px-3 lg:px-8 max-w-[1280px] mx-auto">
          {/* Left */}
          <h1 className="flex items-center my-4">
            <Link
              className="text-xl font-bold text-primary no-underline"
              to="/"
            >
              Vu Trung Kien
            </Link>
          </h1>

          {/* NAV */}
          <nav className="hidden md:flex justify-center">
            <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
              <ul className="flex gap-5 list-none p-0 m-0">
                <li className={styles["header__menu-item"]}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? styles["--active"] : ""
                    }
                  >
                    {t("home")}
                  </NavLink>
                </li>

                <li className={styles["header__menu-item"]}>
                  <NavLink
                    to="/chats"
                    className={({ isActive }) =>
                      isActive ? styles["--active"] : ""
                    }
                  >
                    {t("chats")}
                  </NavLink>
                </li>

                <li className={styles["header__menu-item"]}>
                  <NavLink
                    to="/support"
                    className={({ isActive }) =>
                      isActive ? styles["--active"] : ""
                    }
                  >
                    {t("support")}
                  </NavLink>
                </li>

                <li className={styles["header__menu-item"]}>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive ? styles["--active"] : ""
                    }
                  >
                    {t("contact")}
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="
                    rounded-full border border-border px-4 py-1.5
                    text-sm font-semibold text-text-secondary
                    hover:border-primary hover:text-primary
                    transition-colors
                  "
                >
                  {t("signin")}
                </Link>

                <Link
                  to="/register"
                  className="
                    rounded-full bg-primary px-4 py-1.5
                    text-sm font-semibold text-white
                    hover:bg-primary/85
                    transition-colors
                  "
                >
                  {t("signup")}
                </Link>
              </div>
            ) : (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="
                    hidden md:flex items-center gap-2 rounded-full
                    border border-border bg-bg px-3 py-1.5
                    text-text-secondary shadow-sm
                    hover:border-primary hover:text-primary
                    transition-colors cursor-pointer
                  "
                >
                  <span className="hidden sm:inline text-sm font-semibold">
                    {t("hi")}, {currentUser.name}
                  </span>

                  <User width={25} height={25} />

                  <ChevronDown
                    size={15}
                    className={clsx(
                      "transition-transform duration-200",
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="
                      absolute right-0 top-full mt-2 z-[100]
                      rounded-xl border border-border bg-bg
                      p-2 shadow-lg
                    "
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex w-full items-center gap-2 rounded-lg
                        px-5 py-1 text-sm font-semibold
                        text-red-500 hover:bg-red-50
                        transition-colors cursor-pointer
                      "
                    >
                      <LogOut size={16} />
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="text-text-secondary cursor-pointer md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X width={25} height={25} /> : <Menu width={25} height={25} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className={styles["header__menu-mobile"]}>
          <div className={styles["header__menu-mobile-container"]}>
            {/* MENU */}
            <nav className="flex flex-col">
              <h3 className={styles["header__menu-mobile-title"]}>
                {t("menu")}
              </h3>

              <ul className="list-none p-0 m-0 flex flex-col">
                <li className={styles["header__menu-mobile-item"]}>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    {t("home")}
                  </Link>
                </li>

                <li className={styles["header__menu-mobile-item"]}>
                  <Link to="/chats" onClick={() => setMenuOpen(false)}>
                    {t("chats")}
                  </Link>
                </li>

                <li className={styles["header__menu-mobile-item"]}>
                  <Link to="/support" onClick={() => setMenuOpen(false)}>
                    {t("support")}
                  </Link>
                </li>

                <li className={styles["header__menu-mobile-item"]}>
                  <Link to="/contact" onClick={() => setMenuOpen(false)}>
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* OTHER */}
            <section className="flex flex-col">
              <h3 className={styles["header__menu-mobile-title"]}>
                {t("other")}
              </h3>

              <ul>
                <li
                  className={clsx(
                    styles["header__menu-mobile-item"],
                    "flex justify-between items-center cursor-pointer"
                  )}
                  onClick={() => toggleMenuItem(2)}
                >
                  <Link to="#">{t("language")}</Link>
                  <ChevronDown
                    size={16}
                    className={clsx(
                      styles.icon,
                      "transition-transform duration-200",
                      menuItemOpen[2] && "rotate-180"
                    )}
                  />
                </li>

                {menuItemOpen[2] && (
                  <>
                    <label
                      className={clsx(
                        styles["header__menu-mobile-item"],
                        styles["--secondary"],
                        "flex justify-between items-center cursor-pointer"
                      )}
                    >
                      <span>{t("vietnamese")}</span>
                      <input
                        type="radio"
                        name="language"
                        checked={lang === "vi"}
                        onChange={() => setLang("vi")}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>

                    <label
                      className={clsx(
                        styles["header__menu-mobile-item"],
                        styles["--secondary"],
                        "flex justify-between items-center cursor-pointer"
                      )}
                    >
                      <span>{t("english")}</span>
                      <input
                        type="radio"
                        name="language"
                        checked={lang === "en"}
                        onChange={() => setLang("en")}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                  </>
                )}

                <li
                  className={clsx(
                    styles["header__menu-mobile-item"],
                    "flex justify-between items-center cursor-pointer"
                  )}
                  onClick={() => toggleMenuItem(3)}
                >
                  <Link to="#">{t("theme")}</Link>
                  <ChevronDown
                    size={16}
                    className={clsx(
                      styles.icon,
                      "transition-transform duration-200",
                      menuItemOpen[3] && "rotate-180"
                    )}
                  />
                </li>

                {menuItemOpen[3] && (
                  <>
                    <label
                      className={clsx(
                        styles["header__menu-mobile-item"],
                        styles["--secondary"],
                        "flex justify-between items-center cursor-pointer"
                      )}
                    >
                      <span>{t("light")}</span>
                      <input
                        type="radio"
                        name="theme"
                        checked={theme === "light"}
                        onChange={() => setTheme("light")}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>

                    <label
                      className={clsx(
                        styles["header__menu-mobile-item"],
                        styles["--secondary"],
                        "flex justify-between items-center cursor-pointer"
                      )}
                    >
                      <span>{t("dark")}</span>
                      <input
                        type="radio"
                        name="theme"
                        checked={theme === "dark"}
                        onChange={() => setTheme("dark")}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                  </>
                )}
              </ul>
            </section>

            {/* AUTH MOBILE */}
            <section className="flex flex-col">
              <h3 className={styles["header__menu-mobile-title"]}>
                {t("account")}
              </h3>

              <ul>
                {!currentUser ? (
                  <>
                    <li className={styles["header__menu-mobile-item"]}>
                      <Link to="/login" onClick={() => setMenuOpen(false)}>
                        {t("login")}
                      </Link>
                    </li>

                    <li className={styles["header__menu-mobile-item"]}>
                      <Link to="/register" onClick={() => setMenuOpen(false)}>
                        {t("signup")}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className={clsx(
                        styles["header__menu-mobile-item"],
                        styles["span"]
                      )}
                    >
                      {t("hi")}, {currentUser.name}
                    </li>

                    <li
                      className={clsx(
                        styles["header__menu-mobile-item"],
                        styles["span"]
                      )}
                      onClick={handleLogout}
                    >
                      {t("logout")}
                    </li>
                  </>
                )}
              </ul>
            </section>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;