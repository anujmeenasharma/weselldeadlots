'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Wrench, Settings, Home, Laptop, Anchor, ShoppingBag, Recycle } from 'lucide-react';

export const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');
};

export default function Category() {
  const categories = [
    {
      id: 'electrical',
      name: 'Electrical & Automation',
      icon: Zap,
      items: [
        {
          title: 'SWITCH GEAR',
          image: '/images/categories/e1.webp',
          link: '/categories/electronic/switch-gear'
        },
        {
          title: 'AUTOMATION & CONTROL EQUIPMENTS',
          image: '/images/categories/e2.webp',
          link: '/categories/electronic/automation-and-control-equipments'
        },
        {
          title: 'WIRES & CABLES',
          image: '/images/categories/e3.webp',
          link: '/categories/electronic/wires-and-cables'
        },
        {
          title: 'SWITCH & SOCKETS',
          image: '/images/categories/e4.webp',
          link: '/categories/electronic/switch-and-sockets'
        },
        {
          title: 'ELECTRONICS & LIGHTING',
          image: '/images/categories/e5.webp',
          link: '/categories/electronic/electronics-and-lighting'
        }
      ]
    },

    {
      id: 'tools',
      name: 'Tools & Equipment',
      icon: Wrench,
      items: [
        {
          title: 'HAND TOOLS',
          image: '/images/categories/to1.webp',
          link: '/categories/tools/hand-tools'
        },
        {
          title: 'POWER TOOLS',
          image: '/images/categories/to2.webp',
          link: '/categories/tools/power-tools'
        },
        {
          title: 'CUTTING TOOLS',
          image: '/images/categories/to3.webp',
          link: '/categories/tools/cutting-tools'
        },
        {
          title: 'MEASURING TOOLS',
          image: '/images/categories/to4.webp',
          link: '/categories/tools/measuring-tools'
        },
        {
          title: 'FASTENING TOOLS',
          image: '/images/categories/to5.webp',
          link: '/categories/tools/fastening-tools'
        }
      ]
    },

    {
      id: 'industrial',
      name: 'Industrial Equipment & Components',
      icon: Settings,
      items: [
        {
          title: 'MACHINERY',
          image: '/images/categories/i1.webp',
          link: '/categories/industrial/machinery'
        },
        {
          title: 'BEARINGS',
          image: '/images/categories/i2.webp',
          link: '/categories/industrial/bearings'
        },
        {
          title: 'HYDRAULIC COMPONENTS',
          image: '/images/categories/i3.webp',
          link: '/categories/industrial/hydraulic-components'
        },
        {
          title: 'MOTORS',
          image: '/images/categories/i4.webp',
          link: '/categories/industrial/motors'
        },
        {
          title: 'GENERATORS',
          image: '/images/categories/i5.webp',
          link: '/categories/industrial/generators'
        }
      ]
    },

    {
      id: 'construction',
      name: 'Construction & Building Materials',
      icon: Home,
      items: [
        {
          title: 'HVAC SYSTEMS',
          image: '/images/categories/co1.webp',
          link: '/categories/construction/hvac-systems'
        },
        {
          title: 'FIRE & SAFETY',
          image: '/images/categories/co2.webp',
          link: '/categories/construction/fire-and-safety'
        },
        {
          title: 'BUILDING MATERIALS',
          image: '/images/categories/co3.webp',
          link: '/categories/construction/building-materials'
        },
        {
          title: 'PLUMBING SYSTEMS',
          image: '/images/categories/co4.webp',
          link: '/categories/plumbing-systems'
        },
        {
          title: 'CONSTRUCTION TOOLS & EQUIPMENTS',
          image: '/images/categories/co5.webp',
          link: '/categories/construction/construction-tools-and-equipments'
        }
      ]
    },

    {
      id: 'technology',
      name: 'Technology & Power Solutions',
      icon: Laptop,
      items: [
        {
          title: 'IT EQUIPMENTS',
          image: '/images/categories/t1.webp',
          link: '/categories/technology/it-equipments'
        },
        {
          title: 'BATTERIES',
          image: '/images/categories/t2.webp',
          link: '/categories/technology/batteries'
        },
        {
          title: 'NETWORKING DEVICES',
          image: '/images/categories/t3.webp',
          link: '/categories/technology/networking-devices'
        },
        {
          title: 'DATA STORAGE',
          image: '/images/categories/t4.webp',
          link: '/categories/data-storage'
        }
      ]
    },

    {
      id: 'maritime',
      name: 'Maritime & Aviation',
      icon: Anchor,
      items: [
        {
          title: 'OIL & GAS EQUIPMENTS',
          image: '/images/categories/m1.webp',
          link: '/categories/energy/oil-and-gas-equipments'
        },
        {
          title: 'MARINE SUPPLIES',
          image: '/images/categories/m2.webp',
          link: '/categories/energy/marine-supplies'
        },
        {
          title: 'AEROSPACE & AIRCRAFT MATERIALS',
          image: '/images/categories/m3.webp',
          link: '/categories/energy/aerospace-and-aircraft-materials'
        }
      ]
    },

    {
      id: 'consumer',
      name: 'Consumer Goods & Lifestyle',
      icon: ShoppingBag,
      items: [
        {
          title: 'GARMENTS',
          image: '/images/categories/c1.webp',
          link: '/categories/consumer/garments'
        },
        {
          title: 'COSMETICS & PERSONAL CARE',
          image: '/images/categories/c2.webp',
          link: '/categories/consumer/cosmetics-and-personal-care'
        },
        {
          title: 'TOYS & GAMES',
          image: '/images/categories/c3.webp',
          link: '/categories/consumer/toys-and-games'
        },
        {
          title: 'KIDS ESSENTIALS',
          image: '/images/categories/c4.webp',
          link: '/categories/consumer/kids-essentials'
        },
        {
          title: 'FOOTWEAR',
          image: '/images/categories/c5.webp',
          link: '/categories/consumer/footwear'
        }
      ]
    },

    {
      id: 'scrap',
      name: 'Recyclable Materials',
      icon: Recycle,
      items: [
        {
          title: 'GARMENTS',
          image: '/images/categories/c1.webp',
          link: '/categories/scrap-garments'
        },
        {
          title: 'COSMETICS & PERSONAL CARE',
          image: '/images/categories/c2.webp',
          link: '/categories/scrap-cosmetics'
        },
        {
          title: 'TOYS & GAMES',
          image: '/images/categories/c3.webp',
          link: '/categories/scrap-toys'
        },
        {
          title: 'KIDS ESSENTIALS',
          image: '/images/categories/c4.webp',
          link: '/categories/scrap-kids'
        },
        {
          title: 'FOOTWEAR',
          image: '/images/categories/c5.webp',
          link: '/categories/scrap-footwear'
        }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/category/')) {
        const slug = pathname.replace('/category/', '');
        const matched = categories.find(c => generateSlug(c.name) === slug);
        if (matched) {
          setActiveCategory(matched);
        }
      }
    }
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/category/${generateSlug(category.name)}`);
    }
  };

  return (
    <section className="py-10 px-6 md:px-12 lg:px-20" id="categories">
      <div>
        <h2 className="text-3xl md:text-4xl lg:text-6xl text-center pb-10 md:pb-20">
          Categories
        </h2>
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
              {activeCategory.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="text-white font-bold text-lg mb-1 leading-tight">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-white text-sm opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                        <span>View Products</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}