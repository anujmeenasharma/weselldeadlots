"use server";

import { revalidatePath } from "next/cache";

export async function submitProductReview(productId, handle, reviewData) {
    const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    const storeUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
    
    if (!adminToken || !storeUrl) {
        return { success: false, error: "Shopify API credentials missing." };
    }

    try {
        // 1. Fetch current metafields for the product to see if product_reviews exists
        const getUrl = `https://${storeUrl}/admin/api/2024-01/products/${productId}/metafields.json?namespace=custom&key=product_reviews`;
        
        const getResponse = await fetch(getUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminToken,
            },
            cache: 'no-store'
        });

        if (!getResponse.ok) {
            console.error("Failed to fetch product metafields", await getResponse.text());
            return { success: false, error: "Failed to fetch product data." };
        }

        const data = await getResponse.json();
        const existingMetafield = data.metafields ? data.metafields.find(m => m.namespace === 'custom' && m.key === 'product_reviews') : null;

        let existingReviews = [];
        if (existingMetafield) {
            try {
                existingReviews = JSON.parse(existingMetafield.value);
                if (!Array.isArray(existingReviews)) {
                    existingReviews = [];
                }
            } catch (e) {
                console.error("Error parsing existing reviews", e);
                existingReviews = [];
            }
        }

        const newReview = {
            id: Date.now().toString(),
            name: reviewData.name,
            rating: reviewData.rating,
            comment: reviewData.comment,
            date: new Date().toISOString()
        };

        const updatedReviews = [newReview, ...existingReviews];
        const updatedValue = JSON.stringify(updatedReviews);

        // 2. Update or Create Metafield
        let saveUrl = `https://${storeUrl}/admin/api/2024-01/products/${productId}/metafields.json`;
        let method = 'POST';
        
        const payload = {
            metafield: {
                namespace: "custom",
                key: "product_reviews",
                value: updatedValue,
                type: "json"
            }
        };

        if (existingMetafield) {
            saveUrl = `https://${storeUrl}/admin/api/2024-01/metafields/${existingMetafield.id}.json`;
            method = 'PUT';
            payload.metafield = {
                id: existingMetafield.id,
                value: updatedValue,
                type: "json"
            };
        }

        const saveResponse = await fetch(saveUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': adminToken,
            },
            body: JSON.stringify(payload),
            cache: 'no-store'
        });

        if (!saveResponse.ok) {
            const errorText = await saveResponse.text();
            console.error("Failed to save product review", errorText);
            if (errorText.includes("write_products scope")) {
                return { success: false, error: "Shopify Token lacks 'write_products' permission. Please update your Custom App in Shopify Admin." };
            }
            return { success: false, error: "Failed to save product review." };
        }

        revalidatePath(`/product/${handle}`);
        return { success: true };

    } catch (error) {
        console.error("Exception submitting review", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
