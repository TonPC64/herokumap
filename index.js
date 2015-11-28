var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(express.static('public'))

var http = require('http').Server(app)
var io = require('socket.io')(http)

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
  socket.on('shareLoc', function (data) {
    console.log(data)
    io.emit('push', data)
  })
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
