const puppeteer = require('puppeteer')
const assert = require('assert')

describe('Input Test Cases', () => {
	const baseURI = 'https://devexpress.github.io/testcafe/example/'
	let browser
	let page

	before(async () => {
		browser = await puppeteer.launch({
			headless: false,
			slowMo: 10,
			devtools: false,
		})

		page = await browser.newPage()
		await page.goto(baseURI)
	})

	afterEach(async function () {
		if (this.currentTest.state === 'failed') {
			await browser.close()
			assert.fail('The test case was failed !!!!')
		} else await browser.close()
	})

	it('Should be fill the input fields', async () => {
		const name = 'Mertcan'
		await page.type('#developer-name', name, { delay: 0 })

		const operatingSystem = 'MacOS'
		await selectOS(page, operatingSystem)

		await page.click('#tried-test-cafe', { count: 1 })

		await page.select('#preferred-interface', 'Both')

		const message = 'Example text in the message field.'
		await page.type('#comments', message)

		await page.click('#submit-button')

		await page.waitForSelector('#article-header')
		const element = await page.$('#article-header')

		const textMessage = await page.evaluate(
			element => element.textContent,
			element
		)

		const isTextMessageTrue = textMessage === `Thank you, ${name}!`

		if (isTextMessageTrue) {
			console.log(`The message is -> ${textMessage}`)
			console.log('Text message is true')
		} else assert.fail(`Text message is WRONG ! Text message -> ${textMessage}`)
	})

	it('Should be check page title and URL truthly', async () => {})
})

const selectOS = async (page, operatingSystem) => {
	const osToElementId = {
		MacOS: '#macos',
		Windows: '#windows',
		Linux: '#linux',
	}

	const elementId = osToElementId[operatingSystem]

	if (elementId) await page.click(elementId)
	else console.log('Unsupported operating system selected !')
}
