const puppeteer = require('puppeteer')
const assert = require('assert')
const expect = require('chai').expect

describe('Element controls test cases', () => {
	let browser
	let page

	before(async () => {
		const baseURI = 'https://example.com/'

		browser = await puppeteer.launch({
			headless: true,
			slowMo: 10,
			devtools: false,
		})

		page = await browser.newPage()
		await page.setDefaultTimeout(10000)
		await page.setDefaultNavigationTimeout(20000)
		await page.goto(baseURI)
	})

	afterEach(async function () {
		const testTitle = this.currentTest.title
		const isStatusFailed = this.currentTest.state === 'failed'

		if (isStatusFailed) {
			await browser.close()
			assert.fail(`\nThe test case was failed !!!! \nTest Case -> ${testTitle}`)
		} else await browser.close()
	})

	it('Should be check page title and URL control with successfully', async () => {
		const title = await page.title()
		const url = await page.url()
		const headerText = await page.$eval('h1', element => element.textContent)
		const elementCount = await page.$$eval('p', element => element.length)

		console.log(`Web Site Title : ${title}`)
		console.log(`Web Site URL : ${url}`)
		console.log(`Header Text in h1 : ${headerText}`)
		console.log(`P element count number is : ${elementCount}`)

		expect(title).to.be.a('string', 'Example Domain')
		expect(url).to.include('example.com')
		expect(headerText).to.be.a('string', 'Example Domain')
		expect(elementCount).to.equal(2)
	})
})
