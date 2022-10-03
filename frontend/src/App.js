import socketIOClient from "socket.io-client";
import SocketContext from "./SocketContext";

import "./App.css";
import { Sidebar } from "./Sidebar";
import { ChatWindow } from "./ChatWindow";
import {  useEffect, useState } from "react";

const ENDPOINT = "http://localhost:3001";

const socket = socketIOClient(ENDPOINT);

function makeuserName(length) {
    var result           = '';
    var characters       = 'qwertyuiopasdfghjklzxcvbnm';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


function App() {
  const [username,setUserName] = useState(makeuserName(7));
    const [messageList,setMessageList,] = useState([])
  const [myPrivateKey,setMyprivatekey] = useState("")
  const [userList,setUserList] = useState([]);
  const [selectedUser,setSelectedUser] = useState("")
  const [reciever, setReciever] = useState({})

  const newUserSignedIn = () => {
    socket.emit("newusersignedin", { username });
  };

  const getAllUsers = ()=> {
     socket.on('getallusers',users=>{
      const updated = users.filter(item=>item.username!==username)
      setUserList(updated)
     })
  }

  useEffect(() => {
    newUserSignedIn();
    getAllUsers();
    socket.on('getPrivateKey',privatekey=>{
      setMyprivatekey(privatekey)
     })
  }, []);

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <div style={{background:"#cecece",padding:"20px"}}>
        <h1 >{username}</h1>
        <h6
        style={{color:"red"}}
        >Note: No databases is being used please do not refresh page you might lost data</h6>
        </div>



        <div style={{display:"flex",margin:"5px"}}>
                  <Sidebar userList={userList} setSelectedUser={setSelectedUser} selectedUser={selectedUser} setReciever={setReciever}/>
      {selectedUser!=="" &&  <ChatWindow username={username} selectedUser={selectedUser} reciever={reciever} myPrivateKey={myPrivateKey}
      messageList={messageList} setMessageList={setMessageList}
      />}
{selectedUser==="" &&  <h3 
style={{color:"red", marginLeft:"20px",}}
>Note: Its mandatory to select the any user. to verify check the message textfeild at both the places</h3>}
        </div>

      </SocketContext.Provider>
    </div>
  );
}

export default App;
