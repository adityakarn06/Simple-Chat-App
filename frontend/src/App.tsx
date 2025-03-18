import { useEffect, useRef, useState } from "react"

function App() {
  const [messages, setMessages] = useState(["hii", "hello"]);
  const wsRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (e) => {
      setMessages(m => [...m, e.data]);
    }
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
        roomId: "1"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, [])

  const sendmsg = () => {
    const inputMsg = inputRef.current?.value;
    const msg = JSON.stringify({
      type: "chat",
      payload: {
        message: inputMsg
      }
    })
    wsRef.current.send(msg);
  }

  return (
    <div className="h-screen bg-black flex flex-col pt-8">
      <div className="h-[95vh]">
        {messages.map(message => <div className="m-8">
          <span className="bg-white text-black rounded p-4 m-8">
            {message}
          </span>
        </div>)}
      </div>
      <div className="w-full bg-white flex">
        <input ref={inputRef} className="flex-1 p-4" type="text" placeholder="Enter your message" />
        <button onClick={sendmsg} className="bg-purple-600 p-4">Send message</button>
      </div>
    </div>
  )
}

export default App
