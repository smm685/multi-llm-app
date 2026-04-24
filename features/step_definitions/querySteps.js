const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

setDefaultTimeout(60 * 1000); // 60 seconds

const BASE_URL = 'http://localhost:8080';
let browser;
let page;

Given('I navigate to the home page', async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
});

Given('I am on the chat page', async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto(`${BASE_URL}/chat.html`, { waitUntil: 'domcontentloaded' });
});

When('I type {string} in the prompt box', async (text) => {
  await page.waitForSelector('#promptInput');
  await page.type('#promptInput', text);
});

When('I leave the prompt box empty', async () => {
  await page.waitForSelector('#promptInput');
  await page.$eval('#promptInput', el => { el.value = ''; });
});

When('I click the {string} button', async (label) => {
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text.trim() === label) { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 800));
});

Given('I have deselected all models', async () => {
  await page.evaluate(() => {
    const select = document.querySelector('#modelSelect');
    Array.from(select.options).forEach(opt => { opt.selected = false; });
  });
});

Then('the page title should contain {string}', async (expected) => {
  const title = await page.title();
  assert(title.includes(expected), `Title was: ${title}`);
});

Then('I should see a {string} button', async (label) => {
  const content = await page.content();
  assert(content.includes(label), `Button "${label}" not found`);
  await browser.close();
});

Then('I should see at least 2 response columns on the same page', async () => {
  await page.waitForSelector('.response-column', { timeout: 120000 });
  const cols = await page.$$('.response-column');
  assert(cols.length >= 2, `Only found ${cols.length} columns`);
  await browser.close();
});

Then('I should see an error message {string}', async (expected) => {
  const errText = await page.$eval('#errorMessage', el => el.innerText.trim());
  assert(
    errText.includes(expected.replace('.', '').trim()) || errText === expected,
    `actual: "${errText}" expected: "${expected}"`
  );
  await browser.close();
});

Then('I should see phi3, mistral, and gemma3 as options', async () => {
  const options = await page.$$eval('#modelSelect option', opts => opts.map(o => o.value));
  ['phi3', 'mistral', 'gemma3:1b'].forEach(m => {
    assert(options.includes(m), `Model ${m} not found in selector`);
  });
  await browser.close();
});

Then('at least one model should be selected by default', async () => {
  const selected = await page.$$eval('#modelSelect option', opts =>
    opts.filter(o => o.selected).map(o => o.value)
  );
  assert(selected.length >= 1, 'No model selected by default');
  await browser.close();
});