
const  db = require('../../services/database/mysql'); 
const redisClient = require('../../services/database/redis');

// Storing a key-value pair in Redis
async function storeData(req, res) {
  try {
    await redisClient.set('key', 'value');
    res.send('Data stored in Redis');
  } catch (err) {
    console.error('Error storing data:', err);
    res.status(500).send('Error storing data in Redis');
  }
}

// Updating stream details
const updateStream = async (req, res) => {
    const streamId = req.params.id;

    // Destructure and validate required fields
    const {
        stream_id, stream_name, created_on, url, user_id, institute_id, status,
        deleted_at = null, created_at, updated_at
    } = req.body;

    // Validate required fields
    if (!stream_name || !user_id || !institute_id || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
        UPDATE streams
        SET stream_id = ?, stream_name = ?, created_on = ?, url = ?, user_id = ?, institute_id = ?, status = ?, deleted_at = ?, created_at = ?, updated_at = ?
        WHERE stream_id = ?
    `;

    try {
        // Execute the MySQL query
        const [result] = await db.query(query, [
            stream_id, stream_name, created_on, url, user_id, institute_id, status,
            deleted_at, created_at, updated_at, streamId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Stream not found' });
        }

        // Optionally update Redis cache after successful update
        await redisClient.set(`stream:${streamId}`, JSON.stringify(req.body));

        return res.status(200).json({ message: 'Stream updated successfully' });
    } catch (err) {
        console.error('Error updating stream:', err.message);
        return res.status(500).json({ message: 'Database error', error: err.message });
    }
};

module.exports = { 
  updateStream,
  storeData
};
