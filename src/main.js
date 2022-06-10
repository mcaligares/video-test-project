import { createButton, createElement } from './dom.service';
import { createVideoElement } from './video.service';
import { createFFmpegElement } from './ffmpeg.service';
import { createVideoSyncElement } from './videoSync.service';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  const ffmpegComponent = createFFmpegElement()
  const videoComponent = createVideoElement('Video', 'open the browser console')
  const videoSyncComponent = createVideoSyncElement('VideoSync', 'open the browser console')
  const contentElement = createElement('div', 'content-element')

  const showComponent = (component) => {
    ffmpegComponent.style.display = component === 'ffmpeg' ? 'block' : 'none'
    videoComponent.style.display = component === 'video' ? 'block' : 'none'
    videoSyncComponent.style.display = component === 'videoSync' ? 'block' : 'none'
  }

  const buttons = createElement('div', 'header-element')
  const buttonVideo = createButton('test video', () => showComponent('video'))
  const buttonFfmpeg = createButton('test ffmpeg', () => showComponent('ffmpeg'))
  const buttonVideoFrame = createButton('test video frame', () => showComponent('videoSync'))
  buttons.append(buttonVideo, buttonFfmpeg, buttonVideoFrame)

  showComponent('videoSync')

  contentElement.append(buttons, videoComponent, ffmpegComponent, videoSyncComponent)
  
  document.getElementById('app').append(contentElement)

});