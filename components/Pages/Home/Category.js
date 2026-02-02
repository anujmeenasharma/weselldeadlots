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
          link: '/categories/switch-gear'
        },
        {
          title: 'AUTOMATION & CONTROL EQUIPMENTS',
          image: '/images/categories/e2.webp',
          link: '/categories/automation-control'
        },
        {
          title: 'WIRES & CABLES',
          image: '/images/categories/e3.webp',
          link: '/categories/wires-cables'
        },
        {
          title: 'SWITCH & SOCKETS',
          image: '/images/categories/e4.webp',
          link: '/categories/switch-sockets'
        },
        {
          title: 'ELECTRONICS & LIGHTING',
          image: '/images/categories/e5.webp',
          link: '/categories/electronics-lighting'
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
          link: '/categories/hand-tools'
        },
        {
          title: 'POWER TOOLS',
          image: '/images/categories/to2.webp',
          link: '/categories/power-tools'
        },
        {
          title: 'CUTTING TOOLS',
          image: '/images/categories/to3.webp',
          link: '/categories/cutting-tools'
        },
        {
          title: 'MEASURING TOOLS',
          image: '/images/categories/to4.webp',
          link: '/categories/measuring-tools'
        },
        {
          title: 'FASTENING TOOLS',
          image: '/images/categories/to5.webp',
          link: '/categories/fastening-tools'
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
          link: '/categories/machinery'
        },
        {
          title: 'BEARINGS',
          image: '/images/categories/i2.webp',
          link: '/categories/bearings'
        },
        {
          title: 'HYDRAULIC COMPONENTS',
          image: '/images/categories/i3.webp',
          link: '/categories/hydraulic-components'
        },
        {
          title: 'MOTORS',
          image: '/images/categories/i4.webp',
          link: '/categories/motors'
        },
        {
          title: 'GENERATORS',
          image: '/images/categories/i5.webp',
          link: '/categories/generators'
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
          link: '/categories/hvac-systems'
        },
        {
          title: 'FIRE & SAFETY',
          image: '/images/categories/co2.webp',
          link: '/categories/fire-safety'
        },
        {
          title: 'BUILDING MATERIALS',
          image: '/images/categories/co3.webp',
          link: '/categories/building-materials'
        },
        {
          title: 'PLUMBING SYSTEMS',
          image: '/images/categories/co4.webp',
          link: '/categories/plumbing-systems'
        },
        {
          title: 'CONSTRUCTION TOOLS & EQUIPMENTS',
          image: '/images/categories/co5.webp',
          link: '/categories/construction-tools'
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
          link: '/categories/it-equipments'
        },
        {
          title: 'BATTERIES',
          image: '/images/categories/t2.webp',
          link: '/categories/batteries'
        },
        {
          title: 'NETWORKING DEVICES',
          image: '/images/categories/t3.webp',
          link: '/categories/networking-devices'
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
          link: '/categories/oil-gas'
        },
        {
          title: 'MARINE SUPPLIES',
          image: '/images/categories/m2.webp',
          link: '/categories/marine-supplies'
        },
        {
          title: 'AEROSPACE & AIRCRAFT MATERIALS',
          image: '/images/categories/m3.webp',
          link: '/categories/aerospace-materials'
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
          link: '/categories/garments'
        },
        {
          title: 'COSMETICS & PERSONAL CARECARE',
          image: '/images/categories/c2.webp',
          link: '/categories/cosmetics'
        },
        {
          title: 'TOYS & GAMES',
          image: '/images/categories/c3.webp',
          link: '/categories/toys-games'
        },
        {
          title: 'KIDS ESSENTIALS',
          image: '/images/categories/c4.webp',
          link: '/categories/kids-essentials'
        },
        {
          title: 'FOOTWEAR',
          image: '/images/categories/c5.webp',
          link: '/categories/footwear'
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

  return (
    <section className="py-10 px-6 md:px-12 lg:px-20" id="categories">
      <div>
        <h2 className="text-3xl md:text-4xl lg:text-6xl text-center pb-10 md:pb-20">
          Categories
        </h2>
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          {/* Sidebar / Category List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-0 md:p-4 overflow-x-auto md:overflow-visible">
              <div className="flex lg:flex-col min-w-max lg:min-w-0 gap-2 lg:gap-0">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory.id === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category)}
                      className={`flex-shrink-0 lg:w-full flex cursor-pointer lg:border-b items-center gap-3 px-4 py-3 md:py-6 transition-all duration-200 rounded-lg lg:rounded-none whitespace-nowrap ${isActive
                        ? 'text-blue-800 bg-blue-50 lg:bg-transparent'
                        : 'text-black hover:bg-gray-50'
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-800' : 'text-black'}`} />
                      <span className="text-left text-sm md:text-base font-medium">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <h3 className="text-2xl md:text-3xl mb-6 text-gray-800 font-semibold px-2 lg:px-0">
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