'use client';

import Link from "next/link";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SearchModal from "./SearchModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
      <div className="h-[8vh] w-[95%] md:w-[90%] fixed top-5 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 md:px-10 rounded-full drop-shadow-sm bg-white z-50">
        <Link href="/" className="brandLogo">
          <Image src="/brand.png" height={80} width={80} alt="brand logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-10 items-center">
          {navLinks.map((item, index) => (
            <Link className="text-lg hover:text-primary transition-colors" key={index} href={item.href}>
              {item.name}
            </Link>
          ))}
          <Link
            href="https://hashim8803-wbds.odoo.com/get-a-free-valuation-dead-lots"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Sell with us
          </Link>
        </div>

        {/* Search & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
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
          <Link
            href="https://hashim8803-wbds.odoo.com/get-a-free-valuation-dead-lots"
            className="bg-primary text-white px-8 py-3 rounded-full text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            Sell with us
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;