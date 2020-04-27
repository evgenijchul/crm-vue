module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue/'
    : '/'
  ,
  outputDir: "vue",
  transpileDependencies: [
    "vuetify"
  ], 
}