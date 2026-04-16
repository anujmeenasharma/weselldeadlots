import React, { Suspense } from 'react';
import CategoriesMain from '../../../components/Pages/Categories/CategoriesMain';
import { fetchAllShopifyCollections } from '@/lib/shopifyCollections';

// Revalidate every 10 minutes
export const revalidate = 600;

export default async function CategorySlugPage() {
    const initialCollections = await fetchAllShopifyCollections();

    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <CategoriesMain initialCollections={initialCollections} />
        </Suspense>
    );
}
