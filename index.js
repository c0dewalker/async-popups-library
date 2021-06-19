import * as popups from './popups.js'

const notificationButton = document.querySelector('#notification-button')
const confirmationButton = document.querySelector('#confirm-button')

notificationButton.addEventListener('click', () => handleInput('#notification-input', popups.notification))
confirmationButton.addEventListener('click', () => handleInput('#confirm-input', popups.confirm))

async function handleInput(inputSelector, handler) {
    const input = document.querySelector(inputSelector)
    const message = input.value
    input.value = ''
    const result = await handler(message)
    console.log('Modal result: ', result)
}