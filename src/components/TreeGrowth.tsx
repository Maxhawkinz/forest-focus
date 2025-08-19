import { motion } from 'framer-motion';
import type { TreeStage } from '../lib/types';

type Props = {
  stage: TreeStage;
  progress: number; // 0..1
};

const STAGE_EMOJI: Record<TreeStage, string> = {
  seed: '🌰',
  sprout: '🌱',
  plant: '🌿',
  small: '🌳',
  full: '🌲',
  withered: '🥀',
};

export default function TreeGrowth({ stage, progress }: Props) {
  const scale = 0.8 + progress * 0.4;
  
  return (
    <div style={{ display: 'grid', placeItems: 'center', width: '100%', padding: 16 }}>
      <motion.div
        style={{ fontSize: 72 }}
        animate={{
          scale,
          rotate: [0, -2, 0, 2, 0],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: 'easeInOut',
          scale: { duration: 0.5, ease: 'easeOut' }
        }}
        key={stage} // Force re-animation when stage changes
      >
        {STAGE_EMOJI[stage]}
      </motion.div>
    </div>
  );
}
