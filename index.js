import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendEmailDynamicSMTP } from './mailer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Email API is running 📨');
});

app.post('/send-email', async (req, res) => {
  try {
    const { recipient, formData, ApiURL } = req.body;

    if (!recipient || !formData || !ApiURL) {
      return res.status(400).json({ success: false, message: 'Missing recipient or API URL or formData' });
    }

    await sendEmailDynamicSMTP(recipient, formData, ApiURL);

    res.json({ success: true, message: 'Email sent successfully ✅' });
  } catch (err) {
    console.error('EMAIL ERROR ❌:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
