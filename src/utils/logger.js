/**
 * Browser-friendly logging utility
 * Logs to console with timestamps and formatting
 */

const getTimestamp = () => {
  const now = new Date()
  return now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
}

export const logger = {
  request: (method, endpoint, body = null) => {
    const timestamp = getTimestamp()
    console.log(`%c[${timestamp}] [REQUEST] %c${method} ${endpoint}`, 'color: gray; font-weight: bold', 'color: blue; font-weight: bold')
    if (body) {
      console.log('%cRequest Body:', 'color: blue; font-weight: bold', body)
    }
  },

  response: (method, endpoint, status, data = null) => {
    const timestamp = getTimestamp()
    const statusColor = status >= 200 && status < 300 ? 'green' : 'red'
    console.log(`%c[${timestamp}] [RESPONSE] %c${method} ${endpoint} ${status}`, 'color: gray; font-weight: bold', `color: ${statusColor}; font-weight: bold`)
    if (data) {
      console.log('%cResponse Body:', `color: ${statusColor}; font-weight: bold`, data)
    }
  },

  error: (title, error, details = null) => {
    const timestamp = getTimestamp()
    const errorMsg = error?.message || error || 'Unknown error'
    console.log(`%c[${timestamp}] [ERROR] %c${title}: ${errorMsg}`, 'color: gray; font-weight: bold', 'color: red; font-weight: bold')
    if (details) {
      console.log('%cError Details:', 'color: red; font-weight: bold', details)
    }
  },

  success: (message, data = null) => {
    const timestamp = getTimestamp()
    console.log(`%c[${timestamp}] [SUCCESS] %c${message}`, 'color: gray; font-weight: bold', 'color: green; font-weight: bold')
    if (data) {
      console.log('%cData:', 'color: green; font-weight: bold', data)
    }
  },

  warning: (message, data = null) => {
    const timestamp = getTimestamp()
    console.log(`%c[${timestamp}] [WARNING] %c${message}`, 'color: gray; font-weight: bold', 'color: orange; font-weight: bold')
    if (data) {
      console.log('%cData:', 'color: orange; font-weight: bold', data)
    }
  },

  info: (message, data = null) => {
    const timestamp = getTimestamp()
    console.log(`%c[${timestamp}] [INFO] %c${message}`, 'color: gray; font-weight: bold', 'color: black; font-weight: bold')
    if (data) {
      console.log('%cData:', 'color: black; font-weight: bold', data)
    }
  },

  section: (title) => {
    console.log('%c╔════════════════════════════════════════╗', 'color: cyan; font-weight: bold')
    console.log(`%c║ ${title.padEnd(38)} ║`, 'color: cyan; font-weight: bold')
    console.log('%c╚════════════════════════════════════════╝', 'color: cyan; font-weight: bold')
  },
}
