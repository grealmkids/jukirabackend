
const pool = require('../db');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  console.log('Signup request received:', { name, email, phone });

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      console.log('Signup failed: User with this email already exists.', email);
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully.');

    // Insert new user into database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, phone || null, password_hash] // Use null if phone is not provided
    );
    console.log('New user created in database:', newUser.rows[0]);

    res.status(201).json({ message: 'Signup successful', user: newUser.rows[0] });
    global.loggedInUserId = newUser.rows[0].id; // Store user ID for subsequent requests
  } catch (error) {
    console.error('Error during signup:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email });

  try {
    // Find user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      console.log('Login failed: User not found.', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log('Login failed: Incorrect password.', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user.email);
    global.loggedInUserEmail = user.email;
    global.loggedInUserId = user.id; // Store user ID for subsequent requests
    // Return user data (excluding password hash)
    const { password_hash, ...userData } = user;
    res.status(200).json({ message: 'Login successful', user: userData });

  } catch (error) {
    console.error('Error during login:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  me: async (req, res) => {
    if (!global.loggedInUserEmail) {
      return res.status(401).json({ message: 'No user logged in.' });
    }
    try {
      const userResult = await pool.query('SELECT id, name, email, phone, plan, credits FROM users WHERE email = $1', [global.loggedInUserEmail]);
      const user = userResult.rows[0];
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user profile:', error.message, error.stack);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getBirthdays: async (req, res) => {
    const user_id = global.loggedInUserId; // Get user_id from logged-in user

    if (!user_id) {
      console.log('Get Birthdays failed: User not logged in.');
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
      const result = await pool.query('SELECT * FROM birthdays WHERE user_id = $1 ORDER BY date ASC', [user_id]);
      console.log('Birthdays fetched from database:', result.rows);
      res.status(200).json({ birthdays: result.rows });
    } catch (error) {
      console.error('Error fetching birthdays:', error.message, error.stack);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
