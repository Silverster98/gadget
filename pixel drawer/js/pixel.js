export default class Pixel {
  constructor() {}

  create(x, y, color) {
    return {
      x: x,
      y: y,
      color: color // color is a string, such as '#FFFFFF'
    }
  }

  equalTwo(a, b) {
    if (a.x == b.x && a.y == b.y && a.color == b.color) return true
    else return false
  }

  equalTwoPos(a, b) {
    if (a.x == b.x && a.y == b.y) return true
    else return false
  }
}