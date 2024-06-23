import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = express();
const server = createServer(app);

import serviceAccount from './incoglingo-db15003bd346.js'

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const io = new SocketIOServer(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  }
});

app.use(cors());
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const Razorpay = require('razorpay');
// let razorpayInstance = new Razorpay({
//   key_id: 'rzp_live_zVNgag0wyghXm0', // Replace with your actual Razorpay API key
//   key_secret: 'Mtj3FhFNu8YBxZmIVJfywyb2', // Replace with your actual Razorpay API secret
// });
// ================================

// Declare global variables to store the parameters so after recovery I still have
// roomId, id since i don't want to join room again

import { nanoid } from 'nanoid'


//==================================================
//==================================================
//==================================================
import AsyncLock from 'async-lock';

class QueueSystem {
  constructor() {
    this.queue = [];
    this.matches = new Map();
    this.lock = new AsyncLock();
    // Cleanup matches every hour
    setInterval(() => this.cleanupMatches(), 60 * 60 * 1000);
  }

  async joinQueue(userId) {
    return this.lock.acquire('matchmaking', async () => {
      if (this.queue.includes(userId) || this.matches.has(userId)) {
        return null; // User is already in queue or matched
      }

      if (this.queue.length > 0) {
        const partnerId = this.queue.shift();
        const roomId = nanoid(9);
        this.matches.set(userId, { partner: partnerId, roomId });
        this.matches.set(partnerId, { partner: userId, roomId });
        return { matched: true, roomId, partnerId };
      } else {
        this.queue.push(userId);
        return { matched: false };
      }
    });
  }

  async leaveQueue(userId) {
    return this.lock.acquire('matchmaking', () => {
      this.queue = this.queue.filter(id => id !== userId);
      this.matches.delete(userId);
    });
  }

  async checkStatus(userId) {
    return this.lock.acquire('matchmaking', () => {
      if (this.matches.has(userId)) {
        const { partner, roomId } = this.matches.get(userId);
        return { matched: true, roomId, partnerId: partner };
      }
      return { matched: false };
    });
  }

  async endMatch(userId) {
    return this.lock.acquire('matchmaking', () => {
      if (this.matches.has(userId)) {
        const { partner } = this.matches.get(userId);
        this.matches.delete(userId);
        this.matches.delete(partner);
      }
    });
  }

  async cleanupMatches() {
    return this.lock.acquire('matchmaking', () => {
      const now = Date.now();
      for (const [userId, match] of this.matches.entries()) {
        // Remove matches older than 2 hours
        if (now - match.timestamp > 2 * 60 * 60 * 1000) {
          this.matches.delete(userId);
        }
      }
    });
  }
}

const queueSystem = new QueueSystem();

