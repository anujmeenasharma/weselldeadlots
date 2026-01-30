'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Wrench, Settings, Home, Laptop, Anchor, ShoppingBag, Recycle } from 'lucide-react';



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
        link: '/category/switch-gear'
      },
      {
        title: 'AUTOMATION & CONTROL EQUIPMENTS',
        image: '/images/categories/e2.webp',
        link: '/category/automation-control'
      },
      {
        title: 'WIRES & CABLES',
        image: '/images/categories/e3.webp',
        link: '/category/wires-cables'
      },
      {
        title: 'SWITCH & SOCKETS',
        image: '/images/categories/e4.webp',
        link: '/category/switch-sockets'
      },
      {
        title: 'ELECTRONICS & LIGHTING',
        image: '/images/categories/e5.webp',
        link: '/category/electronics-lighting'
      }
    ]
  },

  {
    id: 'tools',
    name: 'Tools & Equipments',
    icon: Wrench,
    items: [
      {
        title: 'HAND TOOLS',
        image: '/images/categories/to1.webp',
        link: '/category/hand-tools'
      },
      {
        title: 'POWER TOOLS',
        image: '/images/categories/to2.webp',
        link: '/category/power-tools'
      },
      {
        title: 'CUTTING TOOLS',
        image: '/images/categories/to3.webp',
        link: '/category/cutting-tools'
      },
      {
        title: 'MEASURING TOOLS',
        image: '/images/categories/to4.webp',
        link: '/category/measuring-tools'
      },
      {
        title: 'FASTENING TOOLS',
        image: '/images/categories/to5.webp',
        link: '/category/fastening-tools'
      }
    ]
  },

  {
    id: 'industrial',
    name: 'Industrial Equipments & Components',
    icon: Settings,
    items: [
      {
        title: 'MACHINERY',
        image: '/images/categories/i1.webp',
        link: '/category/machinery'
      },
      {
        title: 'BEARINGS',
        image: '/images/categories/i2.webp',
        link: '/category/bearings'
      },
      {
        title: 'HYDRAULIC COMPONENTS',
        image: '/images/categories/i3.webp',
        link: '/category/hydraulic-components'
      },
      {
        title: 'MOTORS',
        image: '/images/categories/i4.webp',
        link: '/category/motors'
      },
      {
        title: 'GENERATORS',
        image: '/images/categories/i5.webp',
        link: '/category/generators'
      }
    ]
  },

  {
    id: 'construction',
    name: 'Construction & Building Material',
    icon: Home,
    items: [
      {
        title: 'HVAC SYSTEMS',
        image: '/images/categories/co1.webp',
        link: '/category/hvac-systems'
      },
      {
        title: 'FIRE & SAFETY',
        image: '/images/categories/co2.webp',
        link: '/category/fire-safety'
      },
      {
        title: 'BUILDING MATERIALS',
        image: '/images/categories/co3.webp',
        link: '/category/building-materials'
      },
      {
        title: 'PLUMBING SYSTEMS',
        image: '/images/categories/co4.webp',
        link: '/category/plumbing-systems'
      },
      {
        title: 'CONSTRUCTION TOOLS & EQUIPMENTS',
        image: '/images/categories/co5.webp',
        link: '/category/construction-tools'
      }
    ]
  },

  {
    id: 'technology',
    name: 'Technology & Power Solution',
    icon: Laptop,
    items: [
      {
        title: 'IT EQUIPMENTS',
        image: '/images/categories/t1.webp',
        link: '/category/it-equipments'
      },
      {
        title: 'BATTERIES',
        image: '/images/categories/t2.webp',
        link: '/category/batteries'
      },
      {
        title: 'NETWORKING DEVICES',
        image: '/images/categories/t3.webp',
        link: '/category/networking-devices'
      },
      {
        title: 'DATA STORAGE',
        image: '/images/categories/t4.webp',
        link: '/category/data-storage'
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
        link: '/category/oil-gas'
      },
      {
        title: 'MARINE SUPPLIES',
        image: '/images/categories/m2.webp',
        link: '/category/marine-supplies'
      },
      {
        title: 'AEROSPACE & AIRCRAFT MATERIALS',
        image: '/images/categories/m3.webp',
        link: '/category/aerospace-materials'
      }
    ]
  },

  {
    id: 'consumer',
    name: 'Consumers Goods & Lifestyle',
    icon: ShoppingBag,
    items: [
      {
        title: 'GARMENTS',
        image: '/images/categories/c1.webp',
        link: '/category/garments'
      },
      {
        title: 'COSMETICS & PERSONAL CARECARE',
        image: '/images/categories/c2.webp',
        link: '/category/cosmetics'
      },
      {
        title: 'TOYS & GAMES',
        image: '/images/categories/c3.webp',
        link: '/category/toys-games'
      },
      {
        title: 'KIDS ESSENTIALS',
        image: '/images/categories/c4.webp',
        link: '/category/kids-essentials'
      },
      {
        title: 'FOOTWEAR',
        image: '/images/categories/c5.webp',
        link: '/category/footwear'
      }
    ]
  },

  {
    id: 'scrap',
    name: 'Recycleable materials',
    icon: Recycle,
    items: [
      {
        title: 'GARMENTS',
        image: '/images/categories/c1.webp',
        link: '/category/scrap-garments'
      },
      {
        title: 'COSMETICS & PERSONAL CARE',
        image: '/images/categories/c2.webp',
        link: '/category/scrap-cosmetics'
      },
      {
        title: 'TOYS & GAMES',
        image: '/images/categories/c3.webp',
        link: '/category/scrap-toys'
      },
      {
        title: 'KIDS ESSENTIALS',
        image: '/images/categories/c4.webp',
        link: '/category/scrap-kids'
      },
      {
        title: 'FOOTWEAR',
        image: '/images/categories/c5.webp',
        link: '/category/scrap-footwear'
      }
    ]
  }
];


  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="py-10 px-20">
      <div>
        <h2 className="text-6xl text-center pb-20">
          Categories
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory.id === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full flex cursor-pointer border-b items-center gap-3 px-4 py-6 transition-all duration-200 ${isActive
                        ? 'text-blue-800'
                        : 'text-black'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-800' : 'text-black'}`} />
                    <span className="text-left text">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-9">
            <h3 className="text-2xl md:text-3xl mb-6 text-gray-800">
              {activeCategory.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <h4 className="text-white font-bold text-lg mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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