import React, { useEffect, useState, useRef } from 'react';

type Sample = {
  ts: number;
  value: number;
}

export default function Home() {
  const [counter, setCounter] = useState(0);

  const [sample, setSample] = useState<'' | number>('');
  const [samples] = useState<Sample[]>([]);
  const [startSample, setStartSample] = useState<undefined | Sample>();

  const sampleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startSample != null) {
      const timerId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [counter, sample, startSample]);

  const addSample = () => {
    if (sample == '') return;

    const s = {
      ts: Date.now(),
      value: sample,
    };
    samples.push(s);
    if (startSample == null) {
      setStartSample(s);
    }
    
    setSample('');
    if (sampleRef.current) {
      sampleRef.current.focus();
    }
  };

  const projectTime = (s: Sample) => {
    if (startSample == null || s.ts === startSample.ts || s.value === startSample.value) return;

    const timeEllapsed = s.ts - startSample.ts;
    const placesEllapsed = startSample.value - s.value;

    const timePerPlaces = timeEllapsed / placesEllapsed;
    const timeRemaining = timePerPlaces * s.value;

    return new Date(Date.now() + timeRemaining);
  };
  
  return (
    <>
      Place in line:
      <input
        type="number"
        className='mx-2'
        value={sample}
        onChange={(e) => setSample(+e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addSample()}
        ref={sampleRef}
      ></input>
      <button onClick={addSample}>OK</button>

      {samples.toReversed().map((s, i) => (
        <div key={i}>
          {new Date(s.ts).toLocaleTimeString()}&gt; {s.value} : {projectTime(s)?.toLocaleTimeString() ?? 'n/a'}
        </div>
      ))}
    </>
  );
}