app.post('/matchmaking/join', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await queueSystem.joinQueue(userId);
    res.json(result);
  } catch (error) {
    console.error('Error in join queue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/matchmaking/leave', async (req, res) => {
  const { userId } = req.body;
  try {
    await queueSystem.leaveQueue(userId);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in leave queue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/matchmaking/status', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await queueSystem.checkStatus(userId);
    res.json(result);
  } catch (error) {
    console.error('Error in check status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//==================================================
//==================================================
//==================================================

io.on('connection', (socket) => {
  //By declaring the variables within the io.on('connection', (socket) => { ... }) block, 
  //each client connection has its own set of variables
  let naam;
  let peerId;
  let roomId;
  socket.on('join-room', (receivedRoomId, receivedPeerId, receivedName) => {
    console.log(receivedPeerId);
      roomId = receivedRoomId;
      peerId = receivedPeerId;
      naam = receivedName;

      socket.join(receivedRoomId);
      // you have to emit something to the socket first so recovery is succesfull
      // at unexpected disconnection
      socket.emit('joined')
      socket.broadcast.to(receivedRoomId).emit('user-connected', receivedPeerId, receivedName);

  });

      
  if (socket.recovered) {
    console.log('Recovery successful');

    socket.on('name', (name, id, roomId) => {
      naam = name;
      peerId = id;
      roomId = roomId;
      socket.broadcast.to(roomId).emit('user-recovered', naam);
    });
  } else {
    console.log('New or unrecoverable session');
  }

  socket.on('send-chat-message', (message, roomId) => {
    socket.broadcast.to(roomId).emit('chat-message', {message:message, name: naam}); 
  });
  
  socket.on('disconnect', () => {
    socket.broadcast.to(roomId).emit('user-disconnected', peerId, naam);
  });

  // deliberate because there can be disconnections by a ghost and can't close call on those,
  // that is you only close the call if the user closed the connection
  socket.on('deliberate-disconnect', (id) => {
    socket.broadcast.to(roomId).emit('deliberate', id);
  });

});

app.post('/sendProfileData', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { uid, formData } = req.body;
  // Perform further processing with the extracted data
  // For example, save the user profile to a database
  try {
    const docRef = db.collection('users').doc(uid);
    // if you want to update only specific fields of an existing document
    // without overwriting the entire document, use merge.
    await docRef.set(formData, { merge: true });

    res.json({ success: true});
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/sendSessionData', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const uid = req.body.organizer.organizerId;
    const userRecord = await admin.auth().getUser(`${uid}`);
    const customClaims = userRecord.customClaims;

    if (customClaims && customClaims.admin === true) {
      const nid = nanoid(9);
      const docRef = db.collection('sessions').doc();
      const sessionData = {
       ...req.body,
        roomId: nid, // Add the unique room ID to the session data
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Set the timestamp for when the session was created
      };
      await docRef.set(sessionData);
      res.status(200).json({ sessionId: docRef.id, roomId: nid });
    } else {
      const error = new Error('User is not authorized to perform this action.');
      error.statusCode = 403;
      throw error;
    }
  } catch (error) {
    console.error(`Error storing session data: ${error.message}`);
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while saving session data.' });
    }
  }
});

app.get("/getProfileData/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    // Retrieve the document from Firestore based on the given uid
    const profile = db.collection('users').doc(uid);
    const doc = await profile.get();
    if (!doc.exists) {
      return res.status(404).send({ message: 'No such document!' });
    }  else {
      // Send the document data back to the client
      res.send(doc.data());
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

app.get("/getOtherProfileData/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const userRecord = await admin.auth().getUser(uid);
    const profile = db.collection('users').doc(uid);
    const doc = await profile.get();
    if (!doc.exists) {
      return res.status(404).send({ message: 'No such document!' });
    } else {
      const data = {
        profile: userRecord,
        db: doc.data()
      }
      res.send(data);
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).send({ message: 'User not found' });
    } else {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// Route to get all teachers
// app.get('/teachers', async (req, res) => {
//   try {
//     const adminUsersQuery = db.collection('users').where('isAdmin', '==', true);
//     const querySnapshot = await adminUsersQuery.get();
//     const adminUsers = querySnapshot.docs.map(doc => doc.data());
//     // console.log(adminUsers); // Array of admin users
//     res.status(200).json(adminUsers);
//   } catch (error) {
//     console.error('Error fetching admin users:', error);
//     res.status(500).json({ error: 'Failed to fetch admin users' });
//   }
// });

// app.post('/subscribeToTeacher', async (req, res) => {

//   const { learnerId, teacherId } = req.body;
//   console.log(learnerId);
//   console.log(teacherId);
//   try {
//     const userRef = db.collection('users').doc(learnerId);
//     const subscriptionRef = userRef.collection('subscriptions').doc(teacherId);

//     await subscriptionRef.set({
//       createdAt: admin.firestore.FieldValue.serverTimestamp()
//     });
//     res.status(201).send(`Subscription created successfully`);
//   } catch (error) {
//       console.error('Error creating subscription: ', error);
//       res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
//   // const { planId } = req.body;
//   // const startDate = new Date('April 1, 2024 00:00:00 GMT+0000');
//   // const startAtUnixTimestamp = Math.floor(startDate.getTime() / 1000); // Convert milliseconds to seconds
 
//   // const options = {
//   //   plan_id: planId,
//   //   total_count: 12, // e.g., for a yearly subscription with monthly billing
//   //   start_at: startAtUnixTimestamp
//   // };
//   // console.log(options);
//   // try {
//   //   const subscription = await razorpayInstance.subscriptions.create(options);
//   //   res.json(subscription);
//   // } catch (error) {
//   //   res.status(500).send(error);
//   //   console.log(error);
//   // }

// });

app.post('/book-session', async (req, res) => {
  try {
    const { sessionId, learnerId, displayName, email } = req.body;
    // Input validation
    if (!sessionId || !learnerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if the learner is already in the attendees array
    const attendees = sessionDoc.data().attendees || [];
    const learnerAttendee = attendees.find(
      (attendee) => attendee.learnerId === learnerId
    );

    if (learnerAttendee) {
      return res.status(400).json({ error: 'Learner already booked for this session' });
    }

    // Add the learner to the attendees array
    const newAttendee = {
      learnerId,
      learnerName: displayName,
      learnerEmail: email,
    };

    await sessionRef.update({
      attendees: admin.firestore.FieldValue.arrayUnion(newAttendee),
    });

    res.status(200).json({ message: 'Session booked successfully' });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ error: 'An error occurred while booking the session' });
  }
});

app.get('/sessions/latest', async (req, res) => {
  try {
    const sessionsRef = db.collection('sessions').orderBy('createdAt', 'desc');
    const latestSessions = await sessionsRef.limit(10).get();
    const sessionsList = latestSessions.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(sessionsList);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/individualsessiondata/:roomId', async (req, res) => {
    const fieldValue = req.params.roomId; // get the field value from the request query
    try {
      const query = db.collection('sessions').where("roomId", '==', fieldValue);
      const document = await query.limit(1).get();
  
      if (document.empty) {
        res.status(404).send(`Document not found with roomId = ${fieldValue}`);
      } else {
        const documentData = document.docs[0].data();
        res.send(documentData);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).send('Error fetching document');
    }
});

server.listen(port, () => {
  console.log(`running on port ${port}`);

  if (process.env.NODE_ENV === "production") {
      // application is running in production mode
      console.log('running in production mode');
    } else {
      // application is running in development mode
      console.log('running in development mode');
      
    }
});
