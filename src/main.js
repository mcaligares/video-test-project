import { createElement, createVideoElement } from './dom.service';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  const contentElement = createElement('div', 'content-element')
  const videoComponent = createVideoElement('Video', 'desc')

  contentElement.append(videoComponent)

  document.getElementById('app').append(contentElement)

});