// Script to generate SVG placeholder images
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

const placeholders = [
  { name: 'vaccination.jpg', label: 'Vaccination', color: '#1D3557' },
  { name: 'cedeao.jpg', label: 'CEDEAO', color: '#C1121F' },
  { name: 'startup.jpg', label: 'Startup Tech', color: '#1D3557' },
  { name: 'festival.jpg', label: 'Festival', color: '#C1121F' },
  { name: 'parlement.jpg', label: 'Parlement', color: '#1D3557' },
  { name: 'sanpedro.jpg', label: 'San Pedro', color: '#16293f' },
  { name: 'ua-climat.jpg', label: 'Union Africaine', color: '#1D3557' },
  { name: 'chronique.jpg', label: 'Chronique', color: '#16293f' },
  { name: 'interview.jpg', label: 'Interview', color: '#C1121F' },
  { name: 'podcast.jpg', label: 'Podcast', color: '#1D3557' },
];

function generateSVG(label, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${adjustColor(color, -30)}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <text x="320" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.9)">${label}</text>
  <text x="320" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)">L'Encre — Image placeholder</text>
</svg>`;
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

placeholders.forEach(({ name, label, color }) => {
  const filePath = path.join(imagesDir, name.replace('.jpg', '.svg'));
  // Save as SVG but also create a simple buffer for the jpg placeholder
  const svgContent = generateSVG(label, color);
  
  // For Next.js we'll use SVG files instead (rename)
  const svgPath = path.join(imagesDir, name.replace('.jpg', '.svg'));
  fs.writeFileSync(svgPath, svgContent, 'utf8');
  console.log(`Created: ${svgPath}`);
});

console.log('\\nDone! Placeholder images created.');
