console.log('Hello World!');

// Handle messages sent from the extension to the webview
window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    switch (message.command) {
        case 'update':
            document.body.innerText = message.text;
            break;
    }
});
