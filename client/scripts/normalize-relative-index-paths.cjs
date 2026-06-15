const fs = require("node:fs");
const path = require("node:path");

const indexPath = path.join(__dirname, "..", "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  process.exit(0);
}

const html = fs.readFileSync(indexPath, "utf8");
const normalized = html
  .replace(/(src|href)="\.\/assets\//g, '$1="assets/')
  .replace(/href="\.\/Zepter-Careers images\//g, 'href="Zepter-Careers images/');

fs.writeFileSync(indexPath, normalized);
