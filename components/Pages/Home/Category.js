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
          image: '/images/categories/building-material/HVAC SYSTEM.jpg',
          link: '/categories/building-material/hvac-system'
        },
        {
          title: 'FIRE & SAFETY',
          image: '/images/categories/building-material/fire and safety.jpg',
          link: '/categories/building-material/fire-and-safety'
        },
        {
          title: 'SANITARY / PLUMBING SYSTEM',
          image: '/images/categories/building-material/sanitary and plumbing system.jpg',
          link: '/categories/building-material/sanitary-plumbing-system'
        },
        {
          title: 'HARDWARE',
          image: '/images/categories/building-material/hardware.jpg',
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
          image: '/images/categories/electrical/Switchgear.jpg',
          link: '/categories/electrical/switchgear'
        },
        {
          title: 'AUTOMATION & PLC',
          image: '/images/categories/electrical/automation and plc.jpg',
          link: '/categories/electrical/automation-and-plc'
        },
        {
          title: 'CABLES & WIRES',
          image: '/images/categories/electrical/cables and wires.jpg',
          link: '/categories/electrical/cables-and-wires'
        },
        {
          title: 'SWITCHES & SOCKETS',
          image: '/images/categories/electrical/switch and socket.jpg',
          link: '/categories/electrical/switches-and-sockets'
        },
        {
          title: 'LIGHTING',
          image: '/images/categories/electrical/Lighting.jpg',
          link: '/categories/electrical/lighting'
        },
        {
          title: 'ELECTRONICS',
          image: '/images/categories/electrical/Electronics.jpg',
          link: '/categories/electrical/electronics'
        },
        {
          title: 'HARDWARE',
          image: '/images/categories/electrical/hardware.jpg',
          link: '/categories/electrical/hardware'
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
          image: '/images/categories/tools/power tools (5).jpg',
          link: '/categories/tools/power-tools'
        },
        {
          title: 'HAND TOOLS',
          image: '/images/categories/tools/hand tools.jpg',
          link: '/categories/tools/hand-tools'
        },
        {
          title: 'POWER TOOLS ACCESSORIES',
          image: '/images/categories/tools/power tools accessories.jpg',
          link: '/categories/tools/power-tools-accessories'
        },
        {
          title: 'OTHER TOOLS',
          image: '/images/categories/tools/other tools.png',
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
          image: '/images/categories/industrial-equipment/machinery.jpg',
          link: '/categories/industrial-equipment/machinery'
        },
        {
          title: 'BEARINGS',
          image: '/images/categories/industrial-equipment/bearings.jpg',
          link: '/categories/industrial-equipment/bearings'
        },
        {
          title: 'HYDRAULIC COMPONENTS',
          image: '/images/categories/industrial-equipment/hydraulic components.jpg',
          link: '/categories/industrial-equipment/hydraulic-components'
        },
        {
          title: 'MOTORS',
          image: '/images/categories/industrial-equipment/motors.jpeg',
          link: '/categories/industrial-equipment/motors'
        },
        {
          title: 'GENERATORS',
          image: '/images/categories/industrial-equipment/generators.png',
          link: '/categories/industrial-equipment/generators'
        }
      ]
    },
    {
      id: 'oil-and-gas-aerospace',
      name: 'Oil & Gas & Aerospace Material',
      icon: Droplets,
      items: [
        {
          title: 'DRILLING EQUIPMENT',
          image: '/images/categories/oil-and-gas/drilling equipments.png',
          link: '/categories/oil-and-gas/drilling-equipment'
        },
        {
          title: 'VALVES & FLOW CONTROL',
          image: '/images/categories/oil-and-gas/valves and flow meter.jpg',
          link: '/categories/oil-and-gas/valves-and-flow-control'
        },
        {
          title: 'PUMPS & COMPRESSORS',
          image: '/images/categories/oil-and-gas/pumps and compressors.jpg',
          link: '/categories/oil-and-gas/pumps-and-compressors'
        },
        {
          title: 'MEASUREMENT & INSTRUMENTATION',
          image: '/images/categories/oil-and-gas/measurement and instrumentation.jpg',
          link: '/categories/oil-and-gas/measurement-and-instrumentation'
        },
        {
          title: 'AIRCRAFT STRUCTURAL MATERIAL',
          image: '/images/categories/oil-and-gas/aircraft structural materail.jpg',
          link: '/categories/oil-and-gas/aircraft-structural-material'
        },
        {
          title: 'AIRCRAFT FASTENERS',
          image: '/images/categories/oil-and-gas/aircraft fastner.jpg',
          link: '/categories/oil-and-gas/aircraft-fasteners'
        },
        {
          title: 'AIRCRAFT ELECTRICAL COMPONENTS',
          image: '/images/categories/oil-and-gas/aircraft electrical component.jpg',
          link: '/categories/oil-and-gas/aircraft-electrical-components'
        },
        {
          title: 'AIRCRAFT HYDRAULIC SYSTEM',
          image: '/images/categories/oil-and-gas/aircraft hydraulic system.jpg',
          link: '/categories/oil-and-gas/aircraft-hydraulic-system'
        },
        {
          title: 'AIRCRAFT MAINTENANCE MATERIAL',
          image: '/images/categories/oil-and-gas/Aircraft maintanance material.jpg',
          link: '/categories/oil-and-gas/aircraft-maintenance-material'
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
          image: '/images/categories/marine/marine engine system.jpg',
          link: '/categories/marine/marine-engine-system'
        },
        {
          title: 'MARINE ELECTRICAL SYSTEM',
          image: '/images/categories/marine/marine electrical system.jpg',
          link: '/categories/marine/marine-electrical-system'
        },
        {
          title: 'MARINE NAVIGATION & COMMUNICATION',
          image: '/images/categories/marine/marine navigation and communication.jpg',
          link: '/categories/marine/marine-navigation-and-communication'
        },
        {
          title: 'MARINE SAFETY EQUIPMENT',
          image: '/images/categories/marine/marine safety equipment .jpg',
          link: '/categories/marine/marine-safety-equipment'
        },
        {
          title: 'DECK & MOORING EQUIPMENT',
          image: '/images/categories/marine/deck and mooring equipment.jpg',
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
          image: '/images/categories/it/Computer and laptop.png',
          link: '/categories/computers-and-it/computers-and-laptops'
        },
        {
          title: 'PC / LAPTOP ACCESSORIES',
          image: '/images/categories/it/PC Laptop accessories.jpg',
          link: '/categories/computers-and-it/pc-laptop-accessories'
        },
        {
          title: 'BATTERY',
          image: '/images/categories/it/batteries.jpg',
          link: '/categories/computers-and-it/battery'
        },
        {
          title: 'NETWORKING DEVICES',
          image: '/images/categories/it/networking devices.png',
          link: '/categories/computers-and-it/networking-devices'
        },
        {
          title: 'DATA STORAGE',
          image: '/images/categories/it/data storage.png',
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
          image: '/images/categories/consumer-goods/Garments.jpg',
          link: '/categories/consumer-goods/garments'
        },
        {
          title: 'COSMETICS & PERSONAL CARE',
          image: '/images/categories/consumer-goods/cosmetics and personal care.jpg',
          link: '/categories/consumer-goods/cosmetics-and-personal-care'
        },
        {
          title: 'TOYS & GAMES',
          image: '/images/categories/consumer-goods/toys and games.jpg',
          link: '/categories/consumer-goods/toys-and-games'
        },
        {
          title: 'KIDS ESSENTIALS',
          image: '/images/categories/consumer-goods/kids essentials.jpg',
          link: '/categories/consumer-goods/kids-essentials'
        },
        {
          title: 'FOOTWEAR',
          image: '/images/categories/consumer-goods/footwear.jpg',
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