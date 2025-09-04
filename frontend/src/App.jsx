import React, { useState, useEffect } from 'react'
import SubwayMap from './components/SubwayMap'
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
      <div className="map-section">
        <SubwayMap />
      </div>
    </div>
  )
}

export default App
