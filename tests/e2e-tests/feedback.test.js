const puppeteer = require('puppeteer')
const helper = require('../../core/helper')
const { expect } = require('chai')

// TODO: Same case will be written with the POM Pattern using Typescript
describe('Login Test', () => {
	let browser
	let page

	const username = 'Mertcan'

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
	})

	after(async function () {
		const testTitle = this.currentTest.title
		const isStatusFailed = this.currentTest.state === 'failed'

		if (isStatusFailed) {
			await browser.close()
			assert.fail(`\nThe test case was failed !!!! \nTest Case -> ${testTitle}`)
		} else await browser.close()
	})

	it('Should be display feedback form', async () => {
		await navigateToFeedbackPage(page)
	})

	it('Should be submit feedback form', async () => {
		await fillFeedbackForm(
			page,
			username,
			'mertcantest@mail.com',
			'Bank Account',
			'My Bank account page was not open !'
		)
	})

	it('Should be display results page', async () => {
		const expectedMessage = `Thank you for your comments, ${username}. They will be reviewed by our Customer Service staff and given the full attention that they deserve.`
		await checkResultsPage(page, expectedMessage)
	})
})

const FEEDBACK_MENU_BUTTON = '#feedback'
const FEEDBACK_PAGE_TITLE = '#feedback-title'

navigateToFeedbackPage = async page => {
	await helper.click(page, FEEDBACK_MENU_BUTTON)
	const title = await helper.getText(page, FEEDBACK_PAGE_TITLE)
	expect(title).to.be.equal('Feedback')
}

const NAME_INPUT = '#name'
const EMAIL_INPUT = '#email'
const SUBJECT_INPUT = '#subject'
const COMMENT_INPUT = '#comment'
const SUBMIT_MESSAGE_BUTTON = '[type="submit"]'

fillFeedbackForm = async (page, name, email, subject, comment) => {
	await helper.sendKeys(page, NAME_INPUT, name)
	await helper.sendKeys(page, EMAIL_INPUT, email)
	await helper.sendKeys(page, SUBJECT_INPUT, subject)
	await helper.sendKeys(page, COMMENT_INPUT, comment)
	await helper.click(page, SUBMIT_MESSAGE_BUTTON)
}

const PAGE_HEADER = '.span6'

checkResultsPage = async (page, expectedMessage) => {
	const actualUrl = await page.url()
	expect(actualUrl).to.include('sendFeedback.html')

	const textElement = await page.$(PAGE_HEADER)
	const untrimmedMessage = await page.evaluate(
		element => element.textContent,
		textElement
	)
	const actualResultMessage = untrimmedMessage
		.replace(/Feedback\s+/, '')
		.replace(/\s+/g, ' ')
		.trim()

	expect(actualResultMessage).to.be.equal(expectedMessage)
}
