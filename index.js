const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));





const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
  });
  
  const User=mongoose.model( 'user' ,userSchema);

// Routes
app.get('/', (req, res) => {
  res.render('home'); // Ensure 'home.ejs' exists in the 'views' folder
});





app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/');
  } else {
    res.send('Invalid credentials');
  }
});

app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    res.send('Email already in use. Please try another.');
  }
});

app.get('/geni',async (req,res)=>{

    res.render('geni');
});


app.get('/about', async (req,res)=>{

 res.render('about');


});



























// Start server
app.listen(7001, () => console.log('Server is running on port 7000'));
