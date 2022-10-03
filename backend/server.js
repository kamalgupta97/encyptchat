const express = require('express')
const http =require('http')
const cors = require('cors')
const app = express()
const server = http.createServer();
const EncryptRsa = require('encrypt-rsa').default;

var users =[];

function formateMessage(username,text){
    return {
        username,text,time:Date.now()
    }
}

function newUserSignIn(socketId,username,publicKey){
    const user ={socketId,username,publicKey}
    users.push(user);

    return user;
}


const socketio = require('socket.io')

const io = socketio(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

require('./routes')(app)


io.on('connection',(socket)=>{
      const encryptRsa = new EncryptRsa();
     const { privateKey, publicKey } = encryptRsa.createPrivateAndPublicKeys();
    socket.emit('getallusers',users)
    socket.emit('getPrivateKey',privateKey)
    socket.on('newusersignedin',({username})=>{
    newUserSignIn(socket.id,username,publicKey)
    socket.broadcast.emit("getallusers",users)
    })
    


    socket.on('send-message',({message,username,reciever})=>{
         socket.broadcast.to(reciever.socketId,).emit('get-message',
           {sockedId:socket.id,...formateMessage(username,message)})
    })

    socket.on("disconnect",()=>{
        const user = users.find(item=>item.socketId===socket.id)
        users = users.filter(item=>item.socketId!==socket.id)
        socket.broadcast.emit("getallusers",users)
        console.log(user?.username,"disconnected")
    })

})

const PORT = 3001;

server.listen(PORT,()=>{
    console.log("Listing on port 3001")
})