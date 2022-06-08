import { createButton, createElement } from './dom.service';
import { createVideoElement } from './video.service';
import { createFFmpegElement } from './ffmpeg.service';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  const ffmpegComponent = createFFmpegElement()
  const videoComponent = createVideoElement('Video', 'desc')
  const contentElement = createElement('div', 'content-element')
  
  const button = createButton('test ffmpeg component', () => {
    const display = ffmpegComponent.style.display
    if (display === 'none') {
      ffmpegComponent.style.display = 'block'
      videoComponent.style.display = 'none'
      button.textContent = 'test video component'
    } else {
      ffmpegComponent.style.display = 'none'
      videoComponent.style.display = 'block'
      button.textContent = 'test ffmpeg component'
    }
  })

  ffmpegComponent.style.display = 'none'

  contentElement.append(button, videoComponent, ffmpegComponent)
  
  document.getElementById('app').append(contentElement)

});