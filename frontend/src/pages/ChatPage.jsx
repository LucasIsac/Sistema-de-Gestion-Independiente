import React, { useState } from "react";
import { ChatProvider } from "../context/chatContext.jsx";
import ChatBox from "../components/ChatBox";
import UserList from "../components/UserList";
import "../assets/styles/chat-page.css";

const ChatPage = ({ userId }) => {
  const [receptor, setReceptor] = useState(null);

  return (
    <ChatProvider userId={userId}>
      <div className="chat-page">
        <div className="chat-sidebar">
          
          <UserList onSelectUser={setReceptor} userId={userId} />
        </div>

        <div className="chat-content">
          {receptor ? (
            <ChatBox receptor={receptor} userId={userId} />
          ) : (
            <div className="chat-placeholder">
              <h3>💬 Comienza a chatear</h3>
              <p>Seleccioná un usuario de la lista para iniciar una conversación</p>
            </div>
          )}
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
