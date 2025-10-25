import { useState } from 'react';
import './App.css'; 

function App() {
  const STATIC_SUBTITLE = "Your personal AI assistant for jokes, motivation, and daily tips";

  const [content, setContent] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null); 

  const fetchContent = async (feature) => {
    if (isLoading) return; // guard against concurrent calls
    setActiveFeature(feature);
    setIsLoading(true); 
    setContent('Thinking...'); 

    try {
      const response = await fetch(`/api/${feature}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setContent(data.content); 
      } else {
        setContent(`Error: ${data.error || 'Failed to fetch content.'}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setContent('Network Error: Could not reach the Express server.');
    } finally {
      setIsLoading(false); 
    }
  };

  const Card = ({ title, description, feature, colorClass }) => (
    <div className={`card ${colorClass}`} onClick={() => !isLoading && fetchContent(feature)}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button 
        onClick={(e) => { e.stopPropagation(); fetchContent(feature); }}
        disabled={isLoading || (activeFeature === feature && isLoading)}
      >
        {isLoading && activeFeature === feature ? 'Loading...' : `Get ${title.replace('Boost', '').trim()}`}
      </button>
    </div>
  );

  return (
    <div className="container">
      <h1 className="main-title">Gemini-AI-Helper 🚀</h1>
      
      {/* Static Subtitle (Fixed placement) */}
      <p className="static-subtitle">{STATIC_SUBTITLE}</p>

      {/* Card Grid */}
      <div className="card-grid">
        <Card 
          title="Daily Joke" 
          description="Get a laugh with AI-generated humor" 
          feature="joke" 
          colorClass="joke"
        />
        <Card 
          title="Motivation Boost" 
          description="Get inspired with powerful quotes" 
          feature="motivation" 
          colorClass="motivation"
        />
        <Card 
          title="Tip of the Day" 
          description="Discover helpful life tips" 
          feature="tip-of-the-day" 
          colorClass="tip"
        />
      </div>

      {/* Dynamic Content Display Container (contains read-only textarea + clear button) */}
      <div className="content-display-container">
        <div className="content-display">
          {/* Read-only textarea shows generated content only; no typing */}
          <div className="textarea-container">
            <textarea
              className="content-textarea"
              value={content}
              readOnly
              placeholder="Click a card to generate new content from Gemini."
              rows={4}
            />
            <button
              className="clear-btn"
              onClick={() => setContent('')}
              disabled={!content}
              aria-label="Clear content"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;