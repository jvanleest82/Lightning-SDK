import Settings from '../Settings/index'
import { defaultVoice } from '../Voice/defaults'
import { initVrex, streamCommand } from './vRex'

let getInfo = key => {
  const voice = { ...defaultVoice, ...Settings.get('platform', 'voice') }
  return Promise.resolve(voice[key])
}

let setInfo = (key, params) => {
  if (key in defaultVoice) defaultVoice[key] = params
}

export const initVoice = config => {
  getInfo = config.getInfo
  setInfo = config.setInfo
  const voiceSettings = { ...defaultVoice, ...Settings.get('platform', 'voice') }
  initVrex(voiceSettings)
}

const getOrSet = (key, params) => (params ? setInfo(key, params) : getInfo(key))

// public API
export default {
  textToSpeech(params) {},

  voiceCommand(stream) {
    return streamCommand(stream)
  },

  webSocketUrl(params) {
    return getOrSet('webSocketUrl', params)
  },
  webSocketInitMessage(params) {
    return getOrSet('webSocketInitMessage', params)
  },
  webSocketEndOfStreamMessage(params) {
    return getOrSet('webSocketEndOfStreamMessage', params)
  },
}
