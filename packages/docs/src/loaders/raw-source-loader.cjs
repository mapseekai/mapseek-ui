module.exports = function rawSourceLoader(source) {
  this.cacheable?.()
  return `export default ${JSON.stringify(source)}`
}
