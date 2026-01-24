const shopifyConfig = {
    storeUrl: "738eda.myshopify.com",
    accessToken: "f6558466e9d3ffd0edfeda79dedc938a",
    apiVersion: "2024-04",
};

async function fetchCollections() {
    const query = `
    query {
      collections(first: 50) {
        edges {
          node {
            id
            title
            handle
            metafields(identifiers: [
              {namespace: "custom", key: "sub_category"}
            ]) {
              key
              value
            }
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(
            `https://${shopifyConfig.storeUrl}/api/${shopifyConfig.apiVersion}/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Storefront-Access-Token": shopifyConfig.accessToken,
                    Accept: "application/json",
                },
                body: JSON.stringify({ query }),
            }
        );

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

fetchCollections();
