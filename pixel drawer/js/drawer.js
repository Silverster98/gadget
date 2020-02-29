import Pixel from './pixel'

const BG_COLOR_WHITE = '#FAFAFA'
const BG_COLOR_GRAY = '#B8B8B8'

const pixel = new Pixel()

export default class Drawer {
  constructor(size, ratio) {
    this.init(size, ratio)
  }

  init(size, ratio) {
    this.size = size
    this.ratio = ratio

    this.op = []
    this.once = []
  }

  /**
   * 一次操作完成
   */
  onceDone() {
    if (this.once.length != 0) {
      this.op.push(this.once)
      this.once = []
    }
  }

  /**
   * 绘制一次操作中的一个像素块
   */
  drawPixels2(ctx, p) {
    let flag = true
    for (let i = 0; i < this.once.length; i++) {
      if (pixel.equalTwoPos(this.once[i], p)) {
        flag = false
        break
      }
    }
    if (flag) {
      this.once.push(p)
      this._drawPixel(ctx, p.x, p.y, p.color)
    }
  }

  /**
   * 绘制单个像素块
   */
  _drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * this.ratio, y * this.ratio, this.ratio, this.ratio)
  }

  /**
   * 绘制背景灰白交替方格
   */
  drawBG(ctx) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if ((i + j) % 2 == 0) this._drawPixel(ctx, j, i, BG_COLOR_WHITE)
        else this._drawPixel(ctx, j, i, BG_COLOR_GRAY)
      }
    }
  }

  /**
   * 重画
   */
  redraw(ctx) {
    this.init(this.size, this.ratio)

    this.drawBG(ctx)
  }

  /**
   * 重新设定画布大小，原有的绘画记录不再保存
   */
  resize(ctx, size) {
    this.init(size, this.ratio)

    this.drawBG(ctx)
  }

  /**
   * 撤销上一步
   */
  cancel(ctx) {
    if (this.op.length == 0) return
    
    let last = this.op.pop()

    for (let op of last) {
      let hit = ''
      // 查找该像素位置之前的颜色，应该从后往前找
      for (let i = this.op.length - 1; i >= 0; i--) {
        for (let j = this.op[i].length - 1; j >= 0; j--) {
          if (pixel.equalTwoPos(op, this.op[i][j])) {
            hit = this.op[i][j].color
            break
          }
        }
        if (hit != '') break
      }

      let color = hit != '' ? hit : (op.x + op.y) % 2 == 0 ? BG_COLOR_WHITE : BG_COLOR_GRAY

      this._drawPixel(ctx, op.x, op.y, color)
    }
  }
}