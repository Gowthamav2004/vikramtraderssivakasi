const fs = require('fs');
const cheerio = require('cheerio');

const content = fs.readFileSync(String.raw`C:\Users\Admin\.gemini\antigravity-ide\brain\31a19191-df8e-441b-b7ac-7591d4d9308b\.system_generated\steps\150\content.md`, 'utf8');

const $ = cheerio.load(content);
const products = [];
const categories = [];
let currentCategory = "";
let currentCatId = "";

$('#order-table tbody tr').each((i, el) => {
    const tr = $(el);
    if (tr.hasClass('sub')) {
        currentCategory = tr.text().trim();
        currentCatId = currentCategory.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        categories.push({
            id: currentCatId,
            name: currentCategory,
            icon: "sparkler"
        });
    } else if (tr.hasClass('odd') || tr.hasClass('even')) {
        try {
            const name = tr.find('.product_name').text().trim();
            const desc = tr.find('.product_content').text().trim();
            const mrpText = tr.find('.product_rate').text().trim();
            const priceText = tr.find('.discounted_price').text().trim();
            
            const mrpMatch = mrpText.match(/\d+/);
            const mrp = mrpMatch ? parseInt(mrpMatch[0]) : 0;
            
            const priceMatch = priceText.match(/\d+/);
            const price = priceMatch ? parseInt(priceMatch[0]) : 0;
            
            products.push({
                code: `RUBY-${products.length + 1}`,
                cat: currentCatId,
                name: name,
                desc: desc,
                mrp: mrp,
                price: price
            });
        } catch(e) {
            console.log("Error parsing row");
        }
    }
});

fs.writeFileSync('scraped_products.json', JSON.stringify({ categories, products }, null, 2));
console.log(`Found ${categories.length} categories and ${products.length} products.`);
