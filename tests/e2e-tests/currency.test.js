const puppeteer = require('puppeteer')
const helper = require('../../core/helper')
const { expect } = require('chai')

// TODO: Same case will be written with the POM Pattern using Typescript
describe('Payment Test Cases', () => {
	let browser
	let page

	before(async () => {
		const baseURI = 'http://zero.webappsecurity.com/'
		browser = await puppeteer.launch({
			headless: true,
			slowMo: 0,
			devtools: false,
		})

		page = await browser.newPage()
		page.setDefaultTimeout(20000)
		page.setDefaultNavigationTimeout(20000)

		await page.goto(baseURI)
		await login(page, 'username', 'password')
	})

	after(async function () {
		const testTitle = this.currentTest.title
		const isStatusFailed = this.currentTest.state === 'failed'

		if (isStatusFailed) {
			await browser.close()
			assert.fail(`\nThe test case was failed !!!! \nTest Case -> ${testTitle}`)
		} else await browser.close()
	})

	it.only('Should be exchange currency with successfully', async () => {
		await page.goBack()
		await helper.click(page, '#online-banking')
		await helper.click(page, '#pay_bills_link')
		await helper.click(page, 'a[href$="#ui-tabs-3"]')
		await helper.select(page, '#pc_currency', 'EUR')
		await helper.sendKeys(page, '#pc_amount', '350')
		await helper.click(page, '#pc_inDollars_true')
		await helper.click(page, '#purchase_cash')

		const actualMessage = await helper.getText(page, 'div #alert_content')
		const expectedMessage = 'Foreign currency cash was successfully purchased.'
		expect(expectedMessage).to.be.equal(actualMessage)
	})
})
