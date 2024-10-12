import React, { useEffect, useState, useRef } from 'react';

type Sample = {
  ts: number;
  value: number;
}

export default function Home() {
  const [counter, setCounter] = useState(0);

  const [sample, setSample] = useState<'' | number>('');
  const [samples] = useState<Sample[]>([]);

  const sampleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (samples.length > 0) {
      const timerId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [counter, sample]);

  const addSample = () => {
    if (sample == '') return;

    const s = {
      ts: Date.now(),
      value: sample,
    };
    samples.push(s);
    
    setSample('');
    if (sampleRef.current) {
      sampleRef.current.focus();
    }
  };

  const getTimeRemaining = (s: Sample) => {
    if (samples.length <= 1 || s.ts === samples[samples.length - 1].ts || s.value === samples[samples.length - 1].value) return;

    const timeEllapsed = samples[samples.length - 1].ts - s.ts;
    const placesEllapsed = s.value - samples[samples.length - 1].value;

    const timePerPlaces = timeEllapsed / placesEllapsed;
    const timeRemaining = timePerPlaces * s.value;

    return timeRemaining;
  };

  const formatTimeRemaining = (s: Sample) => {
    const timeRemaining = getTimeRemaining(s);

    if (timeRemaining == null || isNaN(timeRemaining)) return `Last position ${s.value}`;

    return `${new Date(Date.now() + timeRemaining).toLocaleTimeString()} based on positions ${samples[samples.length - 1].value}-${s.value}`;
  };
  
  return (
    <>
      Place in line:
      <input
        type="number"
        className='mx-2'
        value={sample || ''}
        onChange={(e) => setSample(+e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addSample()}
        ref={sampleRef}
      ></input>
      <button onClick={addSample}>OK</button>

      {samples.toReversed().map((s, i) => (
        <div key={i}>
          {new Date(s.ts).toLocaleTimeString()}&gt; {formatTimeRemaining(s)}
        </div>
      ))}
    </>
  );
}
