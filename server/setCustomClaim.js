const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('./incoglingo-db15003bd346.json');

const uid = 'frmIDJxIh1faJzCucNt2fK5Zvw33'; // Replace with the UID of the user

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// admin.auth().setCustomUserClaims(uid, {admin: true})
//   .then(() => {
//     console.log('Custom claim set successfully');
//     process.exit(); // Exiting the script after successful execution
//   })
//   .catch((error) => {
//     console.error('Error setting custom claim:', error);
//     process.exit(1); // Exiting with error code 1
//   });

//too check

// admin.auth().getUser(uid)
//     .then((userRecord) => {

//         const customClaims = userRecord.customClaims;

//         if (customClaims && customClaims.admin === true) {
//             console.log('User is an admin');
//         } else {
//             console.log('User is not an admin');
//         }
//     })
//     .catch((error) => {
//         console.error('Error fetching user data:', error);
//     });
