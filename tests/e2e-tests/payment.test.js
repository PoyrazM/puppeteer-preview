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

	it('Should be make payment with successfully', async () => {
		await page.goBack()
		await helper.click(page, '#online-banking')
		await helper.click(page, '#pay_bills_link')
		await helper.selectElem(page, '#sp_payee', 'Bank of America')
		await helper.selectElem(page, '#sp_account', 'Credit Card')
		await helper.sendKeys(page, '#sp_amount', '2000')
		await helper.sendKeys(page, '#sp_date', '2024-01-17')
		await page.keyboard.press('Enter')
		await helper.sendKeys(page, '#sp_description', 'Credit Card Payment')
		await helper.click(page, '#pay_saved_payees')

		const actualMessage = await helper.getText(
			page,
			'[id="alert_content"] span'
		)

		const expectedMessage = 'The payment was successfully submitted.'
		expect(expect).to.be.equal(actualMessage)
	})
})

const SIGN_IN_BUTTON = '#signin_button'
const USERNAME_INPUT = '#user_login'
const PASSWORD_INPUT = '#user_password'
const REMEMBER_ME_CHECKBOX = '#user_remember_me'
const SUBMIT_BUTTON = 'input.btn'

login = async (page, username, password) => {
	await helper.click(page, SIGN_IN_BUTTON)
	await helper.sendKeys(page, USERNAME_INPUT, username)
	await helper.sendKeys(page, PASSWORD_INPUT, password)
	await helper.click(page, REMEMBER_ME_CHECKBOX)
	await helper.click(page, SUBMIT_BUTTON)
}
