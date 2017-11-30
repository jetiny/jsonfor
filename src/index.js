// 解析JSON并转换为js和php可直接解析

class JsonFor {
  constructor (format, opts) {
    this.format = format
    this.opts = Object.assign({
    }, opts)
    this.dicts = {}
  }
  transform (json) {
    if (typeof json === 'string') {
      json = JSON.parse(json)
    }
    let ref = {
      type: getType(json)
    }
    if (ref.type) {
      this.parse(json, ref)
      this.processDict()
      console.log(this.dicts, ref)
      return this.stringify(ref)
    } else {
      return JSON.stringify(json)
    }
  }
  parse (json, ref) {
    if (ref.type === TYPE_ARRAY) {
      ref.sub = []
      for (let val of json) {
        let newType = getType(val)
        if (newType) {
          let newRef = {
            type: newType
          }
          ref.sub.push(newRef)
          this.parse(val, newRef)
        }
      }
    } else if (ref.type === TYPE_OBJECT) {
      ref.sub = []
      for (let name in json) {
        let val = json[name]
        let newType = getType(val)
        if (newType) {
          let newRef = {
            type: newType,
            key: this.getDict(name)
          }
          ref.sub.push(newRef)
          this.parse(val, newRef)
        }
      }
    } else {
      ref.value = this.getDict(json)
    }
  }
  stringify (ref) {
    
  }
  getDict (value) {
    let dict = this.dicts[value]
    if (!dict) {
      dict = this.dicts[value] = {
        num: 0,
        // type: getType(value),
        value
      }
    }
    dict.num++
    return dict
  }
  processDict () {
    let arr = Object.values(this.dicts).sort((a, b) => a.num - b.num)
    arr.forEach((it, id) => {
      it.key = baseNum(id)
    })
    // for (let [id, it] of arr) {
    //   it.key = baseNum(id)
    // }
  }
}

// https://github.com/mishoo/UglifyJS/blob/master/lib/process.js
// @NOTE _$是不是要移除掉 有什么语言是不区分大小写的, 如 go 首字母大写会有影响
// const digits = "etnrisouaflchpdvmgybwESxTNCkLAOMDPHBjFIqRUzWXVJKQGYZ_$0516372984"
// const digits = "xkjzqetnrisouaflchpdvmgybwESTNCLAOMDPHBFIRUWXVJKQGYZ_$0516372984"
const digits = "xkjzqetnrisouaflchpdvmgybw0516372984"
const digitSize = digits.length
const baseSize = digitSize - 10
function baseNum (num) {
  let base = baseSize
  let ret = ""
  do {
    ret += digits.charAt(num % base)
    num = Math.floor(num / base)
    base = digitSize
  } while (num > 0)
  return ret
}

function createKeyDict (num) {
  let arr = []
  let val
  for (let id = 0; id < num; ++id) {
    // a-z 97-122 a0-zz a00-zzz ...
    arr.push(val)
  }
}

const TYPE_NONE = 0
const TYPE_ARRAY = 1
const TYPE_OBJECT = 2
const TYPE_STRING = 3
const TYPE_NUMBER = 4
const TYPE_BOOLEAN = 5
const TYPE_NULL = 6

function toStringType (val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

const isArray = Array.isArray

function isObject (arg) {
  return (toStringType(arg) === 'Object') && (arg !== null)
}

function getType (arg) {
  let type = typeof arg
  switch (type) {
    case 'string':
      return TYPE_STRING
    case 'boolean':
      return TYPE_BOOLEAN
    case 'number':
      return isNaN(arg) ? TYPE_NONE : TYPE_NUMBER
    case 'object':
      if (arg === null) {
        return TYPE_NULL
      } else if (isArray(arg)) {
        return TYPE_ARRAY
      } else if (toStringType(arg) === 'Object') {
        return TYPE_OBJECT
      }
  }
}

exports.jsonForJs = (json, opts) => {
  return new JsonFor('js', opts).transform(json)
}

exports.jsonForPhp = (json, opts) => {
  return new JsonFor('php', opts).transform(json)
}

exports.JsonFor = JsonFor

const {testJs} = require('./tester.js')
testJs(exports.jsonForJs, ['aaa', 'bbb', 'ccc'])
