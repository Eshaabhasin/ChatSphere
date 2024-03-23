const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
const socket = io();

//GET USERNAME AND ROOM FROM URL
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


//JOIN CHATROOM
socket.emit('joinRoom',{username,room})

//GET ROOM AND USERS
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);

});

//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //Scroll down when we get a message
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message text
    const msg=e.target.elements.msg.value;
    //emit message to server
    socket.emit('chatMessage',msg);
    //Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})
//Output message to DOM
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
//add room name to DOM
function outputRoomName(room){
  roomName.innerText=room;
}
function outputUsers(users){
   userList.innerHTML=`
   ${users.map(user=>`<li>${user.username}</li>`).join('')}
   `;
}