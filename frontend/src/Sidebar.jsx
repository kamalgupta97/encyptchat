import React from "react";

export const Sidebar = ({ userList,selectedUser,setSelectedUser,setReciever }) => {
  return (
    <div
      style={{
        width: "300px",
        height: "80vh",
        overflowY: "scroll",
      }}
    >
      {userList?.map((item,index) => (
        <div
        key={index+item.username}
        style={{
        width: "100%",
        height: "70px",
        background:`${item.username===selectedUser?"green":"grey"}`,
        color:"white",
        display:"flex",
        alignItems:"center",
        paddingLeft:"30px",
      }}
      onClick={()=>{
        setReciever(item)
        setSelectedUser(item.username)
      }}>{item.username}</div>
      ))}
    </div>
  );
};
