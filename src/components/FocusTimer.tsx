import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { AppState, ForestSession, TreeStage } from '../lib/types';
import { addForestSession } from '../lib/storage';
import TreeGrowth from './TreeGrowth';

type Props = {
  state: AppState;
  setState: (updater: (s: AppState) => AppState) => void;
};

function stageForProgress(p: number): TreeStage {
  if (p <= 0.05) return 'seed';
  if (p <= 0.25) return 'sprout';
  if (p <= 0.5) return 'plant';
  if (p <= 0.85) return 'small';
  return 'full';
}

export default function FocusTimer({ state, setState }: Props) {
  const totalSeconds = useMemo(() => state.preferences.focusMinutes * 60, [state.preferences.focusMinutes]);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          const session: ForestSession = {
            id: crypto.randomUUID(),
            sessionLength: state.preferences.focusMinutes,
            completed: true,
            treeStage: 'full',
            timestamp: new Date().toISOString(),
            pointsEarned: 10,
          };
          setState(st => addForestSession(st, session));
          toast.success('🎉 Focus session completed! +10 points! 🌳');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, setState, state.preferences.focusMinutes]);

  function start() {
    setSecondsLeft(totalSeconds);
    setRunning(true);
    toast.info('🌱 Focus session started! Your tree is growing...');
  }

  function pause() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    toast.info('⏸️ Session paused');
  }

  function cancel() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    const session: ForestSession = {
      id: crypto.randomUUID(),
      sessionLength: state.preferences.focusMinutes,
      completed: false,
      treeStage: 'withered',
      timestamp: new Date().toISOString(),
      pointsEarned: 0,
    };
    setState(st => addForestSession(st, session));
    toast.error('🥀 Session cancelled. Tree withered.');
  }

  function reset() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    setSecondsLeft(totalSeconds);
  }

  const progress = 1 - secondsLeft / totalSeconds;
  const stage = stageForProgress(progress);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div style={{ display: 'grid', gap: 16, textAlign: 'center' }}>
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        <RotateCcw size={24} />
        Focus Timer
      </h2>
      
      <div style={{ fontSize: 64, fontWeight: 700, fontFamily: 'monospace' }}>
        {mm}:{ss}
      </div>
      
      <TreeGrowth stage={stage} progress={progress} />
      
      <div style={{ opacity: 0.8, marginBottom: 8 }}>
        Stage: {stage.charAt(0).toUpperCase() + stage.slice(1)}
      </div>
      
      <div className="card-surface" style={{ height: 20, overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${progress * 100}%`, 
            background: 'linear-gradient(90deg,#10b981,#22d3ee)',
            transition: 'width 0.3s ease'
          }} 
        />
      </div>
      
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {!running && secondsLeft === totalSeconds && (
          <button className="btn-primary" onClick={start} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Play size={16} />
            Start
          </button>
        )}
        
        {running && (
          <button className="btn-secondary" onClick={pause} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pause size={16} />
            Pause
          </button>
        )}
        
        {!running && secondsLeft < totalSeconds && secondsLeft > 0 && (
          <button className="btn-primary" onClick={start} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Play size={16} />
            Resume
          </button>
        )}
        
        {secondsLeft < totalSeconds && (
          <button className="btn-secondary" onClick={cancel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Cancel
          </button>
        )}
        
        <button className="btn-secondary" onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
      
      <div style={{ fontSize: 14, opacity: 0.7 }}>
        Session length: {state.preferences.focusMinutes} minutes
      </div>
    </div>
  );
}
