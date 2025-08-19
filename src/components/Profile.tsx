import { motion } from 'framer-motion';
import { User, Star, Flame, Award, Target } from 'lucide-react';
import type { AppState } from '../lib/types';
import { setUsername } from '../lib/storage';

type Props = {
  state: AppState;
  setState: (updater: (s: AppState) => AppState) => void;
};

export default function Profile({ state, setState }: Props) {
  const nextBadge = Object.entries({ Sproutling: 50, Sapling: 200, 'Oak Master': 500 })
    .find(([_, threshold]) => state.points < threshold);
  
  const progressToNext = nextBadge ? (state.points / nextBadge[1]) * 100 : 100;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <User size={24} />
        Profile
      </h2>
      
      <div className="card-surface" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Username</span>
            <input
              value={state.username}
              onChange={e => setState(s => setUsername(s, e.target.value))}
              className="card-surface"
              style={{ padding: '12px 16px' }}
              placeholder="Enter your name"
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <motion.div 
          className="card-surface" 
          style={{ padding: 20, textAlign: 'center' }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Star size={32} style={{ marginBottom: 8, color: '#FBBF24' }} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.points}</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Total Points</div>
        </motion.div>
        
        <motion.div 
          className="card-surface" 
          style={{ padding: 20, textAlign: 'center' }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Flame size={32} style={{ marginBottom: 8, color: '#F97316' }} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.streaks.current}</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Current Streak</div>
          <div style={{ fontSize: 12, opacity: 0.5 }}>Best: {state.streaks.best}</div>
        </motion.div>
        
        <motion.div 
          className="card-surface" 
          style={{ padding: 20, textAlign: 'center' }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Target size={32} style={{ marginBottom: 8, color: '#10B981' }} />
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.tasks.filter(t => t.completed).length}</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Tasks Completed</div>
        </motion.div>
      </div>

      <div className="card-surface" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Award size={20} />
          <span style={{ fontWeight: 600 }}>Badges Earned</span>
        </div>
        
        {state.badges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', opacity: 0.7 }}>
            <Award size={48} style={{ marginBottom: 12 }} />
            <div>No badges yet. Keep working to earn your first badge!</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {state.badges.map(badge => (
              <motion.div
                key={badge}
                className="card-surface"
                style={{ 
                  padding: 16, 
                  textAlign: 'center',
                  background: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.3)'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Award size={24} style={{ marginBottom: 8, color: '#22D3EE' }} />
                <div style={{ fontWeight: 600 }}>{badge}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {nextBadge && (
        <div className="card-surface" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Target size={20} />
            <span style={{ fontWeight: 600 }}>Next Badge: {nextBadge[0]}</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{state.points} / {nextBadge[1]} points</span>
              <span style={{ fontSize: 14 }}>{Math.round(progressToNext)}%</span>
            </div>
            <div className="card-surface" style={{ height: 12, overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${progressToNext}%`, 
                  background: 'linear-gradient(90deg,#22d3ee,#a78bfa)',
                  transition: 'width 0.5s ease'
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
