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
    const handleFocus = () => sampleRef.current && sampleRef.current.focus();

    handleFocus();

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (samples.length > 0) {
      const timerId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [counter, samples.length]);

  const addSample = () => {
    if (sample == '') return;

    const s = {
      ts: Date.now(),
      value: sample,
    };
    samples.splice(0, 0, s);
    
    setSample('');
    if (sampleRef.current) {
      sampleRef.current.focus();
    }
  };

  const getTimeRemaining = (_: Sample, i: number) => {
    if (samples.length <= 1) return; // first or no samples
    if (i >= samples.length - 1) return; // last sample
    if (samples[i + 1].ts === samples[0].ts || samples[i + 1].value === samples[0].value) return; // two in a row // TODO: should use last entry instead of first

    const timeEllapsed = samples[0].ts - samples[i + 1].ts;
    const placesEllapsed = samples[i + 1].value - samples[0].value;

    const timePerPlaces = timeEllapsed / placesEllapsed;
    return timePerPlaces * samples[i + 1].value;
  };

  const formatElapsedTime = (elapsedMilliseconds: number) => {
    if (elapsedMilliseconds == null || elapsedMilliseconds <= 0) return '00:00';
    
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (hours > 0) {
        formattedTime = String(hours).padStart(2, '0') + ':' + formattedTime;
    }

    return formattedTime;
  }

  return (
    <>
      Place in line:&nbsp;
      <input
        type="number"
        className='mx-2'
        value={sample || ''}
        onChange={(e) => setSample(+e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addSample()}
        ref={sampleRef}
      ></input>
      <button onClick={addSample}>OK</button>

      {samples.map((s, i) => (
        <div key={i}>
          {new Date(s.ts).toLocaleTimeString()}&gt;&nbsp;
          {((timeRemaining?: number) => timeRemaining != null && timeRemaining > 0 ? `${formatElapsedTime(s.ts + timeRemaining - Date.now())} wait based on ${samples[0].value}-${samples[i + 1].value}` : `Starting at ${s.value}`)(getTimeRemaining(s, i))}
        </div>
      ))}
    </>
  );
}
