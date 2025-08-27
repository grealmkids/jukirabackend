
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
  me: (req, res) => {
    // For now, return a mock user. In a real app, this would fetch the authenticated user's data.
    res.status(200).json({ user: { name: 'Mock User', email: 'mock@example.com', credits: 99 } });
  },
  getBirthdays: (req, res) => {
    // For now, return mock birthdays. In a real app, this would fetch birthdays for the authenticated user.
    res.status(200).json({
      birthdays: [
        {
          id: 1,
          name: 'Backend John',
          date: '2025-09-15',
          photoUrl: 'https://i.pravatar.cc/150?u=backendjohn',
          daysUntil: 0,
          category: 'Friend'
        },
        {
          id: 2,
          name: 'Backend Jane',
          date: '2025-10-01',
          photoUrl: 'https://i.pravatar.cc/150?u=backendjane',
          daysUntil: 0,
          category: 'Family'
        }
      ]
    });
  }
};
