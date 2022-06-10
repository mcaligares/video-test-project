
import { createButton, createElement, createInput, createVolume, createPosition } from "./dom.service"

const RATE = 500
const width = 768
const height = 432
const URL  ='https://d3gs9askgf5gv8.cloudfront.net/47473dc7-6ba3-4948-a71b-aba8a3a24278-proxy.mp4'

let frames = []
window.frames = frames

const createVideo = (src ) => {
  const videoElement = document.createElement('video')
  videoElement.controls = true
  videoElement.src = src
  videoElement.crossOrigin = '*'
  // videoElement.preload = 'auto'
  videoElement.load()
  const eventHandler = (event) => {
    console.log('event:', event.type)
  }
  videoElement.addEventListener('abort', eventHandler)
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
  videoElement.addEventListener('stalled', eventHandler)
  videoElement.addEventListener('suspend', eventHandler)
  videoElement.addEventListener('volumechange', eventHandler)
  videoElement.addEventListener('waiting', eventHandler)
  return videoElement
}

const loadFrames = async (videoElement, context, segIn, segOut, fps) => {
  const framesForSeg = []
  const intervalTime = 1000 / fps
  console.log(`[loadFrame] starting for ${segIn}seg to ${segOut}seg with ${fps}FPS`)
  console.log(`[loadFrame] loop interval is ${intervalTime}`)

  // const canvas = document.createElement('canvas')
  // canvas.width = width
  // canvas.height = height
  // const context = canvas.getContext('2d')

  const loadFrame = (millisecond) => {
    return new Promise((resolve, reject) => {
      const errorEvent = function(e) {
        console.log('[loadFrame] error on seeking', millisecond)
        reject(e)
      }
      const seekingEvent = function() {
        console.log('[loadFrame] seeking at', millisecond)
      }
      const seekedEvent = function() {
        console.log('[loadFrame] seeked at', millisecond)
        context.drawImage(videoElement, 0, 0)
        const type = 'image/jpeg'
        const encoderOptions = document.getElementById('segin').value
        const frame = context.canvas.toDataURL(type, encoderOptions)
        const img = new Image(width, height)
        img.src = frame
        videoElement.removeEventListener('seeking', seekingEvent)
        videoElement.removeEventListener('seeked', seekedEvent)
        videoElement.removeEventListener('error', errorEvent)
        resolve(img)
      }
  
      videoElement.addEventListener('seeking', seekingEvent)
      videoElement.addEventListener('seeked', seekedEvent)
      videoElement.addEventListener('error', errorEvent)

      console.log('[loadFrame] setting currentTime', millisecond / 1000)
      videoElement.currentTime = millisecond / 1000
    })
  }

  const bufferText = document.getElementsByClassName('video-data-buffer')[0]
  const framesBufferText = document.getElementsByClassName('video-data-frames-buffer')[0]
  for (let seg = segIn; seg < segOut; seg++) {
    console.log(`[loadFrame] getting frames for ${seg}seg`)
    for (let j = 0; j < fps; j++) {
      console.log(`[loadFrame] getting frame nro${j}`)
      const millisecond = j === 0 ? 0.00001 : j * intervalTime
      const frame = await loadFrame(millisecond + seg * 1000)
      framesForSeg.push(frame)
      bufferText.textContent = getBufferText(videoElement)
      framesBufferText.textContent = `Frame Buffer: ${framesForSeg.length} frames loaded`
    }
  }

  console.log(`[loadFrame] frames loaded from ${segIn}seg to ${segOut}seg`)
  return framesForSeg
}

const getBufferText = (videoElement) => {
  let text = 'Buffer: '
  const buffers = videoElement.buffered
  for (let index = 0; index < buffers.length; index++) {
    const startText = buffers.start(index);
    const endText = buffers.end(index);
    text += `[start: ${startText} end: ${endText}]\n`
  }
  return text
}

