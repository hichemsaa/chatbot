const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.userMessage;
    console.log(req.body);

    // Debugging: Print the user message to ensure it's not null
    console.log('User Message:', userMessage);

    if (!userMessage || userMessage.trim() === "") {
        return res.status(400).send({ error: "Message content cannot be empty." });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage.trim() }],
            max_tokens: 50,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const botMessage = response.data.choices[0].message.content.trim();
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Something went wrong');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
