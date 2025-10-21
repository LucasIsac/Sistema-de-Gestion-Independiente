import React, { useState } from "react";
import { ChatProvider } from "../context/chatContext.jsx";
import ChatBox from "../components/ChatBox";
import UserList from "../components/UserList";

const ChatPage = ({ userId }) => {
  const [receptor, setReceptor] = useState(null);

  return (
    <ChatProvider userId={userId}>
      <div className="flex gap-4 p-4 bg-gray-100 min-h-screen">
        <UserList onSelectUser={setReceptor} userId={userId} />
        {receptor ? (
          <ChatBox receptor={receptor} userId={userId} />
        ) : (
          <p className="text-gray-600 m-auto">
            Seleccioná un usuario para comenzar a chatear
          </p>
        )}
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
