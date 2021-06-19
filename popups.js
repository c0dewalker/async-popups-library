const mainElement = document.querySelector('main')
const popups = {
    byId: {},
    ids: []
}

const getNotificationTemplate = (message) => `
            <div class="popupBody">
                <div class="message">${message}</div>
                <button class="btn-ok">OK</button>
            </div>`

const getConfirmationTemplate = (message) => `
            <div class="popupBody">
                <div class="message">${message}</div>
                <button class="btn-cancel">Cancel</button>
                <button class="btn-ok">OK</button>
            </div>`

const createPopupElement = (template) => {
    const popup = document.createElement('div')
    popup.classList.add('modal-background')
    popup.innerHTML = template
    popup.style.zIndex = popups.ids.length + 1
    return popup
}

const addToPopupsList = (popup, id) => {
    popups.byId[id] = popup
    popups.ids.push(id)
}

const transformCoordinates = (popup) => {
    const {top, bottom, left, right} = mainElement.getBoundingClientRect()
    const popupBody = popup.querySelector('.popupBody')
    popupBody.style.left = (right - left) / 2 + 'px'
    popupBody.style.top = ((bottom - top) / 2 - popups.ids.length * 15) + 'px'
}

const mountPopup = (popup) => {
    mainElement.appendChild(popup)
    transformCoordinates(popup)
}

const removePopup = (id) => {
    popups.byId[id].remove()
    delete popups.byId[id]
    popups.ids.splice(popups.ids.indexOf(id), 1)
}

export const notification = (message = 'This is a notification') => {
    const id = Date.now()
    const popup = createPopupElement(getNotificationTemplate(message))
    addToPopupsList(popup, id)
    mountPopup(popup)
    return new Promise(resolve => {
        popup.querySelector('button').addEventListener('click', () => {
            removePopup(id)
            resolve()
        })
    })
}

export const confirm = (message) => {
    const id = Date.now()
    const popup = createPopupElement(getConfirmationTemplate(message))
    addToPopupsList(popup, id)
    mountPopup(popup)
    return new Promise(resolve => {
        popup.addEventListener('click', (ev) => {
            const button = ev.target.closest('button')
            if (button && button.classList.contains('btn-ok')) {
                removePopup(id)
                resolve(true)
            } else if (button && button.classList.contains('btn-cancel')) {
                removePopup(id)
                resolve(false)
            }
        })
    })
}

const closeLastPopupByEscape = (ev) => {
    if (ev.key === "Escape" && popups.ids.length > 0) {
        removePopup(popups.ids[popups.ids.length - 1])
    }
}

const closeLastPopupByClickOutside = (ev) => {
    const isInArea = Boolean(ev.target.closest('main'))
    const isOverAPopup = Boolean(ev.target.closest('.popup'))
    if (isInArea && !isOverAPopup && popups.ids.length > 0) {
        removePopup(popups.ids[popups.ids.length - 1])
    }
}

window.addEventListener('keydown', closeLastPopupByEscape)
window.addEventListener('click', closeLastPopupByClickOutside)

