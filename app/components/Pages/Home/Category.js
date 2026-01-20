'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Wrench, Settings, Home, Laptop, Anchor, ShoppingBag } from 'lucide-react';

export default function Category() {
  const categories = [
    {
      id: 'electrical',
      name: 'Electrical & Automation',
      icon: Zap,
      items: [
        {
          title: 'SWITCH GEAR',
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
          link: '/category/switch-gear'
        },
        {
          title: 'AUTOMATION & CONTROL EQUIPMENTS',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
          link: '/category/automation'
        },
        {
          title: 'WIRES & CABLES',
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
          link: '/category/wires-cables'
        },
        {
          title: 'SWITCHES & SOCKETS',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          link: '/category/switches-sockets'
        },
        {
          title: 'BULBS & LIGHTING',
          image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
          link: '/category/bulbs-lighting'
        }
      ]
    },
    {
      id: 'tools',
      name: 'Tools & Equipments',
      icon: Wrench,
      items: [
        {
          title: 'POWER TOOLS',
          image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop',
          link: '/category/power-tools'
        },
        {
          title: 'HAND TOOLS',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
          link: '/category/hand-tools'
        },
        {
          title: 'MEASURING TOOLS',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
          link: '/category/measuring-tools'
        }
      ]
    },
    {
      id: 'industrial',
      name: 'Industrial Equipments & Components',
      icon: Settings,
      items: [
        {
          title: 'MOTORS & DRIVES',
          image: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e3?w=400&h=300&fit=crop',
          link: '/category/motors-drives'
        },
        {
          title: 'PUMPS & VALVES',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
          link: '/category/pumps-valves'
        },
        {
          title: 'BEARINGS & GEARS',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
          link: '/category/bearings-gears'
        }
      ]
    },
    {
      id: 'construction',
      name: 'Construction & Building Material',
      icon: Home,
      items: [
        {
          title: 'CEMENT & CONCRETE',
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
          link: '/category/cement-concrete'
        },
        {
          title: 'STEEL & METAL',
          image: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e3?w=400&h=300&fit=crop',
          link: '/category/steel-metal'
        },
        {
          title: 'TILES & FLOORING',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
          link: '/category/tiles-flooring'
        }
      ]
    },
    {
      id: 'technology',
      name: 'Technology & Power Solution',
      icon: Laptop,
      items: [
        {
          title: 'GENERATORS',
          image: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e3?w=400&h=300&fit=crop',
          link: '/category/generators'
        },
        {
          title: 'UPS & INVERTERS',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
          link: '/category/ups-inverters'
        },
        {
          title: 'SOLAR PANELS',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
          link: '/category/solar-panels'
        }
      ]
    },
    {
      id: 'maritime',
      name: 'Maritime & Aviation',
      icon: Anchor,
      items: [
        {
          title: 'MARINE EQUIPMENT',
          image: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e3?w=400&h=300&fit=crop',
          link: '/category/marine-equipment'
        },
        {
          title: 'AVIATION PARTS',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
          link: '/category/aviation-parts'
        }
      ]
    },
    {
      id: 'consumer',
      name: 'Consumers Goods & Lifestyle',
      icon: ShoppingBag,
      items: [
        {
          title: 'HOME APPLIANCES',
          image: 'https://images.unsplash.com/photo-1581092583537-20d51876f3e3?w=400&h=300&fit=crop',
          link: '/category/home-appliances'
        },
        {
          title: 'FURNITURE',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
          link: '/category/furniture'
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
                    className={`w-full flex cursor-pointer border-b items-center gap-3 px-4 py-6 transition-all duration-200 ${
                      isActive
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
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
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