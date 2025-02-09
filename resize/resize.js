// REF: https://github.com/Tivotal/Resizable-Sidebar-Menu-using-JavaScript/blob/main/app.js

// usage: <div resize="left"></div>

window.addEventListener('mousedown', (event) => {
  /** @type {{ target: HTMLElement }} */
  let { target, offsetX, offsetY, clientX } = event
  let { clientWidth } = target
  //
  if (!target.matches('[resize]')) return;
  // console.log(
  //   offsetX, offsetY,
  //   getComputedStyle(target).borderLeftWidth,
  //   getComputedStyle(target).borderRightWidth,
  //   target.clientWidth
  // )

  let pos = target.getAttribute('resize') ?? 'left'
  pos = pos.toLowerCase()

  if (pos === 'left' && 0 < offsetX) return;
  if (pos === 'right' && offsetX < clientWidth) return;

  event.preventDefault()
  target.classList.add('grabbing')

  let initialX = event.clientX
  let initialWidth = getComputedStyle(target).width
  initialWidth = parseInt(initialWidth, 10)

  let mousemoveListener = (e) => {
    // console.log('mousemove:', e.movementX, e.clientX)

    let newX = e.clientX
    let difX = newX - initialX
    difX *= pos === 'left' ? -1 : 1
    let newWidth = initialWidth + difX

    target.style.width = `${newWidth}px`
    e.stopPropagation()
  }

  let mouseupListener = () => {
    window.removeEventListener('mousemove', mousemoveListener)
    window.removeEventListener('mouseup', mouseupListener)
    target.classList.remove('grabbing')
  }

  window.addEventListener('mousemove', mousemoveListener)
  window.addEventListener('mouseup', mouseupListener)
})

window.addEventListener('mouseover', (event) => {
  /** @type {{ target: HTMLElement }} */
  let { target, offsetX, offsetY, clientX } = event
  let { clientWidth } = target
  //
  if (!target.matches('[resize]')) return;
  // console.log(offsetX, offsetY, getComputedStyle(target).borderLeftWidth)

  let pos = target.getAttribute('resize') ?? 'left'
  pos = pos.toLowerCase()

  if (pos === 'left' && 0 < offsetX) return;
  if (pos === 'right' && offsetX < clientWidth) return;

  target.classList.add('hover')

  let mouseoutListener = () => {
    target.removeEventListener('mouseout', mouseoutListener)
    target.classList.remove('hover')
  }

  target.addEventListener('mouseout', mouseoutListener)

})

document.currentScript.insertAdjacentHTML('afterend', /*html*/`
<style>
[resize] {
  &[resize="left"] {
    border-left: solid 2px transparent;
    transition: border-left .2s;
    &:is(.hover, .grabbing) {
      cursor: col-resize;
      border-left-color: orange;
    }
  }
  &[resize="right"] {
    border-right: solid 2px transparent;
    transition: border-right .2s;
    &:is(.hover, .grabbing) {
      cursor: col-resize;
      border-right-color: orange;
    }
  }
}
</style>`)
