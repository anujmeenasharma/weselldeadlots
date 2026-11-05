'use client';

import React from 'react';
import Image from 'next/image';
import CmsLink from "@/components/sanity/CmsLink";
import { imageAlt, imageUrl } from "@/sanity/lib/image";
import { safeHref, visibleLinks } from "@/sanity/lib/links";

export default function Footer({ footer, settings }) {
    // All footer content comes from Sanity (Footer + Website Settings documents).
    const columns = (footer?.columns || []).filter((c) => c?.heading || c?.links?.length);
    const logo = footer?.logo?.asset || footer?.logo?._localPath ? footer.logo : settings?.logoDark || settings?.logo;
    const logoSrc = footer?.showLogo ? imageUrl(logo, { width: 600 }) : null;
    const mapUrl = safeHref(footer?.mapEmbedUrl);
    const copyright = footer?.copyrightText || settings?.copyrightText;
    const newsletter = footer?.newsletter?.enabled ? footer.newsletter : null;
    const socialLinks = footer?.showSocialLinks ? (settings?.socialLinks || []).filter((s) => safeHref(s?.url)) : [];
    const legalLinks = visibleLinks(footer?.legalLinks);

    return (
        <>
            <footer className="relative text-white py-12 md:py-[6vw] overflow-hidden">
                {/* Background Map */}
                <div className="absolute inset-0 z-0">
                    {mapUrl && (
                        <iframe
                            src={mapUrl}
                            className="w-full h-full border-0"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    )}
                </div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>

                <div className="relative w-full z-20 px-6 md:px-[5vw] lg:px-[5vw]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                        {/* Brand Logo */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative w-64 md:w-[28vw] lg:w-[20vw] h-28 md:h-[12vw] lg:h-[8vw]">
                                <div className="flex items-center gap-2 h-full w-full">
                                    <div className="text-blue-400 text-2xl font-bold w-full h-full flex items-center">
                                        {logoSrc && (
                                            <Image src={logoSrc} height={500} width={500} alt={imageAlt(logo, "brand logo")} className="w-full h-full object-contain drop-shadow-lg" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Link columns (Quick Links) */}
                        {columns.map((column) => (
                            <div key={column._key || column.heading} className="flex flex-col items-start lg:col-span-2">
                                {column.heading && (
                                    <h3 className="text-2xl md:text-[3vw] lg:text-2xl xl:text-3xl mb-6 font-semibold drop-shadow-md">{column.heading}</h3>
                                )}
                                <nav className="flex flex-row flex-wrap justify-start gap-4 md:gap-6 w-full">
                                    {visibleLinks(column.links).map((link) => (
                                        <CmsLink
                                            key={link._key || link.label}
                                            link={link}
                                            className="text-gray-200 hover:text-white transition-colors duration-200 text-base md:text-[1.8vw] lg:text-base font-medium drop-shadow-md whitespace-nowrap"
                                        />
                                    ))}
                                </nav>
                            </div>
                        ))}

                        {(footer?.description || footer?.showContactInfo || socialLinks.length > 0 || newsletter) && (
                            <div className="flex flex-col items-start gap-3 lg:col-span-3 text-gray-200 drop-shadow-md">
                                {footer?.description && <p className="max-w-2xl">{footer.description}</p>}
                                {footer?.showContactInfo && (
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
                                        {settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">{settings.contactEmail}</a>}
                                        {settings?.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">{settings.phone}</a>}
                                        {settings?.address?.displayText && <span>{settings.address.displayText}</span>}
                                    </div>
                                )}
                                {socialLinks.length > 0 && (
                                    <div className="flex flex-wrap gap-4 text-base">
                                        {socialLinks.map((s) => (
                                            <a key={s._key || s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-white">
                                                {s.platform}
                                            </a>
                                        ))}
                                    </div>
                                )}
                                {newsletter && (
                                    <div className="flex flex-col gap-2">
                                        {newsletter.heading && <h4 className="text-xl font-semibold text-white">{newsletter.heading}</h4>}
                                        {newsletter.text && <p>{newsletter.text}</p>}
                                        {newsletter.button && (
                                            <CmsLink link={newsletter.button} className="bg-primary text-white px-6 py-2 rounded-full w-fit hover:bg-blue-600 transition-colors" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </footer>
            <div className="py-2 bg-neutral-900 border-t border-gray-700 text-center text-gray-400 text-sm relative z-20">
                {copyright}
                {legalLinks.length > 0 && (
                    <span className="ms-3 inline-flex gap-3">
                        {legalLinks.map((link) => (
                            <CmsLink key={link._key || link.label} link={link} className="hover:text-white" />
                        ))}
                    </span>
                )}
            </div>
        </>
    );
}
