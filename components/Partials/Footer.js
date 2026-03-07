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
            <footer className="relative text-white py-12 md:py-[6vw] overflow-hidden">
                {/* Background Map */}
                <div className="absolute inset-0 z-0">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14428.120347420798!2d55.4041113!3d25.3031932!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5f96ee666a7d%3A0xf29ba26bd7c31055!2sWe%20Sell%20Dead%20Lots!5e0!3m2!1sen!2sin!4v1746203658792!5m2!1sen!2sin"
                        className="w-full h-full border-0"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/80 z-10 pointer-events-none"></div>

                <div className="relative w-full z-20 px-6 md:px-[5vw] lg:px-[5vw]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {/* Brand Logo */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative w-64 md:w-[28vw] lg:w-[20vw] h-28 md:h-[12vw] lg:h-[8vw]">
                                <div className="flex items-center gap-2 h-full w-full">
                                    <div className="text-blue-400 text-2xl font-bold w-full h-full flex items-center">
                                        <Image src="/main.svg" height={500} width={500} alt="brand logo" className="w-full h-full object-contain drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col items-center md:items-start lg:items-center">
                            <h3 className="text-2xl md:text-[3vw] lg:text-2xl xl:text-3xl mb-6 font-semibold drop-shadow-md">Quick Links</h3>
                            <nav className="flex flex-col space-y-3 md:space-y-[1vw] lg:space-y-4 w-full items-center md:items-start lg:items-center">
                                {quickLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-200 hover:text-white transition-colors duration-200 text-base md:text-[1.8vw] lg:text-base font-medium drop-shadow-md"
                                        onClick={() => {
                                            if (link.name === 'Sell With Us' && typeof window.fbq === 'function') {
                                                window.fbq('trackCustom', 'SellWithUsClick');
                                            }
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Empty column to preserve the 3-column layout */}
                        <div className="hidden lg:block"></div>
                    </div>
                </div>
            </footer>
            <div className="py-2 bg-neutral-900 border-t border-gray-700 text-center text-gray-400 text-sm relative z-20">
                All rights reserved to we sell dead lots
            </div>
        </>
    );
}