document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    const chatBox = document.getElementById('chat-box');

    if (!message) {
        alert("Message cannot be empty");
        return;
    }

    // Display user message
    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    messageInput.value = '';

    // Send message to server
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        // Display bot message
        chatBox.innerHTML += `<div><strong>Bot:</strong> ${data.message}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<div><strong>Error:</strong> Something went wrong.</div>`;
    }
});
