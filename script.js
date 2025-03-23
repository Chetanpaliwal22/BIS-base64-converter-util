document.getElementById('encodeBtn').addEventListener('click', () => {
    let input = document.getElementById('inputString').value;
    let output = btoa(input);
    document.getElementById('outputString').value = output;
});

document.getElementById('decodeBtn').addEventListener('click', () => {
    let input = document.getElementById('outputString').value;
    try {
        let output = atob(input);
        document.getElementById('outputString').value = output;
    } catch (error) {
        document.getElementById('outputString').value = "Invalid Base64";
    }
});

document.getElementById('copyBtn').addEventListener('click', () => {
    let output = document.getElementById('outputString').value;
    navigator.clipboard.writeText(output).then(() => {
        // Optional: Add a brief visual confirmation here
    }).catch(err => {
        // Optional: Add error handling
    });
});