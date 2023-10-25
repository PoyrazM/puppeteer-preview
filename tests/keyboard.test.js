const puppeteer = require('puppeteer')
const assert = require('assert')
const helper = require('../core/helper')

describe('Keyboard Test case', () => {
	let browser
	let page

	before(async () => {
		const baseURI = 'http://zero.webappsecurity.com/'

		browser = await puppeteer.launch({
			headless: false,
			slowMo: 10,
			devtools: false,
		})

		page = await browser.newPage()
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

	it('Should be press keyboard action with puppeteer', async () => {
		await page.waitForSelector('#searchTerm')
		await page.type('#searchTerm', 'Mertcan')
		await page.keyboard.press('Enter', { delay: 10 })

		const timeoutInMilliseconds = 5000
		await new Promise(resolve => setTimeout(resolve, timeoutInMilliseconds))
	})

	it.only('Should be check Hidden Element', async () => {
		await helper.click(page, '#signin_button')
		const text = await helper.getText(page, 'h3')
		const count = await helper.getCount(page, 'h3')

		console.log(text)
		console.log(count)

		await helper.shouldNotExist(page, '#signin_button')
	})
})
