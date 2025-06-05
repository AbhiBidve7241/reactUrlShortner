import React, { useState } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const shortenUrl = async () => {
    try {
      setError('');
      setCopied(false);
      const response = await axios.get(
        `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(longUrl)}`
      );
      const shortLink = response.data.result.full_short_link;
      setShortUrl(shortLink);
      setUrlList([{ long: longUrl, short: shortLink }, ...urlList]);
      setLongUrl('');
    } catch (err) {
      setError('Invalid URL or API error. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <div>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter long URL"
        />
        <button onClick={shortenUrl}>Shorten</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shortUrl && (
        <div className="shortened-url">
          <p>Shortened URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <CopyToClipboard text={shortUrl} onCopy={() => setCopied(true)}>
            <button>{copied ? 'Copied!' : 'Copy to Clipboard'}</button>
          </CopyToClipboard>
        </div>
      )}
      {urlList.length > 0 && (
        <div className="url-list">
          <h3>Previous URLs</h3>
          {urlList.map((url, index) => (
            <div key={index} className="url-item">
              <div>
                <p><strong>Original:</strong> <a href={url.long} target="_blank" rel="noopener noreferrer">{url.long}</a></p>
                <p><strong>Shortened:</strong> <a href={url.short} target="_blank" rel="noopener noreferrer">{url.short}</a></p>
              </div>
              <CopyToClipboard text={url.short} onCopy={() => setCopied(true)}>
                <button>{copied ? 'Copied!' : 'Copy'}</button>
              </CopyToClipboard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;