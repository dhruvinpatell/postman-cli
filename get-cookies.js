const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Enable stealth plugin to bypass Cloudflare bot detection
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set user-agent to match a real browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  );

  console.log('Navigating to https://mtr-competition.fundingpips.com/login...');
  await page.goto('https://mtr-competition.fundingpips.com/login', {
    waitUntil: 'networkidle2',
  });

  // Get cookies after bypassing Cloudflare
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
