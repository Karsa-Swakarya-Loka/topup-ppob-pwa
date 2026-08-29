const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'games');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const games = [
  {
    name: 'mobile-legends.jpg',
    urls: [
      'https://images.hdqwalls.com/download/mobile-legends-bang-bang-5k-w0-1080x1920.jpg',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'free-fire.jpg',
    urls: [
      'https://images.hdqwalls.com/download/garena-free-fire-4k-2020-5v-1080x1920.jpg',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'genshin-impact.jpg',
    urls: [
      'https://images.hdqwalls.com/download/genshin-impact-game-4k-q0-1080x1920.jpg',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'pubg-mobile.jpg',
    urls: [
      'https://images.hdqwalls.com/download/pubg-mobile-4k-game-2020-9q-1080x1920.jpg',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'valorant.jpg',
    urls: [
      'https://images.hdqwalls.com/download/valorant-4k-2020-game-poster-9g-1080x1920.jpg',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'honor-of-kings.jpg',
    urls: [
      'https://images.hdqwalls.com/download/honor-of-kings-world-2021-4k-o2-1080x1920.jpg',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'roblox.jpg',
    urls: [
      'https://images.hdqwalls.com/download/roblox-2020-game-4k-w3-1080x1920.jpg',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'steam-wallet.jpg',
    urls: [
      'https://images.unsplash.com/photo-1612287271810-721bc6d68331?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'pln-token.jpg',
    urls: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'pulsa-telkomsel.jpg',
    urls: [
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

async function run() {
  for (const game of games) {
    const dest = path.join(targetDir, game.name);
    let downloaded = false;
    for (const url of game.urls) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(dest, buffer);
          console.log(`✓ ${game.name} from ${new URL(url).hostname}`);
          downloaded = true;
          break;
        }
      } catch (err) {
        // try next
      }
    }
    if (!downloaded) {
      console.log(`✗ ${game.name} FAILED`);
    }
  }
}

run();
