'use client';

import React, { Suspense } from 'react';
import CategoriesMain from '../../../../components/Pages/Categories/CategoriesMain';

export default function CategoriesPaginatedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <CategoriesMain />
        </Suspense>
    );
}
