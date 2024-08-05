"use client";

import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, serverTimestamp } from "../firebase"
import Login from '../app/login/page';
import Loading from './Loading';
import { setDoc, doc } from 'firebase/firestore';


const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {

    if (user) {
     setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
            lastSeen: serverTimestamp(),
          }, {merge: true})
    }

  }, [user])

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};

export default AuthProvider;
