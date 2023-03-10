const puppeteer = require('puppeteer')

async function scrape(url, selector) {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});

    await page.goto(url)
    await navigationPromise;

    const element = await page.waitForSelector(selector);
    const price = await page.evaluate(element => element.textContent, element);
    await browser.close()
    return price + ": " + url
}

module.exports = {scrape}
