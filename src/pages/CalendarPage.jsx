import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useFamily } from '../context/FamilyContext';
import { createDoc, subscribeFamilyCollection } from '../services/firestoreService';

export default function CalendarPage() {
  const { familyId } = useFamily();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!familyId) return;
    return subscribeFamilyCollection('events', familyId, setEvents);
  }, [familyId]);

  const addEvent = async (e) => {
    e.preventDefault();
    if (!familyId) return;
    await createDoc('events', { familyId, title, date, notes });
    setTitle('');
    setDate('');
    setNotes('');
  };

  return (
    <main className="page">
      <Card title="Shared Calendar">
        <form className="stack-form" onSubmit={addEvent}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" required />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows="3" />
          <button className="btn-primary">Add Event</button>
        </form>
      </Card>
      <Card title="Upcoming Events">
        {events
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
          .map((event) => (
            <div key={event.id} className="row-item">
              <div>
                <strong>{event.title}</strong>
                <p>{event.date}</p>
              </div>
              <small>{event.notes}</small>
            </div>
          ))}
      </Card>
    </main>
  );
}
