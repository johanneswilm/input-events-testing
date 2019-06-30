const assert = require('assert')
const {Builder, Key, By} = require('selenium-webdriver')

describe('Test event triggering', () => {
    let driver;
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build()
    });

    it('triggers beforeinput and input events on text typing', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        const message = 'Hello'
        await driver.findElement(By.id('editor')).sendKeys(message)

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))
        // 10 events (5 beforeinput + 5 input events)
        assert.equal(eventsLog.length, 10)
        for (let i = 0; i < eventsLog.length; i += 2) {
            const beforeInputEvent = eventsLog[i]
            const inputEvent = eventsLog[i + 1]
            assert.equal(beforeInputEvent.type, 'beforeinput')
            assert.equal(inputEvent.type, 'input')
            assert.equal(beforeInputEvent.inputType, 'insertText')
            assert.equal(inputEvent.inputType, 'insertText')
            assert.equal(beforeInputEvent.data, inputEvent.data)
            assert.equal(inputEvent.data, message[i/2])
            assert.equal(beforeInputEvent.state + message[i/2], inputEvent.state)
        }
    })

    it('triggers beforeinput and input events on typing RETURN', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        await driver.findElement(By.id('editor')).sendKeys(Key.RETURN)

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))

        assert.equal(eventsLog.length, 2)
        const beforeInputEvent = eventsLog[0]
        const inputEvent = eventsLog[1]
        assert.equal(beforeInputEvent.type, 'beforeinput')
        assert.equal(inputEvent.type, 'input')
        assert.equal(beforeInputEvent.inputType, 'insertParagraph')
        assert.equal(inputEvent.inputType, 'insertParagraph')
        assert.equal(beforeInputEvent.data, inputEvent.data)
    })

    it('triggers beforeinput and input events on typing Shift+RETURN', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        await driver.findElement(By.id('editor')).sendKeys(Key.chord(Key.SHIFT, Key.RETURN))

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))

        assert.equal(eventsLog.length, 2)
        const beforeInputEvent = eventsLog[0]
        const inputEvent = eventsLog[1]
        assert.equal(beforeInputEvent.type, 'beforeinput')
        assert.equal(inputEvent.type, 'input')
        assert.equal(beforeInputEvent.inputType, 'insertLineBreak')
        assert.equal(inputEvent.inputType, 'insertLineBreak')
        assert.equal(beforeInputEvent.data, inputEvent.data)
    })

    it('triggers beforeinput and input events on typing DELETE with pre-existing content', async () => {
        await driver.get('file:///' + __dirname +'/../index.html?<p>Preexisting <i id="caret">c</i>ontent</p>')

        await driver.findElement(By.id('caret')).click()
        await driver.findElement(By.id('editor')).sendKeys(Key.DELETE)


        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))

        assert.equal(eventsLog.length, 2)
        const beforeInputEvent = eventsLog[0]
        const inputEvent = eventsLog[1]
        assert.equal(beforeInputEvent.type, 'beforeinput')
        assert.equal(inputEvent.type, 'input')
        assert.equal(beforeInputEvent.inputType, 'deleteContentForward')
        assert.equal(inputEvent.inputType, 'deleteContentForward')
        assert.equal(beforeInputEvent.data, inputEvent.data)
    })

    it('triggers beforeinput and input events on typing DELETE with no pre-existing content', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        await driver.findElement(By.id('editor')).sendKeys(Key.DELETE)

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))

        assert.equal(eventsLog.length, 2)
        const beforeInputEvent = eventsLog[0]
        const inputEvent = eventsLog[1]
        assert.equal(beforeInputEvent.type, 'beforeinput')
        assert.equal(inputEvent.type, 'input')
        assert.equal(beforeInputEvent.inputType, 'deleteContentForward')
        assert.equal(inputEvent.inputType, 'deleteContentForward')
        assert.equal(beforeInputEvent.data, inputEvent.data)
    })

    it('triggers beforeinput and input events on typing BACK_SPACE with pre-existing content', async () => {
        await driver.get('file:///' + __dirname +'/../index.html?<p>Preexisting <i id="caret">c</i>ontent</p>')

        await driver.findElement(By.id('caret')).click()
        await driver.findElement(By.id('editor')).sendKeys(Key.BACK_SPACE)


        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))

        assert.equal(eventsLog.length, 2)
        const beforeInputEvent = eventsLog[0]
        const inputEvent = eventsLog[1]
        assert.equal(beforeInputEvent.type, 'beforeinput')
        assert.equal(inputEvent.type, 'input')
        assert.equal(beforeInputEvent.inputType, 'deleteContentBackward')
        assert.equal(inputEvent.inputType, 'deleteContentBackward')
        assert.equal(beforeInputEvent.data, inputEvent.data)
    })

    it('triggers beforeinput and input events on typing BACK_SPACE with no pre-existing content', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        await driver.findElement(By.id('editor')).sendKeys(Key.BACK_SPACE)

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))

        assert.equal(eventsLog.length, 2)
        const beforeInputEvent = eventsLog[0]
        const inputEvent = eventsLog[1]
        assert.equal(beforeInputEvent.type, 'beforeinput')
        assert.equal(inputEvent.type, 'input')
        assert.equal(beforeInputEvent.inputType, 'deleteContentBackward')
        assert.equal(inputEvent.inputType, 'deleteContentBackward')
        assert.equal(beforeInputEvent.data, inputEvent.data)
    })

    it('triggers beforeinput and input events on typing Undo and Redo key combinations with an existing history', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        // Create history
        await driver.findElement(By.id('editor')).sendKeys("hello")
        // Decide whether to use  Key.COMMAND (mac) or Key.CONTROL (everything else)
        const modifierKey = await driver.findElement(By.id('platform')).getAttribute("innerHTML").then(
            platform => platform.toUpperCase().includes('MAC') ? Key.COMMAND : Key.CONTROL
        )
        // Undo
        await driver.findElement(By.id('editor')).sendKeys(Key.chord(modifierKey, "z"))
        // Redo
        await driver.findElement(By.id('editor')).sendKeys(Key.chord(modifierKey, Key.SHIFT, "z"))

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        // Ignore the first 10 items on the event log.
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html).slice(10))
        assert.equal(eventsLog.length, 4)
        const inputTypes = ['historyUndo', 'historyRedo']
        for (let i = 0; i < eventsLog.length; i += 2) {
            const beforeInputEvent = eventsLog[i]
            const inputEvent = eventsLog[i + 1]
            assert.equal(beforeInputEvent.type, 'beforeinput')
            assert.equal(inputEvent.type, 'input')
            assert.equal(beforeInputEvent.inputType, inputTypes[i/2])
            assert.equal(inputEvent.inputType, inputTypes[i/2])
            assert.equal(beforeInputEvent.data, inputEvent.data)
        }
    })

    it('triggers beforeinput and input events on typing Undo and Redo key combinations without an existing history', async () => {
        await driver.get('file:///' + __dirname +'/../index.html')
        await driver.findElement(By.id('editor')).click()
        // Decide whether to use  Key.COMMAND (mac) or Key.CONTROL (everything else)
        const modifierKey = await driver.findElement(By.id('platform')).getAttribute("innerHTML").then(
            platform => platform.toUpperCase().includes('MAC') ? Key.COMMAND : Key.CONTROL
        )
        // Undo
        await driver.findElement(By.id('editor')).sendKeys(Key.chord(modifierKey, "z"))
        // Redo
        await driver.findElement(By.id('editor')).sendKeys(Key.chord(modifierKey, Key.SHIFT, "z"))

        const inputEventsEl = await driver.findElement(By.id('input-events'))
        // Ignore the first 10 items on the event log.
        const eventsLog = await inputEventsEl.getAttribute("innerHTML").then(html => JSON.parse(html))
        assert.equal(eventsLog.length, 4)
        const inputTypes = ['historyUndo', 'historyRedo']
        for (let i = 0; i < eventsLog.length; i += 2) {
            const beforeInputEvent = eventsLog[i]
            const inputEvent = eventsLog[i + 1]
            assert.equal(beforeInputEvent.type, 'beforeinput')
            assert.equal(inputEvent.type, 'input')
            assert.equal(beforeInputEvent.inputType, inputTypes[i/2])
            assert.equal(inputEvent.inputType, inputTypes[i/2])
            assert.equal(beforeInputEvent.data, inputEvent.data)
        }
    })

    afterAll(() => {
      if (driver) {
        driver.quit()
      }
    })
})
