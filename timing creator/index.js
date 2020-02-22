import 'bulma-start/css/main.css'
import './css/main.css'
import '@fortawesome/fontawesome-free/js/all'

import * as acemodule from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-tomorrow'

import parser from './js/parser'
import Drawer from './js/drawer'

window.onload = function() {
  let editor = ace.edit("main-editor")

  editor.$blockScrolling = Infinity
  editor.setFontSize(18)
  editor.setTheme("ace/theme/tomorrow")

  let canvas = document.getElementById('main-canvas')
  let ctx = canvas.getContext('2d')
  let draw = new Drawer()

  let playBtn = document.getElementById('play')
  playBtn.onclick = function() {
    timingMap(canvas, ctx, draw, editor.getValue())
  }

  let downloadBtn = document.getElementById('download')
  downloadBtn.onclick = function() {
    download(canvas.toDataURL('image/png'), ~~(new Date().getTime() / 1000) + '.png')
  }

  // init show
  timingMap(canvas, ctx, draw, editor.getValue())
}

function timingMap(canvas, ctx, draw, codes) {
  let list = parser.parse(codes)
  draw.calSize(list)
  canvas.setAttribute("width", draw.canvasW + "px")
  canvas.setAttribute("height", draw.canvasH + "px")
  draw.drawSignals(ctx, list) // first refresh canvas size then draw timing map
}

function download(url, name) {
  const alink = document.createElement('a')
  alink.download = name
  alink.href = url
  alink.dispatchEvent(new MouseEvent('click', {}))
}
