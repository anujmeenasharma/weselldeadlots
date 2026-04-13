'use client';

import Link from "@/components/AppLink";
import Image from "next/image";
import { useState } from "react";
import SearchModal from "./SearchModal";
import { useRouter, usePathname } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { Menu, X, Globe } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/arabic");
  const locale = isArabic ? "ar" : "en";

  const changeLanguage = (newLocale) => {
    if (newLocale === "ar" && !isArabic) {
      document.cookie = "googtrans=/en/ar; path=/; SameSite=Lax";
      window.location.href = `/arabic${pathname === "/" ? "" : pathname}`;
    } else if (newLocale === "en" && isArabic) {
      // Expire the googtrans cookie on every possible path so Google Translate
      // has no cached instruction to translate the page.
      const expiry = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = `googtrans=; ${expiry}; path=/`;
      document.cookie = `googtrans=; ${expiry}; path=/arabic`;
      document.cookie = `googtrans=; ${expiry}; path=/arabic/`;
      // Some browsers also need the domain cleared explicitly
      document.cookie = `googtrans=; ${expiry}; path=/; domain=${window.location.hostname}`;

      const newPath = pathname.replace(/^\/arabic/, "") || "/";
      // Cache-bust with a query param so the browser fetches a fresh response
      // instead of serving a stale cached (translated) version.
      window.location.href = `${newPath}?lang=en&_t=${Date.now()}`;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Categories", href: "/categories" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact us", href: "/contact" },
  ];

  return (
    <>
      <div className="h-[8vh] w-[95%] md:w-[90vw] fixed top-5 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 md:px-[4vw] rounded-full drop-shadow-sm bg-white z-50">
        <Link href="/" className="brandLogo">
          <Image src="/brand.png" height={80} width={80} alt="brand logo" className="w-16 h-16 md:w-[6vw] md:h-[6vw] lg:w-[4vw] lg:h-[4vw] object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-[3vw] lg:gap-10 items-center">
          {navLinks.map((item, index) => (
            <Link className="text-lg lg:text-base xl:text-lg hover:text-primary transition-colors" key={index} href={item.href}>
              {item.name}
            </Link>
          ))}
          <Link
            href="/sell-with-us"
            className="bg-primary text-white px-6 py-2 rounded-full lg:text-base xl:text-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              if (typeof window.fbq === 'function') {
                window.fbq('trackCustom', 'SellWithUsClick');
              }
            }}
          >
            Sell with us
          </Link>
        </div>

        {/* Search & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <select
              value={locale}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-gray-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="text-2xl cursor-pointer hover:text-primary transition-colors flex items-center justify-center p-2"
          >
            <CiSearch />
          </button>
          <button onClick={toggleMenu} className="lg:hidden text-2xl">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 lg:hidden pt-20">
          {navLinks.map((item, index) => (
            <Link
              className="text-2xl font-medium text-gray-800"
              key={index}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center gap-2 mt-4 bg-gray-100 px-4 py-2 rounded-full">
            <Globe className="w-5 h-5 text-gray-600" />
            <select
              value={locale}
              onChange={(e) => {
                changeLanguage(e.target.value);
                setIsMenuOpen(false);
              }}
              className="bg-transparent text-gray-800 text-lg font-medium focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <Link
            href="https://hashim8803-wbds.odoo.com/get-a-free-valuation-dead-lots"
            className="bg-primary text-white px-8 py-3 rounded-full text-xl"
            onClick={() => {
              setIsMenuOpen(false);
              if (typeof window.fbq === 'function') {
                window.fbq('trackCustom', 'SellWithUsClick');
              }
            }}
          >
            Sell with us
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;