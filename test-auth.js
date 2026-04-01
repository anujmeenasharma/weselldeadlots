
const SHOPIFY_CONFIG = {
    storeUrl: "738eda.myshopify.com",
    apiVersion: "2024-01",
    id: "4f959e8222a7eedbd52c1187d9283863",
    secret: "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"
};

async function testToken() {
    // Attempt 1: Using secret as X-Shopify-Access-Token
    try {
        console.log("Testing secret as X-Shopify-Access-Token...");
        const res1 = await fetch(`https://${SHOPIFY_CONFIG.storeUrl}/admin/api/${SHOPIFY_CONFIG.apiVersion}/shop.json`, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_CONFIG.secret,
                'Content-Type': 'application/json'
            }
        });
        console.log("Status 1:", res1.status);
    } catch (e) {
        console.error(e);
    }
    
    // Attempt 2: Basic Auth with ID and Secret (legacy private apps)
    try {
        console.log("Testing Basic Auth...");
        const auth = Buffer.from(`${SHOPIFY_CONFIG.id}:${SHOPIFY_CONFIG.secret}`).toString('base64');
        const res2 = await fetch(`https://${SHOPIFY_CONFIG.storeUrl}/admin/api/${SHOPIFY_CONFIG.apiVersion}/shop.json`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Status 2:", res2.status);
    } catch (e) {
        console.error(e);
    }
}
testToken();
