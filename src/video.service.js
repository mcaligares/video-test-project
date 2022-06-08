export const createVideo = (src, ) => {
  const videoElement = document.createElement('video')
  videoElement.controls = true
  videoElement.src = src
  // videoElement.preload = 'auto'
  videoElement.load()
  const eventHandler = (event) => {
      if (event.type === 'seeking' || event.type === 'timeupdate' || event.type === 'seeked') {
      console.log('event:', event.type, videoElement.currentTime)
      } else {
      console.log('event:', event.type)
      }
  }
  videoElement.addEventListener('abort', eventHandler)
  videoElement.addEventListener('canplay', eventHandler)
  videoElement.addEventListener('canplaythrough', eventHandler)
  videoElement.addEventListener('emptied', eventHandler)
  videoElement.addEventListener('ended', eventHandler)
  videoElement.addEventListener('error', eventHandler)
  videoElement.addEventListener('loadeddata', eventHandler)
  videoElement.addEventListener('loadedmetadata', eventHandler)
  videoElement.addEventListener('loadstart', eventHandler)
  videoElement.addEventListener('pause', eventHandler)
  videoElement.addEventListener('play', eventHandler)
  videoElement.addEventListener('playing', eventHandler)
  videoElement.addEventListener('progress', eventHandler)
  videoElement.addEventListener('ratechange', eventHandler)
  videoElement.addEventListener('seeked', eventHandler)
  videoElement.addEventListener('seeking', eventHandler)
  videoElement.addEventListener('stalled', eventHandler)
  videoElement.addEventListener('suspend', eventHandler)
  videoElement.addEventListener('timeupdate', eventHandler)
  videoElement.addEventListener('volumechange', eventHandler)
  videoElement.addEventListener('waiting', eventHandler)
  return videoElement
}
