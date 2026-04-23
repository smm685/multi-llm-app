const puppeteer = require('puppeteer');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
async function pass(label) { console.log(`  ✓  ${label}`); }
async function fail(label, err) { console.error(`  ✗  ${label}\n     ${err.message}`); }

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 },
        slowMo: 60
    });

    const page = await browser.newPage();
    let passed = 0;
    let failed = 0;

    try {
        await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        if (!title.includes('LLM Compare')) throw new Error(`Unexpected title: ${title}`);
        await pass('Landing page loads with correct title');
        passed++;
    } catch (e) { await fail('Landing page loads', e); failed++; }

    await delay(1000);

    try {
        await page.goto(`${BASE_URL}/chat.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#promptInput');
        await page.waitForSelector('#modelSelect');
        await pass('Chat page loads with prompt input and model selector');
        passed++;
    } catch (e) { await fail('Chat page loads', e); failed++; }

    await delay(500);

    try {
        await page.goto(`${BASE_URL}/chat.html`, { waitUntil: 'domcontentloaded' });
        await page.$eval('#promptInput', el => { el.value = ''; });
        const buttons = await page.$$('button');
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text.trim() === 'Send') { await btn.click(); break; }
        }
        await delay(500);
        const errText = await page.$eval('#errorMessage', el => el.innerText.trim());
        if (errText !== 'Please enter a prompt.') throw new Error(`Got: "${errText}"`);
        await pass('Empty prompt shows correct error message');
        passed++;
    } catch (e) { await fail('Empty prompt validation', e); failed++; }

    await delay(500);

    try {
        await page.goto(`${BASE_URL}/chat.html`, { waitUntil: 'domcontentloaded' });
        await page.type('#promptInput', 'Say hello in one word.');
        const buttons = await page.$$('button');
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text.trim() === 'Send') { await btn.click(); break; }
        }
        await page.waitForSelector('.response-column', { timeout: 120000 });
        await pass('Successful query displays response columns');
        passed++;
    } catch (e) { await fail('Successful query shows results', e); failed++; }

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    await delay(2000);
    await browser.close();
    if (failed > 0) process.exit(1);
})();