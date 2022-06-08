import { createVideo } from "./video.service"

const RATE = 500
const width = 640
const height = 360
const URL  ='https://cdn.glitch.me/c162fc32-0a96-4954-83c2-90d4cdb149fc%2FBig_Buck_Bunny_360_10s_20MB.mp4'

export const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName)
  element.className = className
  element.textContent = text
  return element
}

const createInput = (placeholder, value, className) => {
  const content = document.createElement('div')
  const label = document.createElement('label')
  label.textContent = placeholder
  const elemInput = document.createElement('input')
  elemInput.id = placeholder
  elemInput.className = className
  elemInput.value = value
  content.append(label, elemInput)
  return content
}

const createButton = (text, onClick) => {
  const elemButton = document.createElement('button')
  elemButton.textContent = text
  elemButton.onclick = onClick
  return elemButton
}

const createVolume = (onChange) => {
  const volumeControl = document.createElement('input')
  volumeControl.type = 'range'
  volumeControl.min = '0'
  volumeControl.max = '10'
  volumeControl.value = '2'
  volumeControl.onchange = () => {
    onChange(Number.parseInt(volumeControl.value) * 0.1)
  }
  return volumeControl
}

const createPosition = (duration, onChange) => {
  const positionControl = document.createElement('input')
  positionControl.className = 'video-position'
  positionControl.style = `width: ${width}px`
  positionControl.type = 'range'
  positionControl.min = 0
  positionControl.max = duration
  positionControl.value = 0
  positionControl.onchange = () => {
    onChange(Number.parseFloat(positionControl.value))
  }
  return positionControl
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
  const positionControl = createPosition(100, () => {
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
