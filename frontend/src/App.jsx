import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendMessage, setBackendMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchFromBackend = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hello')
      const data = await response.json()
      setBackendMessage(data.message)
    } catch (error) {
      setBackendMessage('Error connecting to backend')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFromBackend()
  }, [])

  return (
    <div className="app">
      <h1>Hello World! 🚀</h1>
      <p>Welcome to your React + Node.js + Bun application</p>
      
      <div className="backend-section">
        <h2>Backend Connection</h2>
        <p>Message from backend: <strong>{backendMessage}</strong></p>
        <button onClick={fetchFromBackend} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh from Backend'}
        </button>
      </div>
      
      <div className="info">
        <h3>Tech Stack:</h3>
        <ul>
          <li>Frontend: React with Vite</li>
          <li>Backend: Node.js with Express</li>
          <li>Package Manager: Bun</li>
        </ul>
      </div>
    </div>
  )
}

export default App
