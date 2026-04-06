import { useState } from 'react'
import { healthCheck, ping } from '../services/authService'

const Debug = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    const newResults = {}

    // Test 1: Health check on live backend
    try {
      const res = await healthCheck()
      newResults.healthCheck = { status: 'success', data: res }
    } catch (err) {
      newResults.healthCheck = { status: 'error', error: err.message }
    }

    // Test 2: Ping endpoint
    try {
      const res = await ping()
      newResults.ping = { status: 'success', data: res }
    } catch (err) {
      newResults.ping = { status: 'error', error: err.message }
    }

    // Test 3: Check CORS by making a preflight request
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://securerag-backend-new.onrender.com/api/v1'}/auth/signup`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
        },
      })
      newResults.corsCheck = {
        status: 'success',
        headers: Object.fromEntries(res.headers.entries())
      }
    } catch (err) {
      newResults.corsCheck = { status: 'error', error: err.message }
    }

    // Test 4: Check environment variables
    newResults.env = {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      MODE: import.meta.env.MODE,
      BASE_URL: import.meta.env.BASE_URL,
    }

    setResults(newResults)
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔧 Debug Console</h1>

      <button
        onClick={testAPI}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1a5c6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Testing...' : 'Run Diagnostics'}
      </button>

      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
        <pre style={{ overflow: 'auto' }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h3>What to check:</h3>
        <ul>
          <li>✓ healthCheck: Should return {`{"status": "ok", ...}`}</li>
          <li>✓ ping: Should return {`{"message": "pong"}`}</li>
          <li>✓ corsCheck: Should have CORS headers</li>
          <li>✓ env: VITE_API_URL should match your backend</li>
        </ul>
        <p>Open DevTools (F12) → Network tab to see actual API calls</p>
      </div>
    </div>
  )
}

export default Debug
