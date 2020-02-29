import 'bulma-start/css/main.css'
import './css/main.css'

import Drawer from './js/drawer'
import Pixel from './js/pixel'

const RATIO = 15
const SIZE = 24
const SIZE_ARR = [24, 32, 48]
const INIT_COLOR = '#FFB400'
const pixel = new Pixel()

window.onload = function() {
  let canvas = document.createElement('canvas')
  canvas.style.border = 'solid 1px black'
  canvas.id = 'main-canvas'
  let box = document.getElementById('canvas-div')
  box.appendChild(canvas)

  let drawer = new Drawer(SIZE, RATIO)
  let ctx = canvas.getContext('2d')
  refreshCanvas(canvas, ctx, SIZE * RATIO, SIZE * RATIO) // 先更新 canvas
  drawer.drawBG(ctx) // 再更新 drawer，绘制背景
  
  let sizeSelect = document.getElementById('size-select')
  let colorInput = document.getElementById('color-input')
  let colorCanvas = document.getElementById('color-canvas')
  let colorCtx = colorCanvas.getContext('2d')
  colorCtx.fillStyle = INIT_COLOR
  colorCtx.fillRect(0,0,colorCanvas.width, colorCanvas.height)

  sizeSelect.onchange = function(e) {
    let size = SIZE_ARR[sizeSelect.selectedIndex]
    refreshCanvas(canvas, ctx, size * RATIO, size * RATIO)
    drawer.resize(ctx, size)
  }

  canvas.addEventListener('mousedown', (e) => {
    let rect = canvas.getBoundingClientRect()
    let x = ~~((e.clientX - rect.left) / RATIO)
    let y = ~~((e.clientY - rect.top) / RATIO)
    if (x < 0 || y < 0 || x >= drawer.size || y >= drawer.size) return
    let t = pixel.create(x, y, colorCtx.fillStyle)
    drawer.drawPixels2(ctx, t)
    
    if (!canvas.onmousemove) {
      canvas.onmousemove = function(e) {
        let rect = canvas.getBoundingClientRect()
        let x = ~~((e.clientX - rect.left) / RATIO)
        let y = ~~((e.clientY - rect.top) / RATIO)
        if (x < 0 || y < 0 || x >= drawer.size || y >= drawer.size) return
        let t = pixel.create(x, y, colorCtx.fillStyle)
        drawer.drawPixels2(ctx, t)
      }
    }
  })

  canvas.addEventListener('mouseup', (e) => {
    canvas.onmousemove = null
    drawer.onceDone()
  })

  colorInput.oninput = function(e) {
    let colorStr = colorInput.value
    let reg = new RegExp('^#([0-9a-fA-F]{6})$')
    
    if (colorStr == '') colorCtx.fillStyle = INIT_COLOR
    else if (reg.test(colorStr)) colorCtx.fillStyle = colorStr
    else return

    colorCtx.fillRect(0, 0, colorCanvas.width,  colorCanvas.height)
  }

  let cancel = document.getElementById('cancel')
  let redraw = document.getElementById('redraw')
  let save = document.getElementById('save')

  // 撤销上一次操作
  cancel.onclick = function(e) {
    drawer.cancel(ctx)
  }

  // 重画
  redraw.onclick = function(e) {
    drawer.redraw(ctx)
  }

  // 保存像素图
  save.onclick = function(e) {
    var uintc8 = new Uint8ClampedArray(drawer.size * drawer.size * 4);
    for (let i = 0; i < uintc8.length; i++) {
      uintc8[i] = 255
    }
    let data = drawer.op
    
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        let ele = data[i][j]
        let x = ele.x
        let y = ele.y
        let r = parseInt(ele.color.substring(1, 3), 16) // 获取 red 值
        let g = parseInt(ele.color.substring(3, 5), 16) // 获取 green 值
        let b = parseInt(ele.color.substring(5, 7), 16) // 获取 blue 值
        
        uintc8[(y * drawer.size + x) * 4] = r
        uintc8[(y * drawer.size + x) * 4 + 1] = g
        uintc8[(y * drawer.size + x) * 4 + 2] = b
      }
    }

    let imgdata = new ImageData(uintc8, drawer.size, drawer.size)
    
    let tmpcanvas = document.createElement('canvas')
    let tmpctx = tmpcanvas.getContext('2d')
    tmpcanvas.height = drawer.size
    tmpcanvas.width = drawer.size
    tmpctx.putImageData(imgdata, 0, 0)

    download(tmpcanvas.toDataURL('image/png'), ~~(new Date().getTime() / 1000) + '.png')
  }
}

function refreshCanvas(canvas, ctx, width, height) {
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, width, height)
}

function download(url, name) {
  const alink = document.createElement('a')
  alink.download = name
  alink.href = url
  alink.dispatchEvent(new MouseEvent('click', {}))
}