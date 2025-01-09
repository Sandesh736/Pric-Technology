const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

admin.initializeApp();
const db = admin.firestore();
const usersCollection = db.collection('users');

functions.http('userHandler', (req, res) => {
  const { method, body, query } = req;

  switch (method) {
    case 'GET': // Fetch all users
      usersCollection.get().then((snapshot) => {
        const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json(users);
      }).catch((err) => res.status(500).send(err.message));
      break;

    case 'POST': // Add a new user
      usersCollection.add(body).then((docRef) => {
        res.json({ id: docRef.id, ...body });
      }).catch((err) => res.status(500).send(err.message));
      break;

    case 'PUT': // Update a user
      const { id } = query;
      usersCollection.doc(id).update(body).then(() => {
        res.json({ id, ...body });
      }).catch((err) => res.status(500).send(err.message));
      break;

    case 'DELETE': // Delete a user
      usersCollection.doc(query.id).delete().then(() => {
        res.status(204).send();
      }).catch((err) => res.status(500).send(err.message));
      break;

    default:
      res.status(405).send('Method Not Allowed');
  }
});
