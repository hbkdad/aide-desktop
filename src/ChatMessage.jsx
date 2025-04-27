// ✅ src/ChatMessage.jsx
export default function ChatMessage({ role, content }) {
  return (
    <div className={`p-3 my-2 rounded-md ${role === 'user' ? 'bg-zinc-700 text-green-300' : 'bg-zinc-800 text-blue-300'}`}>
      <strong>{role === "user" ? "🧑 You" : "🤖 AI"}:</strong>
      <p className="mt-1 whitespace-pre-wrap">{content}</p>
    </div>
  )
}
