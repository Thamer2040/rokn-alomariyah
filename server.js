const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 4173);
const projectRoot = __dirname;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'; connect-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'same-origin'
  });
  next();
});

function sendPublicFile(fileName) {
  return (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(projectRoot, fileName));
  };
}

app.get(['/', '/index.html'], sendPublicFile('index.html'));
app.get('/app.js', sendPublicFile('app.js'));
app.get('/tailwind-output.css', sendPublicFile('tailwind-output.css'));
app.use('/images', express.static(path.join(projectRoot, 'images'), {
  dotfiles: 'deny',
  index: false,
  maxAge: '7d',
  immutable: false
}));

app.use((req, res) => {
  res.status(404).type('text/plain').send('غير موجود');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`ركن العمارية is running on http://localhost:${port}`);
});
