const puppeteer = require('puppeteer')

describe('Puppeteer Test case', () => {
	const baseURI = 'https://example.com/'

	it('Should be launch the browser', async () => {
		const browser = await puppeteer.launch({
			headless: false,
			slowMo: 10,
			devtools: false,
		})
		const page = await browser.newPage()

		await page.goto(baseURI)

		const timeoutInMilliseconds = 5000
		await new Promise(resolve => setTimeout(resolve, timeoutInMilliseconds))
		await page.waitForSelector('h1')

		await page.reload()
		await new Promise(resolve => setTimeout(resolve, timeoutInMilliseconds))
		await page.waitForSelector('h1')

		await browser.close()
	})

	it('Should be forward to new tab and back to main tab', async () => {
		const browser = await puppeteer.launch({
			headless: false,
			slowMo: 50,
			devtools: false,
		})

		const page = await browser.newPage()
		await page.goto(baseURI)
		await page.waitForXPath('//h1')

		await page.goto('https://dev.to/')
		await page.waitForSelector('#header-search')
		await page.goBack()

		await page.waitForSelector('h1')

		await page.goForward()
		await page.waitForSelector('#header-search')

		await browser.close()
	})
})
