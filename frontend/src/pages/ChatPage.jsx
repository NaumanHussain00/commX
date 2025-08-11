// pages/ChatPage.js
import React from "react";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import ProfileCard from "../components/ProfileCard";
import { useSelector } from "react-redux";

const ChatPage = () => {

    const userData =useSelector((store)=> store.user);

  return (
    <div className="h-[100vh] pt-24 w-full p-4 bg-[url('/bg-pattern.png')] bg-cover bg-center flex gap-2 ">
      <ChatList />
      <ChatBox />
      {userData &&
      <ProfileCard user={userData} />}
    </div>
  );
};

export default ChatPage;
