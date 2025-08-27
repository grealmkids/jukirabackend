const pool = require('../db');

const generateCard = async (req, res) => {
  const { birthday_id, message, theme } = req.body;
  console.log('Generate Card request received:', { birthday_id, message, theme });

  try {
    // Simulate AI generation - return mock image URLs
    const generated_image_url_1 = `https://via.placeholder.com/1024x1024.png/0000FF/FFFFFF?text=Card+1+for+${birthday_id}`;
    const generated_image_url_2 = `https://via.placeholder.com/1024x1024.png/FF0000/FFFFFF?text=Card+2+for+${birthday_id}`;

    // TODO: In a real app, store card details in the 'cards' table

    res.status(200).json({
      message: 'Cards generated successfully',
      cards: [
        { url: generated_image_url_1, id: 1 },
        { url: generated_image_url_2, id: 2 }
      ]
    });
  } catch (error) {
    console.error('Error generating card:', error.message, error.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  generateCard,
};
