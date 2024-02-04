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

        props.socket.on('user-recovered', (name) => {
          handleChatMessage({ type: 'user-recovered', name });
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
            { message: `${name} has disconnected.`, fromMe: false, sender: '' },
          ]);
        } else if (type === 'user-connected') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: `${name} has joined.`, fromMe: false, sender: '' },
          ]);
        } else if (type === 'user-recovered') {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: `${name} has reconnected.`, fromMe: false, sender: '' },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: message, fromMe: false, sender: `${name}: ` },
          ]);
        }
      }

    const handleSendMessage = (message) => {
        setMessages((prevMessages) => [
        ...prevMessages,
        { message:message, fromMe: true, sender: 'Me: ' },
        ]);

        props.socket.emit('send-chat-message', message);
    };

    return(
        <>
          <div className={"message-container"}>
            <div ref={messagesRef} id={"messages"}>
            {messages.map((message, index) => {
              const urlRegex = /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g; // Regular expression to match URLs

              let messageParts = [];
              let match;
              let lastIndex = 0;

              // Loop through all URL matches in the message — repeatedly searches for matches of the regular expression
              while ((match = urlRegex.exec(message.message)) !== null) {

                // Push the text before the URL as a span element into the messageParts array.
                /*
                  message.substring(lastIndex, match.index) extracts a portion of the message string:
                  ->It starts at the position after the last match (indicated by lastIndex).
                  ->It ends just before the start of the current match (indicated by match.index). 
                */
                //added unique keys by combining a prefix (either text_ or link_) with lastIndex for each span and a element. 
                messageParts.push(
                  <span key={`text_${lastIndex}`}>{message.message.substring(lastIndex, match.index)}</span>
                );

                // Check if the match starts with http to determine if it's a complete URL
                const isCompleteURL = match[0].startsWith('http');

                // Construct the href attribute accordingly
                const href = isCompleteURL ? match[0] : `http://${match[0]}`;

                // Push the URL as a clickable link
                messageParts.push(
                  <a key={`link_${match.index}`} href={href} target="_blank">
                    {match[0]}
                  </a>
                );

                //updates the lastIndex variable to the position after the current match
                lastIndex = urlRegex.lastIndex;
              }

              // Push the remaining text after the last URL as a span element
              messageParts.push(
                <span  key={`text_${lastIndex}`}>{message.message.substring(lastIndex)}</span>
              );

              return (
                <p style={{ margin: 0 }} key={index}>
                  <strong>{message.sender}</strong>
                  {messageParts}
                </p>
              );
            })}
            </div>

            <MessageInput onSubmit={handleSendMessage} />
          </div>
        </>
    );
}

export default MessageContainer;