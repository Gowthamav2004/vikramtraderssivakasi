const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scraped_products.json', 'utf8'));

let jsContent = `/* ============================================================
   PRODUCT & CATEGORY DATA
   Edit this file to add/remove products or change prices.
   Every price is in INR. "mrp" is the printed/original price,
   "price" is the discounted selling price shown to the customer.
   ============================================================ */

const CATEGORIES = ${JSON.stringify(data.categories, null, 2)};

const PRODUCTS = ${JSON.stringify(data.products, null, 2)};
`;

fs.writeFileSync('products.js', jsContent);
console.log("Updated products.js successfully.");
