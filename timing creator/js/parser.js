function lookBoundary(str, start) {
  for (let i = start; i < str.length; i++) {
    if (str[i] == ']') return i
  }
  return -1
}

function analyse(str) {
  let val = []
  for (let i = 0; i < str.length; i++) {
    let flag = false
    switch (str[i]) {
      case '_':
        val.push('_')
        break
      case '~':
        val.push('~')
        break
      case 'x':
        val.push('x')
        break
      case '[':
        let right = lookBoundary(str, i)
        if (right == -1) return [] // syntex error
        val.push(str.substring(i + 1, right))
        i = right
        break
      default:
        return [] // syntex error
    }
  }
  return val
}

function parse(codes) {
  codes = codes.split('\n')

  let list = []
  for (let i = 0; i < codes.length; i++) {
    let code = codes[i].replace(/\s*/g,"").split('=')
    if (code.length != 2)  continue
    let name = code[0]
    let val = analyse(code[1])
    list.push({name: name, val: val})
  }
  return list
}

export default {
  parse: parse
}