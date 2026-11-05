'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from "@/components/AppLink";
import {
  Zap, Wrench, Settings, Home, Laptop, Anchor, ShoppingBag, Droplets, Plane,
  Package, Factory, Truck, Cpu, Hammer, Shirt, Lightbulb, Flame, Shield,
} from 'lucide-react';
import { imageAlt, imageUrl } from "@/sanity/lib/image";
import { safeHref } from "@/sanity/lib/links";

// Icon names selectable in Sanity (see CATEGORY_ICONS in the schema).
const ICONS = { Zap, Wrench, Settings, Home, Laptop, Anchor, ShoppingBag, Droplets, Plane, Package, Factory, Truck, Cpu, Hammer, Shirt, Lightbulb, Flame, Shield };

export const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');
};

// Category groups, cards, images and links come from the Sanity "Category browser" section.
export default function Category({ section = {} }) {
  const categories = useMemo(
    () =>
      (section.groups || [])
        .filter((g) => g && !g.hidden && g.name)
        .map((g) => ({
          id: g.key || g._key || generateSlug(g.name),
          name: g.name,
          icon: ICONS[g.icon] || Package,
          items: (g.items || []).filter((item) => item && !item.hidden && item.title),
        })),
    [section.groups],
  );

  const [activeId, setActiveId] = useState(categories[0]?.id);
  const activeCategory = categories.find((c) => c.id === activeId) || categories[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/category/')) {
        const slug = pathname.replace('/category/', '');
        const matched = categories.find(c => generateSlug(c.name) === slug);
        if (matched) {
          setActiveId(matched.id);
        }
      }
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    setActiveId(category.id);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/category/${generateSlug(category.name)}`);
    }
  };

  if (!activeCategory) return null;

  return (
    <section className="py-10 px-6 md:px-12 lg:px-20" id={section.anchorId || "categories"}>
      <div>
        {section.heading && (
          <h2 className="text-3xl md:text-4xl lg:text-6xl text-center pb-10 md:pb-20">
            {section.heading}
          </h2>
        )}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar / Category List */}
          <div className="md:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-lg p-0 md:p-2 lg:p-4 overflow-x-auto md:overflow-visible">
              <div className="flex md:flex-col min-w-max md:min-w-0 gap-2 md:gap-0">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory.id === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`flex-shrink-0 md:w-full flex cursor-pointer md:border-b items-center gap-3 px-4 py-3 md:py-4 lg:py-5 transition-all duration-200 rounded-lg md:rounded-none whitespace-nowrap md:whitespace-normal ${isActive
                        ? 'text-blue-800 bg-blue-50 md:bg-transparent'
                        : 'text-black hover:bg-gray-50'
                        }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-800' : 'text-black'}`} />
                      <span className="text-left text-sm md:text-sm lg:text-base font-medium leading-snug">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 xl:col-span-9 mt-4 md:mt-0">
            <h3 className="text-2xl md:text-3xl mb-6 text-gray-800 font-semibold px-2 md:px-0">
              {activeCategory.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory.items.map((item, index) => {
                const src = imageUrl(item.image, { width: 800 });
                return (
                  <Link
                    key={item._key || index}
                    href={safeHref(item.link) || "#"}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48 md:h-64 overflow-hidden">
                      {src && (
                        <img
                          src={src}
                          alt={imageAlt(item.image, item.title)}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-white font-bold text-lg mb-1 leading-tight">
                          {item.title}
                        </h4>
                        <div className="flex items-center text-white text-sm opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                          <span>{section.viewProductsLabel}</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
