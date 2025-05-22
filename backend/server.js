import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { summarizeTodos } from './utils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Leucine API' });
});

app.post('/api/summarize', async (req, res) => {
    const { todos } = req.body;
    const summary = await summarizeTodos(todos);
    res.json({ summary });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
