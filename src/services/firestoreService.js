import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export const subscribeFamilyCollection = (collectionName, familyId, cb, orderField = 'createdAt') => {
  const constraints = [where('familyId', '==', familyId)];
  if (orderField) constraints.push(orderBy(orderField, 'desc'));
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
};

export const createDoc = async (collectionName, payload) => {
  return addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateCollectionDoc = async (collectionName, id, payload) => {
  return updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const removeCollectionDoc = async (collectionName, id) => {
  return deleteDoc(doc(db, collectionName, id));
};
