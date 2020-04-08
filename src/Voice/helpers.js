let ws = null

export const connectWebSocket = url => {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(url)
    ws.addEventListener('open', resolve)
    ws.addEventListener('error', reject)
  })
}

export const closeWebSocket = () => {
  ws.close()
  ws = null
}

export const sendWebSocketMessage = data => {
  ws.send(data)
}

export const listenToWebSocket = () => {
  ws.addEventListener('message', data => {
    return JSON.parse(data)
  })
}

// quick guid see https://stackoverflow.com/a/21963136 (this is e7)
export const transactionId = () => {
  let lut = []

  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16)
  }

  // TODO:
  // Possible replace:  Math.random()*0xFFFFFFFF for Math.random()*0x100000000 - for better randomisation
  // use window.crypto.getRandomValues and use Math.random() as fallback
  let d0 = (Math.random() * 0xffffffff) | 0
  let d1 = (Math.random() * 0xffffffff) | 0
  let d2 = (Math.random() * 0xffffffff) | 0
  let d3 = (Math.random() * 0xffffffff) | 0

  return (
    lut[d0 & 0xff] +
    lut[(d0 >> 8) & 0xff] +
    lut[(d0 >> 16) & 0xff] +
    lut[(d0 >> 24) & 0xff] +
    '-' +
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    '-' +
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d1 >> 24) & 0xff] +
    '-' +
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    '-' +
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff] +
    lut[d3 & 0xff] +
    lut[(d3 >> 8) & 0xff] +
    lut[(d3 >> 16) & 0xff] +
    lut[(d3 >> 24) & 0xff]
  )
}
