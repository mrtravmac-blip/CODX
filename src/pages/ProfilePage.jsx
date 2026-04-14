import { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { createDoc, subscribeFamilyCollection, updateCollectionDoc } from '../services/firestoreService';
import { storage } from '../services/firebase';

const avatars = ['🧑‍🚀', '👩‍🔬', '🧒', '👧', '🦸', '🧙', '🦊', '🐼'];

export default function ProfilePage() {
  const { logout } = useAuth();
  const { familyId, profile } = useFamily();
  const [members, setMembers] = useState([]);
  const [journal, setJournal] = useState([]);
  const [post, setPost] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!familyId) return;
    const a = subscribeFamilyCollection('users', familyId, setMembers, null);
    const b = subscribeFamilyCollection('journal', familyId, setJournal);
    return () => [a, b].forEach((fn) => fn());
  }, [familyId]);

  const sendPost = async (e) => {
    e.preventDefault();
    if (!post || !familyId) return;
    await createDoc('journal', { familyId, text: post, author: profile?.name, imageUrl: '' });
    setPost('');
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !familyId) return;
    const fileRef = ref(storage, `journal/${familyId}/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const imageUrl = await getDownloadURL(fileRef);
    await createDoc('journal', { familyId, text: `${profile?.name} shared a photo`, author: profile?.name, imageUrl });
  };

  const updateAvatar = async (avatar) => {
    if (!profile?.uid) return;
    await updateCollectionDoc('users', profile.uid, { avatar });
  };

  return (
    <main className="page">
      <Card title="Profile & Family Members">
        <p>{profile?.avatar} {profile?.name} ({profile?.role})</p>
        <div className="avatar-row">
          {avatars.map((avatar) => <button key={avatar} onClick={() => updateAvatar(avatar)}>{avatar}</button>)}
        </div>
        <h3>Members</h3>
        {members.map((member) => <p key={member.uid}>{member.avatar} {member.name} - {member.role}</p>)}
      </Card>

      <Card title="Family Journal">
        <form className="stack-form" onSubmit={sendPost}>
          <textarea value={post} onChange={(e) => setPost(e.target.value)} placeholder="Share a family memory" rows="3" />
          <input type="file" accept="image/*" onChange={uploadImage} />
          <button className="btn-primary">Post</button>
        </form>
        {journal.map((entry) => (
          <div key={entry.id} className="journal-item">
            <strong>{entry.author || 'Family'}</strong>
            <p>{entry.text}</p>
            {entry.imageUrl && <img src={entry.imageUrl} alt="journal" className="journal-image" />}
          </div>
        ))}
      </Card>

      <Card title="App Settings">
        <button className="btn-light" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <button className="btn-primary" onClick={logout}>Logout</button>
      </Card>
    </main>
  );
}
