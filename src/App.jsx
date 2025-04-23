import { useState } from "react"
import "./index.css"

const MODELS = ["llama3", "mistral", "gemma", "codellama"]

function App() {
  const [model, setModel] = useState("llama3")
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [history, setHistory] = useState([])

  const askOllama = async () => {
    setResponse("Thinking...")

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: question,
          stream: false,
        }),
      })

      const data = await res.json()
      const result = data.response

      setResponse(result)
      setHistory(prev => [...prev, { model, question, answer: result }])
    } catch (err) {
      setResponse(`❌ Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-lime-400">🧠 AIDE Desktop</h1>

      <div className="mb-4">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-2 rounded bg-zinc-800 border border-zinc-700 text-white mb-4"
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700 mb-4"
        placeholder="💬 Ask your AI assistant..."
      />

      <button
        onClick={askOllama}
        className="bg-lime-500 hover:bg-lime-600 text-black font-bold px-4 py-2 rounded"
      >
        Ask
      </button>

      <div className="mt-6">
        {response && (
          <pre className="bg-black text-green-400 p-4 rounded whitespace-pre-wrap">{response}</pre>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl text-lime-300 mb-2">Chat History</h2>
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="bg-zinc-800 p-3 rounded">
                <strong className="text-lime-400">{h.model}:</strong> <span>{h.question}</span>
                <pre className="text-green-300 mt-2 whitespace-pre-wrap">{h.answer}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
