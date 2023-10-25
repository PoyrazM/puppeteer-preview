module.exports = {
	click: async (page, selector) => {
		try {
			await page.waitForSelector(selector, { timeout: 5000 })
			await page.click(selector)
		} catch (error) {
			throw new Error(`Could not click on selector: ${selector}`)
		}
	},

	getText: async (page, selector) => {
		try {
			await page.waitForSelector(selector, { timeout: 15000 })
			return await page.$eval(selector, element => element.innerHTML)
		} catch (error) {
			throw new Error(`Cannot get text from selector: ${selector}`)
		}
	},

	getCount: async (page, selector) => {
		try {
			await page.waitForSelector(selector, { timeout: 5000 })
			return await page.$$eval(selector, element => element.length)
		} catch (error) {
			throw new Error(`Cannot get count of selector: ${selector}`)
		}
	},

	sendKeys: async (page, selector, text) => {
		try {
			await page.waitForSelector(selector, { timeout: 5000 })
			await page.type(selector, text)
		} catch (error) {
			throw new Error(`Could not type into selector: ${selector}`)
		}
	},

	waitForText: async (page, selector, text) => {
		try {
			await page.waitForSelector(selector, { timeout: 5000 })
			await page.waitForFunction((selector, text) => {
				document.querySelector(selector).innerText.includes(text),
					{},
					selector,
					text
			})
		} catch (error) {
			throw new Error(`Text: ${text} not found for selector: ${selector}`)
		}
	},

	shouldNotExist: async (page, selector) => {
		try {
			await page.waitForSelector(selector, { hidden: true })
		} catch (error) {
			throw new Error(`Selector: ${selector} is visible, but should not be !`)
		}
	},

	select: async (page, selector, selectedObj) => {
		try {
			await page.waitForSelector(selector, { timeout: 10000 })
			await page.select(selector, selectedObj)
		} catch (error) {
			throw new Error(`Selector: ${selector} was not selected !`)
		}
	},

	selectElem: async (page, selector, value) => {
		try {
			await page.waitForSelector(selector, { timeout: 10000 })
			const selectElem = await page.$(selector)
			await selectElem.type(value)
		} catch (error) {
			throw new Error(`Selector: ${selector} was not selected !`)
		}
	},
}
