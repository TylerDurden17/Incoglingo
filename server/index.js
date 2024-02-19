const express = require('express');
require('dotenv').config()
const cors = require("cors");
const app = express();
//create a server to use with socket io
const server = require('http').createServer(app);

const admin = require('firebase-admin');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


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

    // res.json({ success: true, documentId: docRef.id });
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
            // await docRef.set(req.body);
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

app.get("/getProfileData/:uid", async (req, res) => {
  const uid = `${req.params.uid}`;
  // try {
  //   // Retrieve the document from Firestore based on the given uid
  //   const profile = db.collection('users').doc(uid);
  //   const doc = await profile.get();
  //   if (!doc.exists) {
  //     return res.status(404).send({ message: 'No such document!' });
  //   }  else {
  //     console.log('Document data:', doc.data());
  //   }
    
  //   // Send the document data back to the client
  //   res.send(doc.data());

  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal Server Error");
  // }
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

