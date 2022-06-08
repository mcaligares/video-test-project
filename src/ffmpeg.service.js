import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { createButton, createElement } from './dom.service';

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
  const runButton = createButton('run script', () => {
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
  const imgElement = document.createElement('img')
  imgElement.src = '../assets/placeholder.png'
  const frameButton = createButton('get frame', () => {
    const data = ffmpeg.FS('readFile', 'out.png')
    imgElement.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }))
  })

  content.append(loadButton, fetchButton, runButton, frameButton)

  element.append(header, content, imgElement)

  return element
}
