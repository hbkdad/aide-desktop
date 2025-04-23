import { useState } from 'react'
import axios from 'axios'

function App() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const runOllama = async () => {
    try {
      const res = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3", // or any model you have installed
        prompt: input,
        stream: false
      })
      setOutput(res.data.response)
    } catch (err) {
      setOutput("❌ Error: " + err.message)
    }
  }

  return (
    <div style={{ background: '#111', color: '#0f0', minHeight: '100vh', padding: '2rem' }}>
      <h1>🧠 AIDE Desktop</h1>
      <textarea
        style={{ width: '100%', height: '100px', background: '#222', color: '#0f0', border: '1px solid #0f0' }}
        placeholder="Enter your prompt..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br /><br />
      <button onClick={runOllama} style={{ padding: '0.5rem 1rem', background: '#0f0', color: '#000' }}>
        🔍 Ask Ollama
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '2rem' }}>{output}</pre>
    </div>
  )
}

export default App
