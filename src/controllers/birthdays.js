const pool = require('../db');

const addBirthday = async (req, res) => {
  const { name, date, category, photoUrl } = req.body;
  const user_id = global.loggedInUserId; // Get user_id from logged-in user

  if (!user_id) {
    console.log('Add Birthday failed: User not logged in.');
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  console.log('Add Birthday request received:', { name, date, category, photoUrl, user_id });

  try {
    const newBirthday = await pool.query(
      'INSERT INTO birthdays (user_id, celebrant_name, date, category, celebrant_photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *'
      ,
      [user_id, name, date, category, photoUrl || null]
    );
    console.log('New birthday added to database:', newBirthday.rows[0]);
    res.status(201).json({ message: 'Birthday added successfully', birthday: newBirthday.rows[0] });
  } catch (error) {
    console.error('Error adding birthday:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addBirthday,
  getBirthdayById: async (req, res) => {
    const { id } = req.params;
    const user_id = global.loggedInUserId; // Get user_id from logged-in user

    if (!user_id) {
      console.log('Get Birthday by ID failed: User not logged in.');
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
      const result = await pool.query('SELECT * FROM birthdays WHERE id = $1 AND user_id = $2', [id, user_id]);
      const birthday = result.rows[0];

      if (!birthday) {
        console.log(`Birthday with ID ${id} not found for user ${user_id}.`);
        return res.status(404).json({ message: 'Birthday not found.' });
      }

      console.log('Birthday fetched by ID:', birthday);
      res.status(200).json({ birthday });
    } catch (error) {
      console.error('Error fetching birthday by ID:', error.message, error.stack);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