export const createVideoSyncElement = (name, description, audioFile, logger, create) => {
  let intervalId, frameIndex, time

  const videoComponent = createElement('div', 'video-component')
  const videoHeader = createElement('div', 'video-header')
  const videoContent = createElement('div', 'video-content')

  const nameElement = createElement('h1', 'video-element-name', name)
  const descElement = createElement('p', 'video-element-desc', description)
  const urlElement = createInput('URL', URL, 'video-input')
  const loadButton = createButton('load', () => {
    videoElement.src = document.getElementById('URL').value
  })
  videoHeader.append(nameElement, descElement, urlElement, loadButton)

  const videoElement = createVideo(URL)

  const canvasElement = document.createElement('canvas')
  canvasElement.width = width
  canvasElement.height = height
  const context = canvasElement.getContext('2d')
  const renderProcess = () => {
    frameIndex = frameIndex ?? 0
    time = time ?? 0
    const fps = eval(document.getElementById('FPS').value)
    time += fps
    const seg = time / 1000
    const imgElement = frames[frameIndex]
    // videoElement.currentTime = seg

    if (imgElement) {
      context.drawImage(imgElement, 0, 0)
    }
    frameIndex++
    bufferText.textContent = getBufferText(videoElement)
    positionControl.value = seg * 100 / videoElement.duration
    console.log('playing', time, seg, videoElement.currentTime)
  }
  const pauseProcess = () => {
    console.log('pause')
    videoElement.pause()
    clearInterval(intervalId)
  }
  const stopProcess = () => {
    console.log('stop')
    clearInterval(intervalId)
    videoElement.pause()
    time = 0
    frameIndex = 0
    positionControl.value = 0
    videoElement.currentTime = 0
  }

  const controlElement = createElement('div', 'video-element-controls')
  const dataElement = createElement('div', 'video-data')
  const seekControl = createElement('div', 'seek-control')
  const playerControl = createElement('div', 'player-control')

  const intervalControl = createInput('interval', '1000 / 33', 'video-input')
  const FPSControl = createInput('FPS', '1000 / 33', 'video-input')
  const framesControl = createInput('frames', '33', 'video-input')
  const qualityControl = createInput('quality', 1, 'video-input')
  const segInControl = createInput('segin', 0, 'video-input')
  const segOutControl = createInput('segout', 19, 'video-input')
  const loadBufferButton = createButton('loadBuffer', async () => {
    const timer = performance.now()
    frames = await loadFrames(
      videoElement,
      context,
      document.getElementById('segin').value,
      document.getElementById('segout').value,
      document.getElementById('frames').value
    )
    console.log(`${frames.length} frames loaded in ${(performance.now() - timer)} milliseconds`)
    framesBufferText.textContent = `Frame Buffer: ${frames.length} frames loaded`
    stopProcess()
  })
  const bufferText = createElement('p', 'video-data-buffer')
  const framesBufferText = createElement('p', 'video-data-frames-buffer')
  dataElement.append(bufferText, framesBufferText, intervalControl, FPSControl, framesControl, qualityControl, segInControl, segOutControl, loadBufferButton)

  const playButton = createButton('play', () => {
    console.log('play')
    videoElement.play()
    intervalId = setInterval(renderProcess, eval(document.getElementById('interval').value));
  })
  const pauseButton = createButton('pause', pauseProcess)
  const stopButton = createButton('stop', stopProcess)
  const volumeControl = createVolume(() => {})
  const positionControl = createPosition(100, width, () => {
    time = (positionControl.value * videoElement.duration / 100) * 1000
    console.log('position changed', time)
    renderProcess()
  })

  seekControl.append(positionControl)
  playerControl.append(playButton, pauseButton, stopButton, volumeControl)
  controlElement.append(seekControl, playerControl)

  videoContent.append(videoElement, canvasElement, controlElement, dataElement)

  videoComponent.append(videoHeader, videoContent)
  return videoComponent
}
