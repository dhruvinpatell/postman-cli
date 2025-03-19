const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Enable stealth mode to bypass Cloudflare
puppeteer.use(StealthPlugin());

(async () => {
  // Launch Puppeteer with necessary flags for GitHub Actions
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode for GitHub Action
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for GitHub
  });

  const page = await browser.newPage();

  // Set a user-agent to mimic a real browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  );

  // Navigate to fundingpips.com to pass Cloudflare
  console.log('Navigating to https://fundingpips.com...');
  await page.goto('https://fundingpips.com', {
    waitUntil: 'networkidle2', // Wait until the network is idle
  });

  // Get cookies after passing Cloudflare
  const cookies = await page.cookies();
  console.log('Cookies:', cookies);

  // Format cookies as a string for Postman
  const formattedCookies = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  console.log('Formatted Cookies for Postman:', formattedCookies);

  // Save cookies to a file for Postman CLI to use
  fs.writeFileSync('cookies.txt', formattedCookies);

  await browser.close();
})();
