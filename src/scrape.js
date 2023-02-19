const puppeteer = require('puppeteer')

async function scrape(url, selector) {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()

    await page.goto(url)
    const element = await page.waitForSelector(selector);
    const price = await page.evaluate(element => element.textContent, element);
    await browser.close()
    return price + " : " + url
}

module.exports = {scrape}
