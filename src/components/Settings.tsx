import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Clock, Palette, Bell, Info } from 'lucide-react';
import type { AppState } from '../lib/types';
import { setPreferences } from '../lib/storage';

type Props = {
  state: AppState;
  setState: (updater: (s: AppState) => AppState) => void;
};

export default function Settings({ state, setState }: Props) {
  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setState(s => setPreferences(s, { notifications: true }));
      }
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <SettingsIcon size={24} />
        Settings
      </h2>
      
      <div className="card-surface" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Palette size={20} />
              <span style={{ fontWeight: 600 }}>Appearance</span>
            </div>
            <label style={{ display: 'grid', gap: 8 }}>
              <span>Theme</span>
              <select
                value={state.preferences.theme}
                onChange={e => setState(s => setPreferences(s, { theme: e.target.value as any }))}
                className="card-surface"
                style={{ padding: '12px 16px' }}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={20} />
              <span style={{ fontWeight: 600 }}>Timer Settings</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <label style={{ display: 'grid', gap: 8 }}>
                <span>Focus minutes</span>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={state.preferences.focusMinutes}
                  onChange={e => setState(s => setPreferences(s, { focusMinutes: Number(e.target.value) }))}
                  className="card-surface"
                  style={{ padding: '12px 16px' }}
                />
              </label>

              <label style={{ display: 'grid', gap: 8 }}>
                <span>Break minutes</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={state.preferences.breakMinutes}
                  onChange={e => setState(s => setPreferences(s, { breakMinutes: Number(e.target.value) }))}
                  className="card-surface"
                  style={{ padding: '12px 16px' }}
                />
              </label>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Bell size={20} />
              <span style={{ fontWeight: 600 }}>Notifications</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={state.preferences.notifications}
                  onChange={e => setState(s => setPreferences(s, { notifications: e.target.checked }))}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>Enable notifications</span>
              </label>
              {!state.preferences.notifications && (
                <button 
                  onClick={requestNotificationPermission}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: 12 }}
                >
                  Request Permission
                </button>
              )}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
              Get notified when focus sessions complete or tasks are due
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        className="card-surface" 
        style={{ padding: 20, textAlign: 'center' }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Info size={32} style={{ marginBottom: 12, opacity: 0.7 }} />
        <div style={{ fontWeight: 600, marginBottom: 8 }}>About Forest Focus</div>
        <div style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>
          A gamified productivity app that helps you stay focused and grow a beautiful digital forest. 
          Complete tasks and focus sessions to earn points, unlock badges, and watch your forest thrive!
        </div>
      </motion.div>
    </div>
  );
}
