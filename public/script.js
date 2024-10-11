let handlebarsValues = {};

// Dummy product data from DummyJSON, using the Image API
const dummyProduct = {
    brandUrl: "https://example.com",
    brandLogo: "https://dummyjson.com/image/150",  // Thumbnail image for the brand
    productImage: "https://dummyjson.com/image/600x400",  // Custom product image
    productTitle: "Awesome Product",
    productDescription: "This is an amazing product you should buy.",
    productPrice: "199.99",
    productUrl: "https://example.com/product",
};

// Initialize CodeMirror for the code editor
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    lineNumbers: true,
    mode: 'htmlmixed',
    theme: 'material'
});

// Function to update the live preview by compiling the Handlebars template with values
function updateLivePreview(template) {
    const compiledTemplate = Handlebars.compile(template);
    const renderedHtml = compiledTemplate(handlebarsValues);  // Replace Handlebars keys with values
    const iframe = document.getElementById('live-preview');
    iframe.srcdoc = renderedHtml;  // Rendered HTML in the preview
}

// Function to extract valid Handlebars keys (ignores Handlebars helpers like #if, else)
function extractHandlebarsKeys(template) {
    const regex = /{{(?!#|\/|else)(.*?)}}/g;  // Match any {{key}} pattern except for helpers (e.g., #if, /if, else)
    let match;
    let foundKeys = [];

    while ((match = regex.exec(template)) !== null) {
        const key = match[1].trim();
        if (key && !handlebarsValues[key]) {
            handlebarsValues[key] = dummyProduct[key] || "Placeholder";  // Use dummy data or fallback to "Placeholder"
        }
        foundKeys.push(key);  // Keep track of found keys
    }

    // Remove any keys that are no longer in the template
    for (let existingKey in handlebarsValues) {
        if (!foundKeys.includes(existingKey)) {
            delete handlebarsValues[existingKey];
        }
    }

    updateHandlebarsValuesSection();  // Update UI with the new key-value pairs
}

// Update the list of Handlebars values in the UI
function updateHandlebarsValuesSection() {
    const valuesList = document.getElementById('handlebars-values-list');
    valuesList.innerHTML = '';

    for (const [key, value] of Object.entries(handlebarsValues)) {
        const keyValueElement = document.createElement('div');
        keyValueElement.classList.add('flex', 'justify-between', 'items-center', 'mb-2');

        const keyElement = document.createElement('input');
        keyElement.type = 'text';
        keyElement.value = key;
        keyElement.classList.add('text-black', 'p-2', 'w-1/2');
        keyElement.disabled = true;

        const valueElement = document.createElement('input');
        valueElement.type = 'text';
        valueElement.value = value;
        valueElement.classList.add('text-black', 'p-2', 'w-1/2');
        valueElement.addEventListener('input', (e) => {
            handlebarsValues[key] = e.target.value;
            updateLivePreview(editor.getValue());  // Re-render preview when values are updated
        });

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.classList.add('bg-red-500', 'hover:bg-red-400', 'text-white', 'py-2', 'px-4', 'rounded', 'ml-2');
        removeButton.addEventListener('click', () => {
            delete handlebarsValues[key];
            updateHandlebarsValuesSection();
            updateLivePreview(editor.getValue());  // Re-render preview when values are removed
        });

        keyValueElement.appendChild(keyElement);
        keyValueElement.appendChild(valueElement);
        keyValueElement.appendChild(removeButton);
        valuesList.appendChild(keyValueElement);
    }
}

// Function to handle changes in the code editor and extract Handlebars keys
editor.on('change', () => {
    const template = editor.getValue();
    extractHandlebarsKeys(template);  // Automatically pull keys from the HTML
    updateLivePreview(template);  // Update the live preview
});

// Load the initial template from the server
let initialTemplate = '';
fetch('example-email.html')
    .then(response => response.text())
    .then(template => {
        initialTemplate = template;
        editor.setValue(template);
        updateLivePreview(template);
        extractHandlebarsKeys(template);  // Extract Handlebars keys from the loaded template
    });

// Add a message to the chat log
function addToChatLog(message, sender) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === 'user' ? 'text-green-400' : 'text-blue-400');
    messageElement.textContent = `${sender === 'user' ? 'User' : 'AI'}: ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Show or hide the loading spinner
function showSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    const codeEditorSection = document.getElementById('code-editor-section');
    if (show) {
        spinner.style.display = 'inline-block';
        codeEditorSection.classList.add('hidden');
    } else {
        spinner.style.display = 'none';
        codeEditorSection.classList.remove('hidden');
    }
}

// Submit chat input and make an AI request
document.getElementById('chat-submit').addEventListener('click', async () => {
    const userInput = document.getElementById('chat-input').value;
    if (!userInput) return;

    addToChatLog(userInput, 'user');
    showSpinner(true);

    const template = editor.getValue();

    // Send the handlebars keys along with the template
    const response = await fetch('/ai-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userInput,
            template,
            handlebarsKeys: Object.keys(handlebarsValues)  // Send only keys, as required
        })
    });

    const data = await response.json();
    showSpinner(false);

    if (data.success) {
        editor.setValue(data.updatedTemplate);
        updateLivePreview(data.updatedTemplate);
        addToChatLog("Here is your updated template.", 'AI');
    } else {
        addToChatLog("Something went wrong. Please try again.", 'AI');
    }

    document.getElementById('chat-input').value = '';
});

// Export the code from the editor
document.getElementById('export-code').addEventListener('click', () => {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated-email-template.html';
    link.click();
});

// Reset the template in the editor and preview
document.getElementById('reset-template').addEventListener('click', () => {
    editor.setValue(initialTemplate);
    updateLivePreview(initialTemplate);
    extractHandlebarsKeys(initialTemplate);  // Re-extract Handlebars keys after reset
    addToChatLog('Template has been reset to its original state.', 'AI');
});
