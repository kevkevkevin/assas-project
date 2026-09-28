"use client";

import Link from "next/link";
import { ArrowRightLeft, CarFront, House, Search, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./LandingMobileNav.module.css";

export default function LandingMobileNav({ onSearch }: { onSearch: () => void }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const destinations = [
    { label: t("rentals"), icon: CarFront, href: user ? "/dashboard/rentals" : "/login" },
    { label: t("carSwap"), icon: ArrowRightLeft, href: user ? "/dashboard/swap" : "/login" },
    { label: user ? t("dashboard") : t("login"), icon: UserRound, href: user ? "/dashboard" : "/login" },
  ];

  return (
    <nav className={styles.dock} aria-label={t("mobileNavigation")}>
      <a href="#home" className={`${styles.item} ${styles.active}`} aria-current="page">
        <House size={22} strokeWidth={2.3} aria-hidden="true" />
        <span>{t("home")}</span>
      </a>
      <button type="button" onClick={onSearch} className={styles.item} aria-label={t("searchButton")} title={t("searchButton")}>
        <Search size={23} aria-hidden="true" />
      </button>
      {destinations.map(({ label, icon: Icon, href }) =>
        loading ? (
          <button key={label} type="button" className={styles.item} disabled aria-label={label} aria-busy="true">
            <Icon size={23} aria-hidden="true" />
          </button>
        ) : (
          <Link key={label} href={href} className={styles.item} aria-label={label} title={label}>
            <Icon size={23} aria-hidden="true" />
          </Link>
        ),
      )}
    </nav>
  );
}
