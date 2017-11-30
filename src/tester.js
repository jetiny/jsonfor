const Module = require('module')

function requireFromString (code, filename, opts) {
  if (typeof filename === 'object') {
    opts = filename
    filename = undefined
  }
  opts = opts || {}
  filename = filename || ''
  opts.appendPaths = opts.appendPaths || []
  opts.prependPaths = opts.prependPaths || []
  if (typeof code !== 'string') {
    throw new Error('code must be a string, not ' + typeof code)
  }
  let paths = Module._nodeModulePaths(path.dirname(filename))
  let m = new Module(filename, module)
  m.filename = filename
  m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths)
  m._compile(code, filename)
  return m.exports
}

exports.testJs = (method, json, opts) => {
  let tar = JSON.stringify(requireFromString(method(json, opts), 'test.js'), null, 2)
  let src = JSON.stringify(json, null, 2)
  if (tar !== src) {
    console.log(tar)
    console.log()
    console.log('fail')
    // throw new Error(tar)
  } else {
    console.log('pass')
  }
}
