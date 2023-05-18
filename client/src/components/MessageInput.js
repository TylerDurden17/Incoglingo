import React, { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";

function MessageInput({ onSubmit }) {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(message.trim());
    setMessage("");
  }

  function handleChange(event) {
    setMessage(event.target.value);
  }

  const isMessageEmpty = message.trim() === "";

  return (
    <div id={"messageInputContainer"}>
      <form id={"message-form"} onSubmit={handleSubmit}>
        <input
          id={"message-input"}
          placeholder={"send message"}
          type={"text"}
          value={message}
          onChange={handleChange}>
        </input>
        <button id={"send-button"} type="submit" disabled={isMessageEmpty}>
          <BsFillSendFill/>
        </button>
      </form>
    </div>
  );
}

export default MessageInput;