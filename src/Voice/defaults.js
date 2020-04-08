import { transactionId } from '../Voice/helpers'

export const defaultVoice = {
  webSocketUrl: 'wss://metrological.dev.vrexcore.net/vrex-hf/speech/websocket',
  webSocketInitMessage: {
    trx: transactionId(),
    appId: 'Metrological-ee6723b8-7ab3-462c-8d93-dbf61227998e',
    codec: 'PCM_16_16K',
    language: 'eng',
    deviceId: '123',
    serviceAccountId: '123',
    deviceType: 'HF',
    deviceName: 'kitchen',
    deviceModel: 'abc',
    partnerId: 'metrological',
    conversationMode: 'false',
    'Push-to-Talk': 'TRUE',
    apiVersion: 'v2',
    updated: Date.now(),
    activateFeature: 'test',
    requestType: 'init',
  },
  webSocketEndOfStreamMessage: {
    requestType: 'end_of_stream',
    reason: 0,
  },
}
