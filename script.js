document.getElementById('encodeBtn').addEventListener('click', () => {
    let input = document.getElementById('inputString').value;
    if (!input.trim()) {
        alert('Please enter text to encode');
        return;
    }
    let output = btoa(input);
    document.getElementById('outputString').value = output;
});

document.getElementById('decodeBtn').addEventListener('click', () => {
    let input = document.getElementById('outputString').value;
    if (!input.trim()) {
        alert('Please enter Base64 text to decode');
        return;
    }
    try {
        let output = atob(input);
        document.getElementById('outputString').value = output;
    } catch (error) {
        document.getElementById('outputString').value = "❌ Invalid Base64 format";
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    let output = document.getElementById('outputString').value;
    if (!output.trim()) {
        alert('Nothing to copy');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showCopyFeedback();
    }).catch(err => {
        alert('Failed to copy to clipboard');
    });
});

function showCopyFeedback() {
    const feedback = document.getElementById('copyFeedback');
    feedback.classList.add('show');
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}