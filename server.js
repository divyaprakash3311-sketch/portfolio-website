const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware configuration
app.use(express.json());
app.use(cors());

// 1. MongoDB Cluster Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('⚡ [Database] Connected safely to MongoDB Cluster.'))
  .catch(err => console.error('❌ [Database] Connection failed:', err));

// 2. Database Schema Design for Incoming Transmissions
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// 3. API Endpoint to Log Contact Inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Simple validation block
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All parameters are required.' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ 
      success: true, 
      message: '[SUCCESS] Form data securely logged to cloud database cluster.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error.' });
  }
});

// 4. Start Server Node
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 [Server] Core operational on port ${PORT}`));