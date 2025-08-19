import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Calendar, Edit3, Trash2, CheckCircle } from 'lucide-react';
import type { AppState, Task } from '../lib/types';
import { addTask, removeTask, toggleTaskComplete, updateTask } from '../lib/storage';

type Props = {
  state: AppState;
  setState: (updater: (s: AppState) => AppState) => void;
};

export default function TaskList({ state, setState }: Props) {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState<string>('');

  const tasks = useMemo(() => {
    return [...state.tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [state.tasks]);

  function handleAdd() {
    if (!title.trim()) return;
    const id = crypto.randomUUID();
    setState(s => addTask(s, { id, title: title.trim(), due: due || undefined, remindAt: undefined }));
    setTitle('');
    setDue('');
    toast.success('Task added! 🌱');
  }

  function handleToggle(t: Task) {
    setState(s => toggleTaskComplete(s, t.id));
    if (!t.completed) {
      toast.success(`+5 points! Task completed! ✨`);
    }
  }

  function handleDelete(t: Task) {
    setState(s => removeTask(s, t.id));
    toast.info('Task removed');
  }

  function handleEdit(t: Task, nextTitle: string) {
    if (nextTitle.trim() === '') return;
    const edited: Task = { ...t, title: nextTitle.trim() };
    setState(s => updateTask(s, edited));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle size={24} />
        Task Management
      </h2>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a task…"
          className="card-surface"
          style={{ padding: '12px 16px', width: '100%', minWidth: '200px' }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <input
          type="date"
          value={due}
          onChange={e => setDue(e.target.value)}
          className="card-surface"
          style={{ padding: '12px 16px' }}
        />
        <button onClick={handleAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} />
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', opacity: 0.7 }}>
          <CheckCircle size={48} style={{ marginBottom: 16 }} />
          <div>No tasks yet. Add your first task to get started!</div>
        </div>
      ) : (
        <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t.id} className="card-surface" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <input 
                type="checkbox" 
                checked={t.completed} 
                onChange={() => handleToggle(t)}
                style={{ transform: 'scale(1.2)' }}
              />
              <input
                value={t.title}
                onChange={e => handleEdit(t, e.target.value)}
                className=""
                style={{ 
                  flex: 1, 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'inherit', 
                  outline: 'none',
                  textDecoration: t.completed ? 'line-through' : 'none',
                  opacity: t.completed ? 0.7 : 1
                }}
              />
              {t.due && (
                <span style={{ fontSize: 12, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  {t.due}
                </span>
              )}
              <button onClick={() => handleDelete(t)} className="btn-secondary" style={{ padding: '8px' }}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
