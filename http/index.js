const koa = require('koa')
const static = require('koa-static')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')
const path = require('path')
var helmet = require('koa-helmet')

const app = new koa()

app.use(helmet())
// app.use(async (ctx, next) => {
//   ctx.set({
//     'Cache-Control': 'max-age=5000' 
//   })
//   await next()
// })

// app.disable('x-powered-by')
app.use(etag())
app.use(conditional())
app.use(static(path.join(__dirname, './')))
app.use((ctx, next) => {
  // ctx.status = 302
  // ctx.redirect('/index.js')
  next()
})

app.listen(4000)