import React, {useState, useEffect, useRef} from "react";
import MessageInput from "./MessageInput";

function MessageContainer(props) {
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef(null);

    useEffect(() => {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages]);
    
    useEffect(()=> {
        
        props.socket.on('chat-message', handleChatMessage);

        props.socket.on('user-connected', (userId, name) => {
            handleChatMessage({ type: 'user-connected', name });
        })

        props.socket.on('user-disconnected', (userId, name) => {
            handleChatMessage({ type: 'user-disconnected', name });
        });
        
        // Cleanup function to remove the event listener. If your component is unmounted 
        // or re-rendered, the event listener will still be active and may continue to
        // consume memory and CPU resources, even if it's no longer needed.
        return () => {
            props.socket.off('chat-message', handleChatMessage);
            props.socket.off('user-disconnected');
            props.socket.off('user-connected');
          }
    }, [])

    const handleChatMessage = ({ message, name, type }) => {
        if (type === 'user-disconnected') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: `${name} has disconnected.`, fromMe: false },
          ]);
        } else if (type === 'user-connected') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: `${name} has joined.`, fromMe: false },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: `${name}: ` + message, fromMe: false },
          ]);
        }
      }

    const handleSendMessage = (message) => {
        setMessages((prevMessages) => [
        ...prevMessages,
        { message: "Me: " + message, fromMe: true },
        ]);

        props.socket.emit('send-chat-message', message);
    };

    return(
        <>
          <div className={"message-container"}>
            <div ref={messagesRef} id={"messages"}>
            {messages.map((message, index) => (
              <p style={{ margin: 0 }} key={index}>
                {message.fromMe ? (
                  <strong>{"Me"}:</strong>
                ) : (
                  <strong>{message.message.substring(0, message.message.indexOf(':') + 1)}</strong>
                )}
                {message.message.substring(message.message.indexOf(':') + 1)}
              </p>
            ))}
            </div>

            <MessageInput onSubmit={handleSendMessage} />
          </div>
        </>
    );
}

export default MessageContainer;