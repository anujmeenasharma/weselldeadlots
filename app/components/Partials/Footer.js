'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const quickLinks = [
    { name: 'Categories', href: '/categories' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Sell With Us', href: '/sell' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Terms & Condition', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  return (
    <>
        <footer className="bg-neutral-900 text-white px-20 py-12">
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Logo Section */}
            <div className="flex justify-center md:justify-start">
                <div className="relative w-48 h-20">
                <div className="flex items-center gap-2">
                    <div className="text-blue-400 text-2xl font-bold">
                    <Image src="/main.svg" height={500} width={500} alt="brand logo" />
                    </div>
                </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start lg:items-center">
                <h3 className="text-4xl mb-6">Quick Links</h3>
                <nav className="flex flex-col space-y-3">
                {quickLinks.map((link) => (
                    <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-center md:text-left lg:text-center"
                    >
                    {link.name}
                    </Link>
                ))}
                </nav>
            </div>

            {/* Map Section */}
            <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="relative h-64 w-full">
                    <div className="w-full h-full bg-gray-200 relative">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14428.120347420798!2d55.4041113!3d25.3031932!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f96ee666a7d%3A0xf29ba26bd7c31055!2sWe%20Sell%20Dead%20Lots!5e0!3m2!1sen!2sin!4v1746203658792!5m2!1sen!2sin" width="400" height="300"></iframe>
                    </div>
                    
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white px-2 py-1 rounded text-xs">
                        <span className="text-gray-600">Map data ©2024</span>
                        <span className="text-blue-600">Terms</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </footer>
        <div className="py-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            All rights reserved to we sell dead lots
        </div>
    </>
  );
}