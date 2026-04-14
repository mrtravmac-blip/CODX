import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useFamily } from '../context/FamilyContext';
import { createDoc, removeCollectionDoc, subscribeFamilyCollection, updateCollectionDoc } from '../services/firestoreService';

export default function ListsPage() {
  const { familyId, profile } = useFamily();
  const [lists, setLists] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!familyId) return;
    return subscribeFamilyCollection('lists', familyId, setLists);
  }, [familyId]);

  const addItem = async (event) => {
    event.preventDefault();
    if (!text || !familyId) return;
    await createDoc('lists', { familyId, text, complete: false, owner: profile?.name });
    setText('');
  };

  return (
    <main className="page">
      <Card title="Shared Grocery & Lists">
        <form className="inline-form" onSubmit={addItem}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add milk, eggs, notebooks..." required />
          <button className="btn-primary">Add</button>
        </form>
      </Card>
      <Card title="Items">
        {lists.map((item) => (
          <div key={item.id} className="row-item">
            <button onClick={() => updateCollectionDoc('lists', item.id, { complete: !item.complete })}>{item.complete ? '✅' : '⬜'}</button>
            <span className={item.complete ? 'done' : ''}>{item.text}</span>
            <button onClick={() => removeCollectionDoc('lists', item.id)}>🗑️</button>
          </div>
        ))}
      </Card>
    </main>
  );
}
