import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { useFamily } from '../context/FamilyContext';
import {
  createDoc,
  removeCollectionDoc,
  subscribeFamilyCollection,
  updateCollectionDoc,
} from '../services/firestoreService';

export default function TasksPage() {
  const { familyId, profile } = useFamily();
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [points, setPoints] = useState(10);

  useEffect(() => {
    if (!familyId) return;
    const a = subscribeFamilyCollection('users', familyId, setMembers, null);
    const b = subscribeFamilyCollection('tasks', familyId, setTasks);
    const c = subscribeFamilyCollection('rewards', familyId, setRewards);
    return () => [a, b, c].forEach((fn) => fn());
  }, [familyId]);

  const pointBalance = useMemo(() => {
    const earned = tasks.filter((t) => t.complete).reduce((sum, t) => sum + (t.points || 0), 0);
    const used = rewards.filter((r) => r.redeemedBy).reduce((sum, r) => sum + (r.cost || 0), 0);
    return earned - used;
  }, [tasks, rewards]);

  const createTask = async (event) => {
    event.preventDefault();
    if (!title || !familyId) return;
    await createDoc('tasks', { familyId, title, assignee, points: Number(points), complete: false });
    setTitle('');
  };

  const toggleTask = async (task) => updateCollectionDoc('tasks', task.id, { complete: !task.complete });
  const deleteTask = async (id) => removeCollectionDoc('tasks', id);

  const addReward = async () => {
    const name = prompt('Reward name');
    const cost = Number(prompt('Cost in points', '20'));
    if (!name || !familyId) return;
    await createDoc('rewards', { familyId, name, cost, redeemedBy: null });
  };

  const redeem = async (reward) => {
    if (reward.redeemedBy || pointBalance < reward.cost) return;
    await updateCollectionDoc('rewards', reward.id, { redeemedBy: profile?.name || 'Family member' });
  };

  return (
    <main className="page">
      <Card title="Create Task">
        <form onSubmit={createTask} className="stack-form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task name" required />
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
            <option value="">Assign to...</option>
            {members.map((member) => <option key={member.uid} value={member.name}>{member.avatar} {member.name}</option>)}
          </select>
          <input type="number" min="1" value={points} onChange={(e) => setPoints(e.target.value)} />
          <button className="btn-primary">Save Task</button>
        </form>
      </Card>

      <Card title={`Tasks (${tasks.length})`}>
        {tasks.map((task) => (
          <div key={task.id} className="row-item">
            <button onClick={() => toggleTask(task)}>{task.complete ? '✅' : '⬜'}</button>
            <div>
              <strong>{task.title}</strong>
              <p>{task.assignee || 'Unassigned'} • {task.points} pts</p>
            </div>
            <button onClick={() => deleteTask(task.id)}>🗑️</button>
          </div>
        ))}
      </Card>

      <Card title={`Rewards (Balance: ${pointBalance})`} action={<button onClick={addReward}>Add Reward</button>}>
        {rewards.map((reward) => (
          <div key={reward.id} className="row-item">
            <div>
              <strong>{reward.name}</strong>
              <p>{reward.cost} points</p>
            </div>
            <button className="btn-primary" disabled={!!reward.redeemedBy || pointBalance < reward.cost} onClick={() => redeem(reward)}>
              {reward.redeemedBy ? `Redeemed by ${reward.redeemedBy}` : 'Redeem'}
            </button>
          </div>
        ))}
      </Card>
    </main>
  );
}
