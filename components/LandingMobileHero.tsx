"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type RefObject } from "react";
import { ArrowRight, ArrowRightLeft, Banknote, CarFront, FileText, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./LandingMobileHero.module.css";

export default function LandingMobileHero({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const services = [
    { label: t("carRentals"), icon: CarFront, path: "/dashboard/rentals" },
    { label: t("leaseTransfer"), icon: FileText, path: "/dashboard/lease" },
    { label: t("financing"), icon: Banknote, path: "/dashboard/finance" },
    { label: t("carSwap"), icon: ArrowRightLeft, path: "/dashboard/swap" },
  ];

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="md:hidden">
      <form onSubmit={search} role="search" className={styles.search}>
        <Search size={20} aria-hidden="true" className="shrink-0 text-slate-400" />
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} required aria-label={t("searchCars")} placeholder={t("mobileSearchPlaceholder")} className={styles.input} />
        <button type="submit" aria-label={t("searchButton")} className={styles.searchButton}>
          <ArrowRight size={20} aria-hidden="true" className="rtl:rotate-180" />
        </button>
      </form>

      <nav className={styles.services} aria-label={t("vehicleServices")}>
        {services.map(({ label, icon: Icon, path }) => loading ? (
          <button key={path} type="button" disabled aria-busy="true" className={styles.service}>
            <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ) : (
          <Link key={path} href={user ? path : "/login"} className={styles.service}>
            <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <section className={styles.banner} aria-labelledby="mobile-hero-title">
        <Image src="/images/mobile-hero-sedan.png" alt="" fill sizes="(max-width: 767px) 100vw, 1px" className={styles.image} />
        <div className={styles.shade} />
        <div className={styles.copy}>
          <h1 id="mobile-hero-title" className={styles.title}>
            {t("mobileHeroTitle")}<br />
            <span>{t("mobileHeroHighlight")}</span>
          </h1>
          <p>{t("mobileHeroSubtitle")}</p>
        </div>
        <a href="#top-picks-title" aria-label={t("browseCars")} className={styles.browse}>
          <ArrowRight size={22} aria-hidden="true" className="rtl:rotate-180" />
        </a>
      </section>
    </div>
  );
}
