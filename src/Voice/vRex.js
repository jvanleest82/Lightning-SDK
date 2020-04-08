// V-REX: Voice Relevance Engine for Xfinity
import {
  connectWebSocket,
  sendWebSocketMessage,
  listenToWebSocket,
  closeWebSocket,
} from '../Voice/Helpers'

let url = ''
let initMessage = {}
let endOfStreamMessage = {}

export const initVrex = settings => {
  url = settings.webSocketUrl
  initMessage = { ...initMessage, ...settings.webSocketInitMessage }
  endOfStreamMessage = { ...endOfStreamMessage, ...settings.webSocketEndOfStreamMessage }
}

export const streamCommand = data => {
  return connectWebSocket(url).then(connected => {
    console.log('connectWebSocket connected? : ', connected) // Testing
    listenToWebSocket().then(msg => {
      // not doing anything with these right now
      if (msg.requestType === 'listening' || msg.requestType === 'processing') return

      if (msg.originalText) {
        closeWebSocket()
        return msg.originalText
      }

      if (msg.requestType === 'close_mic') {
        closeWebSocket()
      }
    })
    sendWebSocketMessage(JSON.stringify(initMessage))
    sendWebSocketMessage(data)
    sendWebSocketMessage(JSON.stringify(endOfStreamMessage))
  })
}

export const textToSpeech = () => {}
