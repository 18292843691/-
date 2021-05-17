const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

app.use(router.routes())

router.post('/cors', (ctx) => {
  console.log('request', ctx)
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET, PUT, POST');
  ctx.set('Access-Control-Allow-Headers', '*');

  ctx.res.statusCode = 200
  ctx.body = {
    success: 1
  }
})

app.listen(9000, () => {
  console.log('success')
})