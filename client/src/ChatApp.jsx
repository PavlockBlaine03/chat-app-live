import React, {useEffect, useState} from "react"
import {io} from "socket.io-client";
import "./ChatApp.css";

// connects to backend server
const socket = io("http://localhost:3001");

function ChatApp() {
    const [message, setMessage] = useState("");     // Holds what the user is typing
    const [chat, setChat] = useState([]);           // stores the chat log
    const [socketId, setSocketId] = useState("");     

    // Runs once when the component mounts
    useEffect(() => {
        // Store you socket ID
        socket.on("connect", () => {
            setSocketId(socket.id);
        });

        // listens for 'chat message' events from the server
        socket.on("chat message", (msg) => {
            // Add the new message to the chat array
            setChat((prevChat) => [...prevChat, msg]);
        });

        // cleanup when component unmounts
        return () => {
            socket.off("chat message");
            socket.off("connect");
        };
    }, []);

    // Send message to server when form is submitted
    const sendMessage = (e) => {
        e.preventDefault();     // prevent page reload
        if(message.trim()) {
            socket.emit("chat message", message); // emit message to backend
            setMessage("")  // clear input field
        }
    };

    return (
    <div className="chat-container">
      <h2 className="chat-header">Live Chat</h2>

      {/* Wait until socket is ready */}
      {!socketId ? (
        <p>Connecting...</p>
      ) : (
        <>
          <ul className="chat-messages">
            {chat.map((msg, idx) => (
              <li
                key={idx}
                className={`message ${msg.from === socketId ? "me" : "other"}`}
              >
                <span className="sender" style={{ color: msg.color }}>
                  {msg.from === socketId ? "You" : msg.sender}:
                </span>{" "}
                {msg.text}
              </li>
            ))}
          </ul>
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}
export default ChatApp;