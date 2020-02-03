import loader from './loader'

export default audioContext => {
  let ctx
  let buffering = false
  let buffers

  if (audioContext) {
    ctx = audioContext
  } else {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    ctx = new AudioContext()
  }

  const createSource = identifier => {
    if (buffers.has(identifier)) {
      const source = ctx.createBufferSource()
      source.buffer = buffers.get(identifier)
      source.connect(ctx.destination)
      return source
    }
    return false
  }

  return {
    get context() {
      return ctx
    },
    load: sounds => {
      if (sounds instanceof Map && sounds.size) {
        buffering = true
        return loader(ctx, sounds)
          .then(list => {
            buffers = list
            buffering = false
            return Promise.resolve()
          })
          .catch(err => {
            return Promise.reject('err:', err)
          })
      }
    },
    play: (identifier, offset = 0) => {
      const source = createSource(identifier)
      if (source) {
        source.start(offset)
        return source
      }
    },
    loop: identifier => {
      const source = createSource(identifier)
      if (source) {
        source.loop = true
        source.start(0)
        return source
      }
    },
    get list() {
      return buffers
    },
    get isBuffering() {
      return buffering
    },
  }
}
