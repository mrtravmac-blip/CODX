import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { useFamily } from '../context/FamilyContext';
import { createDoc, subscribeFamilyCollection } from '../services/firestoreService';

const checkButtons = ["I'm home", 'Need pickup', 'Done with homework'];

export default function HomePage() {
  const { familyId, profile } = useFamily();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    if (!familyId) return;
    const unsubEvents = subscribeFamilyCollection('events', familyId, setEvents);
    const unsubJournal = subscribeFamilyCollection('journal', familyId, setAnnouncements);
    const unsubCheckins = subscribeFamilyCollection('checkins', familyId, setCheckins);
    return () => [unsubEvents, unsubJournal, unsubCheckins].forEach((fn) => fn());
  }, [familyId]);

  const todaysEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return events.filter((event) => event.date === today);
  }, [events]);

  const addAnnouncement = async () => {
    const post = prompt('Family announcement');
    if (!post || !familyId) return;
    await createDoc('journal', { familyId, type: 'announcement', text: post, createdBy: profile?.name || 'Member' });
  };

  const logCheckin = async (label) => {
    if (!familyId) return;
    await createDoc('checkins', {
      familyId,
      userId: profile?.uid,
      userName: profile?.name,
      label,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <main className="page home-grid">
      <Card title="Today's Schedule" action={<span>{todaysEvents.length} items</span>}>
        {todaysEvents.length ? todaysEvents.map((event) => <p key={event.id}>📌 {event.title}</p>) : <p>No events today 🎉</p>}
      </Card>
      <Card title="Family Announcements" action={<button onClick={addAnnouncement}>Add note</button>}>
        {announcements.slice(0, 4).map((post) => <p key={post.id}>💬 {post.text}</p>)}
      </Card>
      <Card title="Quick Actions">
        <div className="button-grid">
          {checkButtons.map((btn) => (
            <button key={btn} className="btn-primary" onClick={() => logCheckin(btn)}>{btn}</button>
          ))}
        </div>
      </Card>
      <Card title="Recent Check-ins">
        {checkins.slice(0, 5).map((item) => (
          <p key={item.id}>{item.userName}: {item.label}</p>
        ))}
      </Card>
    </main>
  );
}
