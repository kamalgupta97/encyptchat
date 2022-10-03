import React, { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "./SocketContext";
import EncryptRsa from 'encrypt-rsa';

function formateMessage(username,text){
    return {
        username,text,time:Date.now()
    }
}



export const ChatWindow = ({ username,selectedUser,reciever,myPrivateKey,messageList,setMessageList }) => {
  const encryptRsa = new EncryptRsa();
  const socket = useContext(SocketContext)
  const [myMessage,setmyMessage] = useState("");
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    console.log("scrollToBottom")
    const element = messagesEndRef.current;
    element.scroll({ top: element.clientHeight + element.scrollHeight, left: 0 });
  };

  

  const handleSend = () => {
    const sentMessage = formateMessage(username,myMessage)
    const newMessage = messageList
    const finalMessage = newMessage.concat(sentMessage)
    setMessageList(finalMessage);

    const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({ 
      text: myMessage,   
      publicKey:reciever.publicKey,
    });
    socket.emit("send-message", { message:encryptedText,username,reciever });
    setmyMessage("")
  }
  useEffect(()=>{
     socket.on('get-message',message=>{
       const decryptedText = encryptRsa.decryptStringWithRsaPrivateKey({ 
         text: message.text, 
         privateKey:myPrivateKey
     
});
    const recievedMessage = formateMessage(message.username,decryptedText)

    console.log(messageList);

    const newMessage = messageList
        const finalMessage = newMessage.concat(recievedMessage)
        setMessageList(finalMessage)
     })
  })

  useEffect(()=>{
    scrollToBottom();
  },[messageList])
  return (
    <div style={{
        marginLeft:"20px",
         width:"50%",
      }}>
        <div style={{ height:"40vh",
        width:"100%",
        overflow:"scroll",
        position:"relative"}} ref={messagesEndRef}>
          {messageList?.map((item,index)=><div 
        key={index+item.text}
      style={{
        height:"100px",
        width:"100%",
        display:"flex",
        justifyContent:`${item.username===username?"right":"left"}`,
        alignItems:"center"
      }}>
        <div style={{
           display:"flex",
            alignItems:"center",
            paddingLeft:"20px",
        height:"50%",
        width:"40%",
        borderRadius:"0px 20px",
        background:`${item.username===username?"green":"grey"}`,
        color:"white",
      }}>
        {item.text}
      </div>

      </div>)}

        </div>
      

   <div>
       <input 
      style={{
        border:"none",
        width:"92%",
        height:"50px",
        outline:"none",
        fontSize:"18px"

      }}
      autoFocus
       type="text" value={myMessage} onChange={(e)=>setmyMessage(e.target.value)} placeholder="type you message here..." 
        onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}

      />
      <button
       style={{
        padding:"20px",
        borderRadius:"0px 50px 50px 10px",
        border:"none",
        height:"50px",
        outline:"none",
        fontSize:"18px",
        background:"none",

      }}
      
      onClick={handleSend}>

        <div style={{
          width: "0px",
	height: "0px",
	borderTop: "10px solid transparent",
	borderLeft: "20px solid #555",
	"borderBottom": "10px solid transparent"
        }}></div>
      </button>
   </div>

    </div>
  );
};
