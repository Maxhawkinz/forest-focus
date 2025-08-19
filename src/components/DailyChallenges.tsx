import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Star, Clock } from 'lucide-react';
import type { AppState } from '../lib/types';

type Props = { 
  state: AppState; 
};

export default function DailyChallenges({ state }: Props) {
  const dateKey = useMemo(() => new Date().toDateString(), []);
  const challenges = useMemo(() => {
    const idx = Math.abs(dateKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 3;
    return [
      { 
        title: 'Complete 3 tasks', 
        description: 'Finish 3 tasks to earn bonus points',
        progress: state.tasks.filter(t => t.completed).length, 
        target: 3,
        icon: <Target size={20} />,
        reward: 'Bonus points'
      },
      { 
        title: 'Focus for 50 minutes', 
        description: 'Complete focus sessions totaling 50 minutes',
        progress: state.forest.reduce((s, f) => s + (f.completed ? f.sessionLength : 0), 0), 
        target: 50,
        icon: <Clock size={20} />,
        reward: 'Streak multiplier'
      },
      { 
        title: 'Early bird session', 
        description: 'Complete 1 successful session before noon',
        progress: state.forest.some(f => f.completed && new Date(f.timestamp).getHours() < 12) ? 1 : 0, 
        target: 1,
        icon: <Star size={20} />,
        reward: 'Morning bonus'
      },
    ][idx];
  }, [dateKey, state.tasks, state.forest]);

  const pct = Math.min(100, Math.round((challenges.progress / challenges.target) * 100));
  const isCompleted = pct >= 100;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy size={24} />
        Daily Challenge
      </h2>
      
      <motion.div 
        className="card-surface" 
        style={{ padding: 20 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ 
            padding: 12, 
            borderRadius: 12, 
            background: isCompleted ? 'rgba(34, 211, 238, 0.2)' : 'rgba(156, 163, 175, 0.2)',
            color: isCompleted ? '#22D3EE' : '#9CA3AF'
          }}>
            {challenges.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
              {challenges.title}
            </div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              {challenges.description}
            </div>
          </div>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Trophy size={24} style={{ color: '#FBBF24' }} />
            </motion.div>
          )}
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>
              Progress: {challenges.progress} / {challenges.target}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {pct}%
            </span>
          </div>
          <div className="card-surface" style={{ height: 12, overflow: 'hidden' }}>
            <motion.div 
              style={{ 
                height: '100%', 
                width: `${pct}%`, 
                background: isCompleted 
                  ? 'linear-gradient(90deg,#22d3ee,#10b981)' 
                  : 'linear-gradient(90deg,#22d3ee,#a78bfa)',
                transition: 'width 0.8s ease'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          padding: '12px 16px', 
          borderRadius: 8,
          background: 'rgba(34, 211, 238, 0.1)',
          border: '1px solid rgba(34, 211, 238, 0.2)'
        }}>
          <Star size={16} style={{ color: '#FBBF24' }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Reward: {challenges.reward}
          </span>
        </div>
      </motion.div>
      
      <div style={{ marginTop: 16, textAlign: 'center', opacity: 0.7, fontSize: 14 }}>
        New challenge every day! 🌅
      </div>
    </div>
  );
}
