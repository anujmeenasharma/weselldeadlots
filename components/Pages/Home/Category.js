'use client';

import React, { useState, useEffect } from 'react';
import Link from "@/components/AppLink";
import { Zap, Wrench, Settings, Home, Laptop, Anchor, ShoppingBag, Droplets, Plane } from 'lucide-react';

export const generateSlug = (name) => {
  return name.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-');
};

export default function Category() {
  const categories = [
    {
      id: 'building-material',
      name: 'Building Material',
      icon: Home,
      items: [
        {
          title: 'HVAC SYSTEM',
          image: '/images/categories/hvac-systems.jpg',
          link: '/categories/building-material/hvac-system'
        },
        {
          title: 'FIRE & SAFETY',
          image: '/images/categories/fire-and-safety.jpg',
          link: '/categories/building-material/fire-and-safety'
        },
        {
          title: 'SANITARY / PLUMBING SYSTEM',
          image: '/images/categories/sanitary.jpg',
          link: '/categories/building-material/sanitary-plumbing-system'
        },
        {
          title: 'HARDWARE',
          image: '/images/categories/co5.webp',
          link: '/categories/building-material/hardware'
        }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: Zap,
      items: [
        {
          title: 'SWITCHGEAR',
          image: '/images/categories/Switchgear.jpg',
          link: '/categories/electrical/switchgear'
        },
        {
          title: 'AUTOMATION & PLC',
          image: '/images/categories/automation.jpg',
          link: '/categories/electrical/automation-and-plc'
        },
        {
          title: 'CABLES & WIRES',
          image: '/images/categories/cables.jpg',
          link: '/categories/electrical/cables-and-wires'
        },
        {
          title: 'SWITCHES & SOCKETS',
          image: '/images/categories/switchnsocket.jpg',
          link: '/categories/electrical/switches-and-sockets'
        },
        {
          title: 'LIGHTING',
          image: '/images/categories/Lighting.jpg',
          link: '/categories/electrical/lighting'
        },
        {
          title: 'ELECTRONICS',
          image: '/images/categories/electronics.jpg', // Placeholder; uses existing pattern
          link: '/categories/electrical/electronics'
        }
      ]
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: Wrench,
      items: [
        {
          title: 'POWER TOOLS',
          image: '/images/categories/power-tools-accessories.jpg',
          link: '/categories/tools/power-tools'
        },
        {
          title: 'HAND TOOLS',
          image: '/images/categories/hand-tools.jpg',
          link: '/categories/tools/hand-tools'
        },
        {
          title: 'POWER TOOLS ACCESSORIES',
          image: '/images/categories/to4.webp',
          link: '/categories/tools/power-tools-accessories'
        },
        {
          title: 'OTHER TOOLS',
          image: '/images/categories/other-tools.png',
          link: '/categories/tools/other-tools'
        }
      ]
    },
    {
      id: 'industrial-equipment',
      name: 'Industrial Equipment',
      icon: Settings,
      items: [
        {
          title: 'MACHINERY',
          image: '/images/categories/machinery.jpg',
          link: '/categories/industrial-equipment/machinery'
        },
        {
          title: 'BEARINGS',
          image: '/images/categories/bearings.jpg',
          link: '/categories/industrial-equipment/bearings'
        },
        {
          title: 'HYDRAULIC COMPONENTS',
          image: '/images/categories/hydraulic-components.jpg',
          link: '/categories/industrial-equipment/hydraulic-components'
        },
        {
          title: 'MOTORS',
          image: '/images/categories/motors.jpeg',
          link: '/categories/industrial-equipment/motors'
        },
        {
          title: 'GENERATORS',
          image: '/images/categories/generators.png',
          link: '/categories/industrial-equipment/generators'
        }
      ]
    },
    {
      id: 'oil-and-gas',
      name: 'Oil & Gas',
      icon: Droplets,
      items: [
        {
          title: 'DRILLING EQUIPMENT',
          image: '/images/categories/marine-navigation.jpg',
          link: '/categories/oil-and-gas/drilling-equipment'
        },
        {
          title: 'VALVES & FLOW CONTROL',
          image: '/images/categories/marine-safety.jpg',
          link: '/categories/oil-and-gas/valves-and-flow-control'
        },
        {
          title: 'PUMPS & COMPRESSORS',
          image: '/images/categories/motors.jpeg',
          link: '/categories/oil-and-gas/pumps-and-compressors'
        },
        {
          title: 'MEASUREMENT & INSTRUMENTATION',
          image: '/images/categories/automation.jpg',
          link: '/categories/oil-and-gas/measurement-and-instrumentation'
        }
      ]
    },
    {
      id: 'aerospace-and-aircraft-material',
      name: 'Aerospace & Aircraft Material',
      icon: Plane,
      items: [
        {
          title: 'AIRCRAFT STRUCTURAL MATERIAL',
          image: '/images/categories/marine-electrical.jpg',
          link: '/categories/aerospace-and-aircraft-material/aircraft-structural-material'
        },
        {
          title: 'AIRCRAFT FASTENERS',
          image: '/images/categories/bearings.jpg',
          link: '/categories/aerospace-and-aircraft-material/aircraft-fasteners'
        },
        {
          title: 'AIRCRAFT ELECTRICAL COMPONENTS',
          image: '/images/categories/Lighting.jpg',
          link: '/categories/aerospace-and-aircraft-material/aircraft-electrical-components'
        },
        {
          title: 'AIRCRAFT HYDRAULIC SYSTEM',
          image: '/images/categories/hydraulic-components.jpg',
          link: '/categories/aerospace-and-aircraft-material/aircraft-hydraulic-system'
        },
        {
          title: 'AIRCRAFT MAINTENANCE MATERIAL',
          image: '/images/categories/hand-tools.jpg',
          link: '/categories/aerospace-and-aircraft-material/aircraft-maintenance-material'
        }
      ]
    },
    {
      id: 'marine',
      name: 'Marine',
      icon: Anchor,
      items: [
        {
          title: 'MARINE ENGINE SYSTEM',
          image: '/images/categories/motors.jpeg',
          link: '/categories/marine/marine-engine-system'
        },
        {
          title: 'MARINE ELECTRICAL SYSTEM',
          image: '/images/categories/marine-electrical.jpg',
          link: '/categories/marine/marine-electrical-system'
        },
        {
          title: 'MARINE NAVIGATION & COMMUNICATION',
          image: '/images/categories/marine-navigation.jpg',
          link: '/categories/marine/marine-navigation-and-communication'
        },
        {
          title: 'MARINE SAFETY EQUIPMENT',
          image: '/images/categories/marine-safety.jpg',
          link: '/categories/marine/marine-safety-equipment'
        },
        {
          title: 'DECK & MOORING EQUIPMENT',
          image: '/images/categories/other-tools.png',
          link: '/categories/marine/deck-and-mooring-equipment'
        }
      ]
    },
    {
      id: 'computers-and-it',
      name: 'Computers & IT',
      icon: Laptop,
      items: [
        {
          title: 'COMPUTERS & LAPTOPS',
          image: '/images/categories/t1.webp',
          link: '/categories/computers-and-it/computers-and-laptops'
        },
        {
          title: 'PC / LAPTOP ACCESSORIES',
          image: '/images/categories/t3.webp',
          link: '/categories/computers-and-it/pc-laptop-accessories'
        },
        {
          title: 'BATTERY',
          image: '/images/categories/t2.webp',
          link: '/categories/computers-and-it/battery'
        },
        {
          title: 'NETWORKING DEVICES',
          image: '/images/categories/t3.webp',
          link: '/categories/computers-and-it/networking-devices'
        },
        {
          title: 'DATA STORAGE',
          image: '/images/categories/t4.webp',
          link: '/categories/computers-and-it/data-storage'
        }
      ]
    },
    {
      id: 'consumer-goods',
      name: 'Consumer Goods',
      icon: ShoppingBag,
      items: [
        {
          title: 'GARMENTS',
          image: '/images/categories/c1.webp',
          link: '/categories/consumer-goods/garments'
        },
        {
          title: 'COSMETICS & PERSONAL CARE',
          image: '/images/categories/cosmetics.jpg',
          link: '/categories/consumer-goods/cosmetics-and-personal-care'
        },
        {
          title: 'TOYS & GAMES',
          image: '/images/categories/toys.jpg',
          link: '/categories/consumer-goods/toys-and-games'
        },
        {
          title: 'KIDS ESSENTIALS',
          image: '/images/categories/kids-essentials.jpg',
          link: '/categories/consumer-goods/kids-essentials'
        },
        {
          title: 'FOOTWEAR',
          image: '/images/categories/footwear.jpg',
          link: '/categories/consumer-goods/footwear'
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