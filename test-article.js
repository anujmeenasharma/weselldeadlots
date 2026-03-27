import { fetchArticle } from './lib/shopify/index.js';
async function run() {
  const article = await fetchArticle('wholesale-sourcing-for-uae-traders');
  if (article) {
    console.log(article.contentHtml.substring(0, 1500));
  } else {
    // Try blogs- prefix
    const article2 = await fetchArticle('blogs-wholesale-sourcing-for-uae-traders');
    if (article2) {
       console.log(article2.contentHtml.substring(0, 1500));
    }
  }
}
run();
