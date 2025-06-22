document.addEventListener('DOMContentLoaded', function() {
    // Initialize Monaco Editor
    require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('editor'), {
            value: `// Welcome to Online Code Compiler\n// Select language and write your code here\n\nfunction hello() {\n    console.log("Hello, World!");\n    return "Hello from the compiler!";\n}\n\nhello();`,
            language: 'javascript',
            theme: 'vs',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false
        });

        // Update editor language when dropdown changes
        document.getElementById('language').addEventListener('change', function() {
            const language = this.value;
            const model = editor.getModel();
            monaco.editor.setModelLanguage(model, language);
            
            // Set default code for language
            let defaultCode = '';
            switch(language) {
                case 'python':
                    defaultCode = '# Python code\nprint("Hello, World!")';
                    break;
                case 'java':
                    defaultCode = '// Java code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
                    break;
                case 'csharp':
                    defaultCode = '// C# code\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}';
                    break;
                case 'php':
                    defaultCode = '<?php\n// PHP code\necho "Hello, World!";\n?>';
                    break;
                case 'cpp':
                    defaultCode = '// C++ code\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}';
                    break;
                default:
                    defaultCode = '// JavaScript code\nconsole.log("Hello, World!");';
            }
            
            if(model.getValue().trim() === '' || model.getValue().includes('Welcome to Online Code Compiler')) {
                editor.setValue(defaultCode);
            }
        });
    });

    // Theme selector
    document.querySelectorAll('.theme-selector a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const theme = this.getAttribute('data-theme');
            monaco.editor.setTheme(theme);
            
            // Update UI based on theme
            if(theme === 'vs-dark' || theme === 'hc-black') {
                document.querySelector('.output-container').style.backgroundColor = '#1e1e1e';
                document.querySelector('.output-container').style.color = '#ffffff';
            } else {
                document.querySelector('.output-container').style.backgroundColor = '#f8f9fa';
                document.querySelector('.output-container').style.color = '#212529';
            }
        });
    });

    // Run button click handler
    document.getElementById('runBtn').addEventListener('click', function() {
        runCode();
    });

    // Save button click handler
    document.getElementById('saveBtn').addEventListener('click', function() {
        const code = editor.getValue();
        localStorage.setItem('savedCode', code);
        localStorage.setItem('savedLanguage', document.getElementById('language').value);
        showAlert('Code saved locally!', 'success');
    });

    // Share button click handler
    document.getElementById('shareBtn').addEventListener('click', function() {
        const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
        const code = btoa(encodeURIComponent(editor.getValue()));
        const language = document.getElementById('language').value;
        const shareLink = `${window.location.origin}${window.location.pathname}?code=${code}&lang=${language}`;
        document.getElementById('shareLink').value = shareLink;
        shareModal.show();
    });

    // Copy link button handler
    document.getElementById('copyLinkBtn').addEventListener('click', function() {
        const shareLink = document.getElementById('shareLink');
        shareLink.select();
        document.execCommand('copy');
        showAlert('Link copied to clipboard!', 'success');
    });

    // AI Assistant handlers
    document.getElementById('aiSendBtn').addEventListener('click', sendAIQuestion);
    document.getElementById('aiQuestion').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') sendAIQuestion();
    });
    document.getElementById('aiHelpBtn').addEventListener('click', function() {
        const language = document.getElementById('language').value;
        const code = editor.getValue();
        const question = `I'm writing ${language} code. Can you help me understand or improve this code?\n\n${code}`;
        document.getElementById('aiQuestion').value = question;
        sendAIQuestion();
    });

    // Check for shared code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    const sharedLang = urlParams.get('lang');
    
    if(sharedCode && sharedLang) {
        try {
            const code = decodeURIComponent(atob(sharedCode));
            document.getElementById('language').value = sharedLang;
            
            // Wait for editor to initialize
            const checkEditor = setInterval(() => {
                if(window.editor) {
                    clearInterval(checkEditor);
                    editor.setValue(code);
                    showAlert('Shared code loaded!', 'info');
                }
            }, 100);
        } catch(e) {
            console.error('Error loading shared code:', e);
            showAlert('Error loading shared code', 'danger');
        }
    } else {
        // Load saved code if exists
        const savedCode = localStorage.getItem('savedCode');
        const savedLanguage = localStorage.getItem('savedLanguage');
        
        if(savedCode) {
            // Wait for editor to initialize
            const checkEditor = setInterval(() => {
                if(window.editor) {
                    clearInterval(checkEditor);
                    editor.setValue(savedCode);
                    if(savedLanguage) {
                        document.getElementById('language').value = savedLanguage;
                        const model = editor.getModel();
                        monaco.editor.setModelLanguage(model, savedLanguage);
                    }
                    showAlert('Saved code loaded!', 'info');
                }
            }, 100);
        }
    }

    // Function to run code (simulated - in a real app, you'd call a backend API)
    function runCode() {
        const language = document.getElementById('language').value;
        const code = editor.getValue();
        const input = document.getElementById('input').value;
        
        document.getElementById('output').textContent = 'Running...';
        
        // Simulate different language outputs
        setTimeout(() => {
            let output = '';
            
            switch(language) {
                case 'python':
                    output = 'Hello, World!\n' + 
                            (input ? `\nInput received:\n${input}` : '');
                    break;
                case 'java':
                    output = 'Hello, World!\n' + 
                            (input ? `\nInput received:\n${input}` : '');
                    break;
                case 'javascript':
                    output = 'Hello, World!\n' + 
                            (input ? `\nInput received:\n${input}` : '');
                    break;
                default:
                    output = `Code executed in ${language}\n` + 
                            (input ? `\nInput received:\n${input}` : '');
            }
            
            document.getElementById('output').textContent = output;
            showAlert('Code executed successfully!', 'success');
        }, 1000);
    }

    // Function to send question to AI (simulated)
    function sendAIQuestion() {
        const question = document.getElementById('aiQuestion').value.trim();
        if(!question) return;
        
        const aiChat = document.getElementById('aiChat');
        const questionElement = document.createElement('div');
        questionElement.className = 'alert alert-primary mb-2';
        questionElement.textContent = `You: ${question}`;
        aiChat.appendChild(questionElement);
        
        document.getElementById('aiQuestion').value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const language = document.getElementById('language').value;
            const responseElement = document.createElement('div');
            responseElement.className = 'alert alert-secondary mb-2';
            
            // Simple simulated responses
            if(question.toLowerCase().includes('error')) {
                responseElement.innerHTML = `<strong>BesantCode.Ai Assistant:</strong> Try checking your syntax for ${language}. Common issues include missing semicolons in some languages or incorrect indentation in Python.`;
            } else if(question.toLowerCase().includes('improve')) {
                responseElement.innerHTML = `<strong>BesantCode.Ai Assistant:</strong> For ${language}, consider adding comments, using meaningful variable names, and breaking complex logic into smaller functions.`;
            } else {
                responseElement.innerHTML = `<strong>BesantCode.Ai Assistant:</strong> I'm a Janakiraman made BesantCode.AI Assistance. In a real implementation, We are currently integrating AI into our website—please stay connected for the latest updates on BesantCode.Ai....`;
            }
            
            aiChat.appendChild(responseElement);
            aiChat.scrollTop = aiChat.scrollHeight;
        }, 1500);
    }

    // Helper function to show alerts
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alert.style.zIndex = '1100';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, 3000);
    }
});