const Jimp = require('jimp');
const path = require('path');

const logoPath = path.join(__dirname, 'public/assets/imgs/logo-matlibras.jpeg');

async function createIcons() {
  try {
    const image = await Jimp.read(logoPath);
    
    // Create 192x192 PNG
    await image.clone()
      .resize(192, 192)
      .writeAsync(path.join(__dirname, 'public/assets/imgs/pwa-192x192.png'));
      
    // Create 512x512 PNG  
    await image.clone()
      .resize(512, 512)
      .writeAsync(path.join(__dirname, 'public/assets/imgs/pwa-512x512.png'));

    // Create 144x144, 256x256 etc if needed, but 192 and 512 are enough for Chrome installability
    console.log('Icons resized successfully');
  } catch (err) {
    console.error('Error resizing icons:', err);
  }
}

createIcons();
