import React from 'react';
import ImageSequence360 from './components/ImageSequence360';

export default function App() {
  return (
    <div className="portfolio-app" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ImageSequence360 />
    </div>
  );
}
