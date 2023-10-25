const puppeteer = require('puppeteer')
const helper = require('../../core/helper')
const { expect } = require('chai')

// TODO: Same case will be written with the POM Pattern using Typescript
describe('Login Test', () => {
	let browser
	let page

	const baseURI = 'http://zero.webappsecurity.com/'
	const ALERT_ERROR = 'div.alert-error'

	before(async () => {
		browser = await puppeteer.launch({
			headless: true,
			slowMo: 0,
			devtools: false,
		})

		page = await browser.newPage()
		page.setDefaultTimeout(20000)
		page.setDefaultNavigationTimeout(20000)
	})

	after(async function () {
		const testTitle = this.currentTest.title
		const isStatusFailed = this.currentTest.state === 'failed'

		if (isStatusFailed) {
			await browser.close()
			assert.fail(`\nThe test case was failed !!!! \nTest Case -> ${testTitle}`)
		} else await browser.close()
	})

	it('Should be try login with invalid credentials', async () => {
		await page.goto(baseURI)
		await login(page, 'invaliduser', 'test123')

		const untrimmedAlertMessage = await helper.getText(page, ALERT_ERROR)
		const actualAlertMessage = untrimmedAlertMessage.trim()

		const expectedAlertMessage = 'Login and/or password are wrong.'
		expect(actualAlertMessage).to.be.equal(expectedAlertMessage)
	})

	it('Should be try login with valid credentials', async () => {
		await page.goto(baseURI)
		await login(page, 'username', 'password')
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
