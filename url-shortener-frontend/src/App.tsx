import { useState } from "react";
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE

function App(){
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortenedUrl('');
    
    try {
      const response = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longURL: originalUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Server error')
      }

      const data = await response.json();
      if (data && data.shortURL) {
        setShortenedUrl(data.shortURL)
      } else {
        setError('Unexpected response from server.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  return (
    <div className="container">
      <h1>🧩 URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {shortenedUrl && (
        <div className="result">
          <strong>Short URL: </strong>
          <a href={shortenedUrl} target="_blank" rel="noreferrer">
            {shortenedUrl}
          </a>  
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Error: </strong>
          {error}
        </div>
      )}
    </div>
  )
} 

export default App;