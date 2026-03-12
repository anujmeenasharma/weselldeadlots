'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export const CATEGORY_MAPPING = {
    "Electronic": [
        "Switch Gear",
        "Automation & Control Equipments",
        "Wires & Cables",
        "Switch & Sockets",
        "Electronics & Lighting"
    ],
    "Tools": [
        "Hand Tools",
        "Power Tools",
        "Cutting Tools",
        "Measuring Tools",
        "Fastening Tools"
    ],
    "Industrial": [
        "Machinery",
        "Bearings",
        "Hydraulic Components",
        "Motors",
        "Generators"
    ],
    "Construction": [
        "HVAC Systems",
        "Fire & Safety",
        "Building Materials",
        "Plumbing System",
        "Construction Tools & Equipments"
    ],
    "Technology": [
        "IT Equipments",
        "Batteries",
        "Networking Devices",
        "Data Storages"
    ],
    "Energy": [
        "Oil & Gas Equipments",
        "Marine Supplies",
        "Aerospace & Aircraft Materials"
    ],
    "Consumer": [
        "Garments",
        "Cosmetics & Personal Care",
        "Toys & Games",
        "Kids Essentials",
        "Footwear"
    ],
    "Scrap": []
};

export function createCleanURL(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function CategorySidebar({ initialCategorySlug = '' }) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getInitialExpandedGroups = () => {
        let defaultExpanded = {};
        const cleanInitialSlug = createCleanURL(initialCategorySlug);
        for (const [group, items] of Object.entries(CATEGORY_MAPPING)) {
            const isGroupMatch = createCleanURL(group) === cleanInitialSlug;
            const match = items.some(item => createCleanURL(item) === cleanInitialSlug) || isGroupMatch;
            if (match) {
                defaultExpanded[group] = true;
                break;
            }
        }
        return defaultExpanded;
    };

    const [expandedGroups, setExpandedGroups] = useState(getInitialExpandedGroups);

    const handleGroupToggle = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleCategoryClick = (categoryName) => {
        const clean = createCleanURL(categoryName);
        router.push(`/categories/${clean}`);
    };

    const handleAllClick = () => {
        router.push('/categories');
        setExpandedGroups({});
    };

    return (
        <>
            {/* Mobile Category Toggle */}
            <button
                className="lg:hidden w-full bg-white p-4 rounded-xl shadow-sm text-left font-bold text-gray-800 flex justify-between items-center mb-6"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <span>Browse Categories</span>
                <ChevronDown className={`transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            <aside className={`w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-32 h-fit transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="hidden lg:flex justify-between items-center mb-6 px-1">
                    <h2 className="text-xl font-bold text-gray-800">Categories</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-2 space-y-1">
                    <button
                        onClick={handleAllClick}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-gray-600 hover:bg-gray-50`}
                    >
                        All Products
                    </button>

                    {Object.entries(CATEGORY_MAPPING).map(([groupName, items]) => {
                        const isExpanded = expandedGroups[groupName];
                        const cleanInitialSlug = createCleanURL(initialCategorySlug);
                        const isGroupActive = createCleanURL(groupName) === cleanInitialSlug;
                        const hasActiveChild = items.some(item => createCleanURL(item) === cleanInitialSlug);

                        return (
                            <div key={groupName} className="flex flex-col">
                                <button
                                    onClick={() => handleGroupToggle(groupName)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isGroupActive || hasActiveChild ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>{groupName}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-4 pr-2 pb-2 space-y-1 bg-gray-50/50 rounded-b-lg">
                                        {items.map((item) => {
                                            const cleanInitialSlug = createCleanURL(initialCategorySlug);
                                            const isActive = createCleanURL(item) === cleanInitialSlug;
                                            return (
                                                <button
                                                    key={item}
                                                    onClick={() => handleCategoryClick(item)}
                                                    className={`w-full text-left px-4 py-2 rounded-md text-xs transition-colors ${isActive
                                                        ? 'bg-blue-100 text-blue-700 font-semibold'
                                                        : 'text-gray-500 hover:text-[#1392f9] hover:bg-white'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}
