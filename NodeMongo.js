const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ese', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define a schema for the collection
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', (req, res) => {
  const { name, email, password, role } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    role,
  });

  newUser.save()
    .then(() => res.json(newUser))
    .catch((err) => {
      console.error('Failed to save user', err);
      res.status(500).json({ error: 'Failed to save user' });
    });
});

// Get all users
app.get('/users', (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => {
      console.error('Failed to fetch users', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    });
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch((err) => {
      console.error('Failed to fetch user', err);
      res.status(500).json({ error: 'Failed to fetch user' });
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  User.findByIdAndUpdate(id, { name, email, password, role }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error('Failed to update user', err);
      res.status(500).json({ error: 'Failed to update user' });
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  User.findByIdAndRemove(id)
    .then((removedUser) => {
      if (!removedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch((err) => {
      console.error('Failed to delete user', err);
      res.status(500).json({ error: 'Failed to delete user' });
    });
});

// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
