const fs = require('fs');
const path = require('path');

function normalizeFilename(filename) {
    let newName = filename.toLowerCase();
    newName = newName.replace(/ /g, "-");
    newName = newName.replace(/\(/g, "").replace(/\)/g, "");
    return newName;
}

function main() {
    const imagesDir = path.join(__dirname, 'images');
    const baseDir = __dirname;
    
    const filesToUpdate = [
        "index.html",
        "app.js",
        "style.css",
        "products.js"
    ];
    
    const renames = {};
    
    const files = fs.readdirSync(imagesDir);
    for (const filename of files) {
        if (filename.startsWith('.')) continue;
        
        const newName = normalizeFilename(filename);
        if (newName !== filename) {
            const oldPath = path.join(imagesDir, filename);
            const newPath = path.join(imagesDir, newName);
            
            if (newName.toLowerCase() === filename.toLowerCase()) {
                const tempPath = path.join(imagesDir, newName + ".tmp");
                fs.renameSync(oldPath, tempPath);
                fs.renameSync(tempPath, newPath);
            } else {
                fs.renameSync(oldPath, newPath);
            }
            
            renames[filename] = newName;
            console.log(`Renamed: '${filename}' -> '${newName}'`);
        }
    }
    
    console.log(`Total renames: ${Object.keys(renames).length}`);
    
    for (const fileToUpdate of filesToUpdate) {
        const filepath = path.join(baseDir, fileToUpdate);
        if (!fs.existsSync(filepath)) continue;
        
        let content = fs.readFileSync(filepath, 'utf8');
        const originalContent = content;
        
        for (const [oldName, newName] of Object.entries(renames)) {
            // Replace with global regex to catch multiple occurrences
            // Escape oldName for regex
            const escapedOldName = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`images/${escapedOldName}`, 'g');
            content = content.replace(regex, `images/${newName}`);
            
            // Also check for encoded space version (%20)
            const escapedEncoded = oldName.replace(/ /g, '%20').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexEncoded = new RegExp(`images/${escapedEncoded}`, 'g');
            content = content.replace(regexEncoded, `images/${newName}`);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filepath, content, 'utf8');
            console.log(`Updated references in: ${fileToUpdate}`);
        }
    }
}

main();
