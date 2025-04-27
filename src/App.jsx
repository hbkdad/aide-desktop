import { useState } from "react"
import ChatMessage from "./ChatMessage"
import { models } from "./modelList"
import "./index.css"

function App() {
  const [input, setInput] = useState("")
  const [chat, setChat] = useState([])
  const [model, setModel] = useState(models[0])
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    if (!input.trim()) return
    setLoading(true)

    const newChat = [...chat, { role: "user", content: input }]
    setChat(newChat)
    setInput("")

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: input, stream: true }),
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let responseText = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter(Boolean)

      for (let line of lines) {
        const json = JSON.parse(line)
        if (json.done) continue

        responseText += json.response
        setChat((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]

          if (last?.role === "ai") {
            last.content = responseText
          } else {
            updated.push({ role: "ai", content: responseText })
          }

          return [...updated]
        })
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-green-400">🧠 AIDE Desktop</h1>

      {/* Model selector */}
      <div className="mb-4">
        <label className="mr-2">🤖 Model:</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-zinc-800 text-white border p-2 rounded"
        >
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Chat log */}
      <div className="max-h-[60vh] overflow-y-auto mb-4">
        {chat.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
        {loading && <p className="text-yellow-400 animate-pulse">Streaming...</p>}
      </div>

      {/* Input + Button */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-zinc-800 text-white border border-zinc-700"
          placeholder="💬 Ask something..."
        />
        <button
          onClick={askAI}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
