import { motion } from 'framer-motion';
import { Trees, Clock, Star, Calendar } from 'lucide-react';
import type { AppState } from '../lib/types';

type Props = {
  state: AppState;
};

export default function Forest({ state }: Props) {
  if (state.forest.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <Trees size={64} style={{ marginBottom: 16, opacity: 0.7 }} />
        <div style={{ fontSize: 18, marginBottom: 8 }}>No trees yet</div>
        <div style={{ opacity: 0.7 }}>Complete a focus session to grow your first tree!</div>
      </div>
    );
  }

  const successfulSessions = state.forest.filter(s => s.completed).length;
  const totalMinutes = state.forest.reduce((sum, s) => sum + s.sessionLength, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trees size={24} />
        Your Forest
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card-surface" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{state.forest.length}</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Total Sessions</div>
        </div>
        <div className="card-surface" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{successfulSessions}</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Successful</div>
        </div>
        <div className="card-surface" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totalMinutes}</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>Minutes Focused</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {state.forest.map((session, index) => (
          <motion.div
            key={session.id}
            className="card-surface"
            style={{ padding: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>
                {session.completed ? '🌳' : '🥀'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {session.completed ? 'Healthy Tree' : 'Withered'}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {new Date(session.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <Clock size={14} />
                {session.sessionLength} minutes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <Star size={14} />
                +{session.pointsEarned} points
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Stage: {session.treeStage}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
