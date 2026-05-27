import { Notify } from 'quasar'
import { boot } from 'quasar/wrappers'

const showNotification = (
  strMsg,
  strType = 'positive',
  intTimeInSec = 5,
  blnHtmlTrue = true,
  blnShowCloseBtn = false,
) => {
  Notify.create({
    type: strType,
    html: blnHtmlTrue,
    message: strMsg,
    timeout: intTimeInSec * 1000,
    closeBtn: blnShowCloseBtn,
  })
}

const showSuccess = (strMsg) => {
  showNotification(strMsg)
}

const showError = (strMsg, timeout = 5) => {
  showNotification(strMsg, 'negative', timeout)
}

export default boot(({ app }) => {
  if (process.env.CLIENT) {
    app.config.globalProperties.$showNotification = showNotification
    app.config.globalProperties.$showSuccess = showSuccess
    app.config.globalProperties.$showError = showError
  }
})

export { showError, showNotification, showSuccess }
