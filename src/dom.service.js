export const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName)
  element.className = className
  element.textContent = text
  return element
}

export const createInput = (placeholder, value, className) => {
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

export const createButton = (text, onClick) => {
  const elemButton = document.createElement('button')
  elemButton.textContent = text
  elemButton.onclick = onClick
  return elemButton
}

export const createVolume = (onChange) => {
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

export const createPosition = (duration, width, onChange) => {
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
