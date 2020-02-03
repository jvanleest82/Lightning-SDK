export default (ctx, sounds) => {
  return new Promise((resolve, reject) => {
    if (!(sounds instanceof Map)) {
      if (!Array.isArray(sounds)) {
        console.warn('Please provide [key,value] for sound')
        return
      } else {
        sounds = new Map(sounds)
      }
    }

    const bufferList = new Map()
    let queue = sounds.size

    const loaded = () => {
      resolve(bufferList)
    }

    const loadBuffer = (identifier, url) => {
      fetch(url)
        .then(response => {
          return response.arrayBuffer()
        })
        .then(buffer => {
          ctx.decodeAudioData(buffer, data => {
            bufferList.set(identifier, data)
            queue--
            if (!queue) {
              return loaded()
            }
          })
        })
        .catch(err => {
          reject('decodeAudioData error: ', err)
        })
    }

    sounds.forEach((url, id) => {
      loadBuffer(id, url)
    })
  })
}
