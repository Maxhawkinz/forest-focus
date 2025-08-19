import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import type { AppState } from '../lib/types';

type Props = { 
  state: AppState; 
};

export default function Leaderboard({ state }: Props) {
  const friends = [
    { name: 'Ava', points: 320, avatar: '👩‍💻' },
    { name: 'Ben', points: 210, avatar: '👨‍🎨' },
    { name: 'Kai', points: 480, avatar: '🧑‍🔬' },
    { name: 'Mia', points: 95, avatar: '👩‍🏫' },
    { name: 'Zoe', points: 150, avatar: '🧑‍💼' },
  ];
  
  const rows = [...friends, { name: state.username, points: state.points, avatar: '🌟' }]
    .sort((a, b) => b.points - a.points)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  function getRankIcon(rank: number) {
    if (rank === 1) return <Trophy size={20} style={{ color: '#FFD700' }} />;
    if (rank === 2) return <Medal size={20} style={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <Award size={20} style={{ color: '#CD7F32' }} />;
    return <span style={{ fontSize: 16, fontWeight: 600 }}>#{rank}</span>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy size={24} />
        Leaderboard
      </h2>
      
      <div className="card-surface" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {rows.map((r, index) => (
            <motion.div
              key={r.name}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '60px 1fr 100px', 
                gap: 16, 
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 8,
                background: r.name === state.username ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                border: r.name === state.username ? '1px solid rgba(34, 211, 238, 0.3)' : 'none'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {getRankIcon(r.rank)}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{r.avatar}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {r.name} {r.name === state.username && '(You)'}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {r.points < 50 ? '🌱 Newcomer' : 
                     r.points < 200 ? '🌿 Growing' : 
                     r.points < 500 ? '🌳 Established' : '🏆 Master'}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', fontWeight: 600 }}>
                {r.points} pts
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: 16, textAlign: 'center', opacity: 0.7, fontSize: 14 }}>
        Keep growing to climb the ranks! 🌱
      </div>
    </div>
  );
}
