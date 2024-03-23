const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomusers}=require('./utils/users');
const app=express();
const server=http.createServer(app);
const io=socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname,'public')));
const botName='ChatSphere Bot';

//Run when client connects

io.on('connection',socket =>{
  socket.on('joinRoom',({username,room})=>{

  const user=userJoin(socket.id,username,room);
  socket.join(user.room);



    socket.emit('message',formatMessage(botName,'Welcome to ChatSphere!'));    
     socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

     //Send users and room info
     io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomusers(user.room)
     });


  });
    

  //Listen for chatmessage
  socket.on('chatMessage',(msg)=>{
    const user=getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg));
  });


//Runs when client disconnects
socket.on('disconnect',()=>{
  const user=userLeave(socket.id);
  if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));

    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomusers(user.room)
     });
  }

});

});
const PORT=3001 || process.env.PORT;
server.listen(PORT,() =>console.log('Server running on port ${PORT}'));
