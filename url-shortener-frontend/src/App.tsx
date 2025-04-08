import { useState } from "react";
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastShortenedInput, setLastShortenedInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setError('');
    setShortenedUrl('');
    setIsLoading(true);
    setCopied(false);

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
        setShortenedUrl(data.shortURL);
        setLastShortenedInput(originalUrl); // Store the input URL that was just shortened
      } else {
        setError('Unexpected response from server.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter your long URL here..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          disabled={isLoading}
          aria-label="URL to shorten"
        />
        <button 
          type="submit" 
          disabled={isLoading || !originalUrl.trim() || originalUrl === lastShortenedInput}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-indicator"></span>
              Shortening...
            </>
          ) : 'Shorten URL'}
        </button>
      </form>

      {shortenedUrl && (
        <div className="result" role="alert">
          <strong>Your shortened URL is ready: </strong>
          <a 
            href={shortenedUrl} 
            target="_blank" 
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open(shortenedUrl, '_blank');
            }}
          >
            {shortenedUrl}
          </a>
          <button 
            className="copy-button" 
            onClick={handleCopyClick}
            aria-label="Copy shortened URL"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}

      {error && (
        <div className="error" role="alert">
          <strong>Error: </strong>
          {error}
        </div>
      )}
    </div>
  )
}

export default App;