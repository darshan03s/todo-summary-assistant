import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendSlackMessage, summarizeTodos } from './utils.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!supabaseUrl || !supabaseServiceRoleKey || !slackWebhookUrl) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY or SLACK_WEBHOOK_URL in environment variables.');
    process.exit(1);
}
const supabaseBackend = createClient(supabaseUrl, supabaseServiceRoleKey);

app.use(cors());
app.use(express.json());

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    try {
        const { data: { user }, error } = await supabaseBackend.auth.getUser(token);

        if (error || !user) {
            console.error('JWT verification error:', error);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authenticateToken middleware:', error);
        return res.status(500).json({ message: 'Internal server error during token verification.' });
    }
};

app.get('/', (req, res) => {
    res.json({ message: 'Ai Todo Summarizer API' });
});

app.get('/api/todos', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabaseBackend
            .from('user_todos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching todos from Supabase backend:', error);
            return res.status(500).json({ message: 'Error fetching todos.', error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error in /api/todos route:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/api/todos', authenticateToken, async (req, res) => {
    try {
        const { todo_id, title, completed } = req.body;
        const userId = req.user.id;

        const { data, error } = await supabaseBackend
            .from('user_todos')
            .insert({
                user_id: userId,
                todo_id,
                title,
                completed,
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding todo to Supabase backend:', error);
            return res.status(500).json({ message: 'Error adding todo.', error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error in /api/todos route:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.delete('/api/todos', authenticateToken, async (req, res) => {
    try {
        const { todo_id } = req.body;
        const userId = req.user.id;

        const { error } = await supabaseBackend
            .from('user_todos')
            .delete()
            .eq('todo_id', todo_id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting todo from Supabase backend:', error);
            return res.status(500).json({ message: 'Error deleting todo.', error: error.message });
        }

        res.status(200).json({ message: 'Todo deleted successfully.' });
    } catch (error) {
        console.error('Error in /api/todos route:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.put('/api/todos', authenticateToken, async (req, res) => {
    try {
        const { todo_id, title } = req.body;
        const userId = req.user.id;

        const { data, error } = await supabaseBackend
            .from('user_todos')
            .update({
                title,
            })
            .eq('todo_id', todo_id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating todo from Supabase backend:', error);
            return res.status(500).json({ message: 'Error updating todo.', error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error in /api/todos route:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.put('/api/toggle-todo', authenticateToken, async (req, res) => {
    try {
        const { todo_id } = req.body;
        const userId = req.user.id;

        const { data: currentTodo, error: fetchError } = await supabaseBackend
            .from('user_todos')
            .select('completed')
            .eq('todo_id', todo_id)
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching todo for toggle:', fetchError);
            return res.status(500).json({ message: 'Error fetching todo for toggle.', error: fetchError.message });
        }

        if (!currentTodo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        const { data, error } = await supabaseBackend
            .from('user_todos')
            .update({
                completed: !currentTodo.completed,
            })
            .eq('todo_id', todo_id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error toggling todo from Supabase backend:', error);
            return res.status(500).json({ message: 'Error toggling todo.', error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error in /api/todos route:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.post('/api/summarize', async (req, res) => {
    const { todos } = req.body;
    let summary = await summarizeTodos(todos);
    summary = `Todos Summarized at ${new Date().toLocaleString()}\n\n ${summary}`;
    const slackResponse = await sendSlackMessage(summary, slackWebhookUrl);
    res.json({ summary, slackResponse });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;