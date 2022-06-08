
import { createButton, createElement, createInput, createVolume, createPosition } from "./dom.service"

const RATE = 500
const width = 640
const height = 360
const URL  ='https://d3gs9askgf5gv8.cloudfront.net/47473dc7-6ba3-4948-a71b-aba8a3a24278-proxy.mp4'

const createVideo = (src ) => {
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

export const createVideoElement = (name, description, audioFile, logger, create) => {
  let intervalId, time

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
  canvasElement.width = 640
  canvasElement.height = 360
  const context = canvasElement.getContext('2d')
  const renderProcess = () => {
    time = time ?? 0
    const fps = eval(document.getElementById('FPS').value)
    time += fps
    const seg = time / 1000
    videoElement.currentTime = seg

    context.drawImage(videoElement, 0, 0)
    const getBufferText = () => {
      let text = 'Buffer: '
      const buffers = videoElement.buffered
      for (let index = 0; index < buffers.length; index++) {
        const startText = buffers.start(index);
        const endText = buffers.end(index);
        text += `[start: ${startText} end: ${endText}]\n`
      }
      return text
    }
    bufferText.textContent =  getBufferText()
    positionControl.value = seg * 100 / videoElement.duration
    console.log('playing', time, seg, videoElement.currentTime)
  }
  const pauseProcess = () => {
    console.log('pause')
    clearInterval(intervalId)
  }
  const stopProcess = () => {
    console.log('stop')
    clearInterval(intervalId)
    time = 0
    videoElement.currentTime = 0
  }

  const controlElement = createElement('div', 'video-element-controls')
  const dataElement = createElement('div', 'video-data')
  const seekControl = createElement('div', 'seek-control')
  const playerControl = createElement('div', 'player-control')

  const intervalControl = createInput('interval', '1000 / 33', 'video-input')
  const FPSControl = createInput('FPS', '1000 / 33', 'video-input')
  const bufferText = createElement('p', 'video-data-buffer')
  dataElement.append(intervalControl, FPSControl, bufferText)

  const playButton = createButton('play', () => {
    console.log('play')
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
