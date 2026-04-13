const https = require('https');
require('dotenv').config({path: '.env.local'});
require('dotenv').config();

const query = `
{
  collections(first: 250) {
    edges {
      node {
        title
      }
    }
  }
}
`;

const options = {
  hostname: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  path: '/api/2024-01/graphql.json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const collections = json.data?.collections?.edges.map(e => e.node.title) || [];
    console.log(collections);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(JSON.stringify({ query }));
req.end();
