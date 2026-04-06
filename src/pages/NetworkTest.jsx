import { useState } from 'react'

const NetworkTest = () => {
  const [testResults, setTestResults] = useState('')
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    let results = ''

    // Test 1: Health check
    results += '🧪 TEST 1: Health Check\n'
    results += '========================\n'
    try {
      const res = await fetch('https://securerag-backend-new.onrender.com/health')
      results += `Status: ${res.status}\n`
      const data = await res.json()
      results += `Response: ${JSON.stringify(data, null, 2)}\n`
      results += '✅ Backend is responding\n\n'
    } catch (e) {
      results += `❌ Error: ${e.message}\n\n`
    }

    // Test 2: Signup with password that should fail
    results += '🧪 TEST 2: Signup with Password\n'
    results += '================================\n'
    try {
      const res = await fetch('https://securerag-backend-new.onrender.com/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: 'Test User',
          email: 'test123@example.com',
          password: 'SecurePass123'
        })
      })
      results += `Status: ${res.status}\n`
      const data = await res.json()
      results += `Response:\n${JSON.stringify(data, null, 2)}\n`

      if (res.ok) {
        results += '✅ Signup succeeded!\n\n'
      } else {
        results += '❌ Signup failed\n\n'
      }
    } catch (e) {
      results += `❌ Error: ${e.message}\n\n`
    }

    // Test 3: Check environment
    results += '🧪 TEST 3: Frontend Environment\n'
    results += '================================\n'
    results += `API URL: ${import.meta.env.VITE_API_URL || 'NOT SET'}\n`
    results += `Mode: ${import.meta.env.MODE}\n`
    results += `Base URL: ${import.meta.env.BASE_URL}\n\n`

    setTestResults(results)
    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>🔧 Network Diagnostic Test</h1>

      <button
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#1a5c6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
      </button>

      {testResults && (
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '12px',
            lineHeight: '1.6',
            maxHeight: '600px',
            overflow: 'auto',
          }}
        >
          {testResults}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h3>What this tests:</h3>
        <ul>
          <li>✓ Backend is running and responding</li>
          <li>✓ API endpoint is accessible</li>
          <li>✓ Signup endpoint works</li>
          <li>✓ Backend error messages</li>
          <li>✓ Frontend environment variables</li>
        </ul>
      </div>
    </div>
  )
}

export default NetworkTest
