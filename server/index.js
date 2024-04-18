const express = require('express');
require('dotenv').config()
const cors = require("cors");
const app = express();
//create a server to use with socket io
const server = require('http').createServer(app);

const admin = require('firebase-admin');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, query, limit, getDocs, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const Razorpay = require('razorpay');

let razorpayInstance = new Razorpay({
  key_id: 'rzp_live_zVNgag0wyghXm0', // Replace with your actual Razorpay API key
  key_secret: 'Mtj3FhFNu8YBxZmIVJfywyb2', // Replace with your actual Razorpay API secret
});


const io = require('socket.io')(server, {
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    } 
  }
)

app.use(cors());
const port = process.env.PORT || 8080;

const serviceAccount = require('./incoglingo-db15003bd346.json');
const { log } = require('console');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(express.json());
// Parse URL-encoded data and multipart forms
app.use(express.urlencoded({ extended: true }));


// ================================

// Declare global variables to store the parameters so after recovery I still have
// roomId, id since i don't want to join room again

let roomId = null;

io.on('connection', (socket) => {

    let naam = null;
    let peerId = null;

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

      socket.on('name', (name, id) => {
        naam = name;
        peerId = id;
        socket.broadcast.to(roomId).emit('user-recovered', naam);
      });
    } else {
      console.log('New or unrecoverable session');
    }

    socket.on('send-chat-message', message => {
      socket.broadcast.to(roomId).emit('chat-message', {message:message, name: naam}); 
    });
    
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', peerId, naam);
    });

    //deliberate because there can be disconnections by a ghost and can't close call on those
    socket.on('deliberate-disconnect', (id) => {
      socket.broadcast.to(roomId).emit('deliberate', id);
    });

});

app.post('/sendProfileData', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { uid, formData } = req.body;
  console.log(req.body);
  // Perform further processing with the extracted data
  // For example, save the user profile to a database
  try {
    // const docRef = db.collection('users').doc(uid);
    // // if you want to update only specific fields of an existing document
    // // without overwriting the entire document, use merge.
    // await docRef.set(formData, { merge: true });

     res.json({ success: true});
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/sendSessionData', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  //console.log(req.body);
  const uid = req.body.id;
  try {
    admin.auth().getUser(`${uid}`)
    .then((userRecord) => {

        const customClaims = userRecord.customClaims;

        if (customClaims && customClaims.admin === true) {
            console.log('User is an admin');
            // console.log(req.body);
            // const docRef = db.collection('sessions').doc(uid);
            // docRef.set(req.body);
            res.status(200).json({ message: 'Session data saved successfully.' });
        } else {
            console.log('User is not an admin');
            res.status(403).json({ error: 'User is not authorized to perform this action.' });
        }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    });
  } catch (error) {
    console.error("Error storing session data:", error);
    res.status(500).json({ error: 'An error occurred while saving session data.' });
  }
});

// app.get("/getProfileData/:uid", async (req, res) => {
//   const uid = `${req.params.uid}`;
//   // try {
//   //   // Retrieve the document from Firestore based on the given uid
//   //   const profile = db.collection('users').doc(uid);
//   //   const doc = await profile.get();
//   //   if (!doc.exists) {
//   //     return res.status(404).send({ message: 'No such document!' });
//   //   }  else {
//   //     console.log('Document data:', doc.data());
//   //   }
    
//   //   // Send the document data back to the client
//   //   res.send(doc.data());

//   // } catch (err) {
//   //   console.error(err);
//   //   res.status(500).send("Internal Server Error");
//   // }
// });

// Example teacher data
const teachers = [
  {
    id:  2,
    name: 'Tyler Durden',
    bio: 'Experienced in catology.',
    photo: 'https://api.slingacademy.com/public/sample-users/2.png',
  },
];

// Route to get all teachers
app.get('/teachers', (req, res) => {
  res.json(teachers);
});


app.post('/create-subscription', async (req, res) => {

  const { planId } = req.body;
  const startDate = new Date('April 1, 2024 00:00:00 GMT+0000');
  const startAtUnixTimestamp = Math.floor(startDate.getTime() / 1000); // Convert milliseconds to seconds
 
  const options = {
    plan_id: planId,
    total_count: 12, // e.g., for a yearly subscription with monthly billing
    start_at: startAtUnixTimestamp
  };
  console.log(options);
  // try {
  //   const subscription = await razorpayInstance.subscriptions.create(options);
  //   res.json(subscription);
  // } catch (error) {
  //   res.status(500).send(error);
  //   console.log(error);
  // }

});

app.post('/book-session', async (req, res) => {
  try {
    const { sessionId, learnerId } = req.body;

    // Create a new booking document
    const newBookingRef = db.collection('bookings').doc();
    await newBookingRef.set({
      bookingId: newBookingRef.id,
      sessionId,
      learnerId,
      bookingDateTime: new Date(),
      createdAt: new Date(),
    });

    // Update the corresponding session document
    const sessionRef = db.collection('sessions').doc(sessionId);
    await sessionRef.update({
      bookedSeats: admin.firestore.FieldValue.increment(1),
      attendees: admin.firestore.FieldValue.arrayUnion(learnerId),
    });

    res.status(200).json({ message: 'Session booked successfully' });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ error: 'An error occurred while booking the session' });
  }
})

// Routes
app.get('/sessions/latest', async (req, res) => {
  try {
    const sessionsRef = db.collection('sessions').orderBy('createdAt', 'desc');
    const latestSessions = await sessionsRef.limit(10).get();
    const sessionsList = latestSessions.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(sessionsList);
    //console.log(sessionsList);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/sessions/booked/:learnerId', async (req, res) => {
  try {
    const learnerId = req.params.learnerId;
    const bookedSessionsSnapshot = await db.collection('bookings')
      .where('learnerId', '==', learnerId)
      .get();
    if (bookedSessionsSnapshot.empty) {
      //res.status(404).json({ error: 'No booked sessions found for the given learner ID' });
      res.status(200).json([]); // Return an empty array instead of 404 error
    } else {
      const bookedSessionIds = bookedSessionsSnapshot.docs.map((doc) => doc.data().sessionId);
      res.json(bookedSessionIds);
    }
  } catch (error) {
    console.error('Error fetching booked sessions:', error);
    res.status(500).json({ error: 'Failed to fetch booked sessions' });
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

