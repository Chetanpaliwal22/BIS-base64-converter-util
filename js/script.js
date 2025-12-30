// Safe selector helper
function $(id) { return document.getElementById(id); }

// --- Base64 utility (works on index.html) ---
const encodeBtn = $('encodeBtn');
if (encodeBtn) {
    encodeBtn.addEventListener('click', () => {
        let input = $('inputString').value;
        if (!input.trim()) { alert('Please enter text to encode'); return; }
        // handle Unicode
        let output = btoa(unescape(encodeURIComponent(input)));
        $('outputString').value = output;
    });
}

const decodeBtn = $('decodeBtn');
if (decodeBtn) {
    decodeBtn.addEventListener('click', () => {
        let input = $('inputString').value;
        if (!input.trim()) { alert('Please enter Base64 text to decode'); return; }
        try {
            let output = decodeURIComponent(escape(atob(input)));
            $('outputString').value = output;
        } catch (error) {
            $('outputString').value = "❌ Invalid Base64 format";
        }
    });
}

const copyBtn = $('copyBtn');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        let output = $('outputString').value;
        if (!output.trim()) { alert('Nothing to copy'); return; }
        navigator.clipboard.writeText(output).then(() => showCopyFeedback()).catch(() => alert('Failed to copy to clipboard'));
    });
}

function showCopyFeedback() {
    const feedback = $('copyFeedback');
    if (!feedback) return;
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 2000);
}

// --- JWT utility helpers ---
function base64UrlEncode(str) {
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(b64url) {
    try {
        let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        return decodeURIComponent(escape(atob(b64)));
    } catch (e) {
        return null;
    }
}

function arrayBufferToBase64Url(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function signHS256(message, secret) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
    return arrayBufferToBase64Url(sig);
}

// JWT page listeners (if present)
const jwtDecodeBtn = $('jwtDecodeBtn');
if (jwtDecodeBtn) {
    jwtDecodeBtn.addEventListener('click', () => {
        const token = $('jwtInput').value.trim();
        if (!token) { alert('Please enter a JWT'); return; }
        const parts = token.split('.');
        if (parts.length < 2) { $('jwtDecoded').value = '❌ Invalid JWT format'; return; }
        const header = base64UrlDecode(parts[0]);
        const payload = base64UrlDecode(parts[1]);
        $('jwtDecoded').value = `Header:\n${header ? JSON.stringify(JSON.parse(header), null, 2) : 'Invalid'}\n\nPayload:\n${payload ? JSON.stringify(JSON.parse(payload), null, 2) : 'Invalid'}\n\nSignature:\n${parts[2] || ''}`;
    });
}

const jwtEncodeBtn = $('jwtEncodeBtn');
if (jwtEncodeBtn) {
    jwtEncodeBtn.addEventListener('click', async () => {
        let headerText = $('jwtHeader').value.trim() || '{"alg":"HS256","typ":"JWT"}';
        let payloadText = $('jwtPayload').value.trim() || '{}';
        let secret = $('jwtSecret').value;
        try {
            const headerObj = JSON.parse(headerText);
            const payloadObj = JSON.parse(payloadText);
            const headerB64 = base64UrlEncode(JSON.stringify(headerObj));
            const payloadB64 = base64UrlEncode(JSON.stringify(payloadObj));
            let signature = '';
            if (secret) {
                signature = await signHS256(`${headerB64}.${payloadB64}`, secret);
            }
            const token = `${headerB64}.${payloadB64}.${signature}`;
            $('jwtOutput').value = token;
        } catch (e) {
            alert('Header or Payload is not valid JSON');
        }
    });
}

const copyJwtBtn = $('copyJwtBtn');
if (copyJwtBtn) {
    copyJwtBtn.addEventListener('click', () => {
        const out = $('jwtOutput').value;
        if (!out.trim()) { alert('Nothing to copy'); return; }
        navigator.clipboard.writeText(out).then(() => showCopyFeedback()).catch(() => alert('Failed to copy'));
    });
}

const copyDecodedBtn = $('copyDecodedBtn');
if (copyDecodedBtn) {
    copyDecodedBtn.addEventListener('click', () => {
        const out = $('jwtDecoded').value;
        if (!out.trim()) { alert('Nothing to copy'); return; }
        navigator.clipboard.writeText(out).then(() => showCopyFeedback()).catch(() => alert('Failed to copy'));
    });
}

// --- Navigation UX: set active nav link ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        const links = Array.from(document.querySelectorAll('.util-nav .nav-link'));
        if (!links.length) return;
        const current = window.location.pathname.split('/').pop() || 'index.html';
        links.forEach(a => {
            const href = a.getAttribute('href') || '';
            const name = href.split('/').pop();
            if (name === current || (name === 'index.html' && (current === '' || current === 'index.html'))) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
            // add keyboard-friendly role
            a.setAttribute('role', 'button');
        });
    } catch (e) {
        // no-op
    }
});