
const HALF = 12
const PART = [6, 30, 6]
let SUM = [0]
for (let i = 0; i < PART.length; i++) {
  SUM.push(SUM[i] + PART[i])
}
const HALF_CYCLE = PART.reduce((sum, num) => {return sum + num})
const FONT_SIZE = 18

export default class Drawer {
  constructor() {
    this.canvasH = 0
    this.canvasW = 0
    this.maxL = 0
  }

  /**
   * test
   * @param {*} ctx 
   */
  test(ctx) {
    // let signals = [{name: 'clk', val: ['_', '~', '_', '~']}, {name: 'rdata', val: ['x', 'x', '', '']}]
    // this.drawSignals(ctx, signals)
    this.drawCycle(ctx, {x:25,y:25}, '__n')
    this.drawCycle(ctx, {x:25 + HALF_CYCLE,y:25}, 'm==')
  }

  /**
   * calculate the size of canvas needed to draw timing map
   * @param {*} signals signals converted from code
   */
  calSize(signals) {
    if (signals == null) return {height: 150, width: 300}

    let maxL = signals[0].name.length
    for (let i = 0; i < signals.length; i++) {
      maxL =Math.max(maxL, signals[i].name.length)
    }
    this.maxL = maxL + 1

    this.canvasH = signals.length * HALF * 3 + HALF
    this.canvasW = this.maxL * FONT_SIZE / 2 + HALF + HALF_CYCLE * signals[0].val.length + HALF
  }

  /**
   * draw all signals
   * @param {*} ctx context
   * @param {*} signals signals converted from code
   */
  drawSignals(ctx, signals) {
    if (signals.length == 0) return
    
    let sx = this.maxL * FONT_SIZE / 2 + HALF
    let sy = 2 * HALF

    for (let i = 0; i < signals.length; i++) {
      this.drawSignal(ctx, {x: sx, y: sy + i * 3 * HALF}, signals[i])
    }
  }

  /**
   * draw a signal in a row
   * @param {*} ctx context
   * @param {*} pos position of a signal
   * @param {*} single signal = {name: 'xx', val: 'xx'}
   */
  drawSignal(ctx, pos, single) {
    ctx.font = FONT_SIZE + 'px sans-serif'
    ctx.fillText(single.name, HALF, pos.y + FONT_SIZE / 3)

    for (let i = 0; i < single.val.length; i++) {
      let style = ''
      
      switch (single.val[i]) {
        case '_':
          if (i == 0 || single.val[i - 1] == '_') style = '_'
          else if (single.val[i - 1] == 'x') style = 'x'
          else style = '\\'
          style += '_'
          if (i == single.val.length - 1 || single.val[i + 1] == '_') style += '_'
          else if (single.val[i + 1] == 'x') style += 'n'
          else style += '/'
          break
        case '~':
          if (i == 0 || single.val[i - 1] == '~') style = '~'
          else if (single.val[i - 1] == 'x') style = 'w'
          else style = '/'
          style += '~'
          if (i == single.val.length - 1 || single.val[i + 1] == '~') style += '~'
          else if (single.val[i + 1] == 'x') style += 'o'
          else style += '\\'
          break
        case 'x':
          if (i == 0 || single.val[i - 1] == 'x') style = '='
          else if (single.val[i - 1] == '~') style = 'p'
          else if (single.val[i - 1] == '_') style = 'm'
          else style = '<'
          style += '='
          if (i == single.val.length - 1 || single.val[i + 1] == 'x') style += '='
          else if (single.val[i + 1] == '~') style += 'q'
          else if (single.val[i + 1] == '_') style += 'z'
          else style += '>'
          break
        default:
          if (i == 0 || single.val[i - 1] == single.val[i]) style = '='
          else style = '<'
          style += '='
          if (i == single.val.length - 1 || single.val[i + 1] == single.val[i]) style += '='
          else style += '>'
      }

      this.drawCycle(ctx, {x: pos.x + HALF_CYCLE * i, y: pos.y}, style)
    }
  }

  /**
   * draw single in a cycle, ss.length must be 3
   * @param {*} ctx context
   * @param {*} pos position of a cycle start point
   * @param {*} ss style string consist of character _~<>/\=
   */
  drawCycle(ctx, pos, ss) {
    for (let i = 0; i < ss.length; i++) {
      this.drawPart(ctx, pos, ss[i], i + 1)
    }
  }

  /**
   * draw a part of single in a cycle
   * @param {*} ctx context 
   * @param {*} pos position of a cycle start point
   * @param {*} style the style of this part, maybe _~<>/\=
   * @param {*} part a cycle is divided into three part numbered with 1, 2, 3
   */
  drawPart(ctx, pos, style, part) {
    switch (style) {
      case '_':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y + HALF)
        break
      case '~':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y - HALF)
        break
      case '<':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y + HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y - HALF)
        break
      case '>':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y)
        break
      case '/':
        if (part == 1) this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y - HALF)
        else this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y)
        break
      case '\\':
        if (part == 1) this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y + HALF)
        else this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y)
        break
      case '=':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y + HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y - HALF)
        break
      case 'q':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y - HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y)
        break
      case 'w':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y - HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y - HALF)
        break
      case 'o':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y - HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y)
        break
      case 'p':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y - HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y + HALF)
        break
      case 'z':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y + HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y - HALF, pos.x + SUM[part], pos.y)
        break
      case 'x':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y + HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y + HALF)
        break
      case 'n':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y + HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y)
        break
      case 'm':
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y + HALF, pos.x + SUM[part], pos.y + HALF)
        this._drawLine(ctx, pos.x + SUM[part - 1], pos.y, pos.x + SUM[part], pos.y - HALF)
        break
      default: break
    }
  }

  /**
   * use ctx to draw a line
   * @param {*} ctx context
   * @param {*} sx start x
   * @param {*} sy start y
   * @param {*} tx target x
   * @param {*} ty target y
   */
  _drawLine(ctx, sx, sy, tx, ty) {
    ctx.beginPath();
    ctx.moveTo(sx, sy)
    ctx.lineTo(tx, ty)
    ctx.stroke();
  }
}