import fs from 'fs'
import path from 'path'
import https from 'https'
import express from 'express'
import swig from 'swig'

const app = express()

app.use(function(req, res, next){
  let { protocol, headers } = req
  let { origin, host } = headers
  let allowOrigin = origin || `${protocol}://${host}`
  if(!(/^http/.test(protocol))){
    allowOrigin = '*'
  }
  res.set({
    // * 为允许任何域访问
    // 如果只允许某个域名 请设置单独的域名
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'text/html; charset=utf-8',
  });
  if(req.method == 'OPTIONS'){
    return res.send()
  }
  next()
})

// 静态文件服务
app.use(express.static('./static'))

app.all('*', function(req, res){
  res.status(404)
  res.send('404')
})

let http = https.createServer({
  'key': fs.readFileSync('./ssl/private.key', 'utf8'),
  'cert': fs.readFileSync('./ssl/ifprint.crt', 'utf8'),
}, app)

const server = http.listen(443, '127.0.0.1', function(){
  let { address, port } = server.address()
  if(address == '0.0.0.0'){
    address = '127.0.0.1'
  }
  console.log('http://%s:%s', address, port)
})
