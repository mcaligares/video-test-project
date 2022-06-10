import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { createButton, createElement, createInput } from './dom.service';

const file = 'https://d3gs9askgf5gv8.cloudfront.net/47473dc7-6ba3-4948-a71b-aba8a3a24278-proxy.mp4';

const ffmpeg = createFFmpeg({ log: true });

export const createFFmpegElement = () => {
  const element = createElement('div', 'ffmpeg-element')
  const header = createElement('div', 'ffmpeg-header')

  const nameElement = createElement('h1', 'ffmpeg-element-name', 'FFmpeg')
  const descElement = createElement('p', 'ffmpeg-element-desc', 'Open the browser console')
  header.append(nameElement, descElement)

  const content = createElement('div', 'ffmpeg-content')
  const loadButton = createButton('load ffmpeg', () => {
    ffmpeg.load({
      log: true
    }).then(() => {
      console.log('ffmpeg loaded')
    }).catch(e => {
      console.error('ffmpeg error', e)
    })
  })
  const fetchButton = createButton('fetch video', async () => {
    ffmpeg.FS(
      'writeFile', 
      'sample.mp4', 
      await fetchFile(file)
    )
  })
  const runButton = createButton('run getFirstFrame script', () => {
    ffmpeg.run(
      '-i', 
      'sample.mp4',
      '-ss',
      '00:00:03.000',
      '-frames:v',
      '1',
      'out.png',
    ).then(() => {
      console.log('ffmpeg finish process')
    }).catch(e => {
      console.error('ffmpeg error', e)
    })
  })
  const runAllButton = createButton('run getAllFrames script', () => {
    ffmpeg.run(
      '-i', 
      'sample.mp4',
      'out-%03d.jpg',
    ).then(() => {
      console.log('ffmpeg finish process')
    }).catch(e => {
      console.error('ffmpeg error', e)
    })
  })

  const imgElement = document.createElement('img')
  imgElement.src = '../assets/placeholder.png'
  const drawFrame = (frame) => {
    const frameStr = `${frame}`.padStart(3, '0')
    try {
      const data = ffmpeg.FS('readFile', `out-${frameStr}.jpg`)
      imgElement.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }))
    } catch (e) {
      console.error(e)
    }
  }

  const playButton = createButton('play', () => {
    let frame = 1
    let intervalId
    const process = () => {
      drawFrame(frame)
      frame++
      if (frame === 500) {
        clearInterval(intervalId)
      }
    }
    intervalId = setInterval(process, 1000/33)
  })

  const frameContent = createElement('div')
  const frameControl = createInput('frame', 1)
  const frameButton = createButton('get frame', () => {
    const frame = document.getElementById('frame').value
    drawFrame(frame)
  })
  frameContent.append(frameControl, frameButton)

  content.append(loadButton, fetchButton, runButton, runAllButton, playButton)

  element.append(header, content, imgElement, frameContent)

  return element
}
