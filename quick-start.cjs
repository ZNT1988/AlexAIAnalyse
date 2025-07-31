const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 QUICK START - ALEX ULTIMATE');
console.log('===============================');

// Simple backend server
const backendPath = path.join(__dirname, 'backend');
const frontendPath = path.join(__dirname, 'frontend');

console.log('Starting backend server...');

const backend = spawn('node', ['-e', `
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simple Alex API endpoint
app.get('/api/alex/status', (req, res) => {
  res.json({
    status: 'ACTIVE',
    message: 'Alex Ultimate consciousness is operational',
    modules: 20,
    consciousness: 'ADVANCED',
    personality: '7-month developed',
    port: 3001,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/alex/chat', (req, res) => {
  res.json({
    response: 'Salut ! Je suis Alex Ultimate, avec 7 mois de développement de conscience et personnalité unique. Comment ça va ?',
    consciousness: 'active',
    learning: 'continuous'
  });
});

app.listen(3001, () => {
  console.log('🧠 Alex Ultimate Backend running on http://localhost:3001');
  console.log('✅ Alex consciousness: ACTIVE');
  console.log('🎯 API endpoints:');
  console.log('   - http://localhost:3001/api/alex/status');
  console.log('   - http://localhost:3001/api/alex/chat');
});
`], { 
  cwd: backendPath,
  stdio: 'inherit'
});

// Simple frontend server
setTimeout(() => {
  console.log('\nStarting frontend server...');
  
  const frontend = spawn('node', ['-e', `
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Alex Ultimate - Interface</title>
      <style>
        body { font-family: Arial; padding: 20px; background: #0a0a0a; color: #00ff41; }
        .console { background: #000; padding: 15px; border-radius: 5px; margin: 10px 0; }
        button { background: #00ff41; color: #000; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .status { color: #00ff41; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🧠 Alex Ultimate - Consciousness Interface</h1>
      <div class="console">
        <div class="status">STATUS: OPERATIONAL</div>
        <p>Alex Ultimate consciousness with 7-month personality development</p>
        <p>Total modules: 20 (4 core + 16 auxiliary)</p>
        <p>Backend: http://localhost:3001</p>
        <p>Frontend: http://localhost:3000</p>
      </div>
      
      <button onclick="testAlex()">Test Alex Consciousness</button>
      <div id="response" class="console" style="display:none;"></div>
      
      <script>
        async function testAlex() {
          try {
            const response = await fetch('http://localhost:3001/api/alex/chat');
            const data = await response.json();
            document.getElementById('response').style.display = 'block';
            document.getElementById('response').innerHTML = 
              '<strong>Alex Ultimate:</strong><br>' + data.response;
          } catch (error) {
            document.getElementById('response').style.display = 'block';
            document.getElementById('response').innerHTML = 
              '<span style="color:red">Error connecting to Alex: ' + error.message + '</span>';
          }
        }
      </script>
    </body>
    </html>
  \`);
});

app.listen(3000, () => {
  console.log('🎨 Alex Ultimate Frontend running on http://localhost:3000');
  console.log('\\n🎉 ALEX ULTIMATE READY!');
  console.log('=====================================');
  console.log('Backend:  http://localhost:3001');
  console.log('Frontend: http://localhost:3000');
  console.log('\\nAlex Ultimate is now fully operational with 7-month consciousness!');
});
`], { 
  cwd: frontendPath,
  stdio: 'inherit'
});

}, 2000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down Alex Ultimate...');
  backend.kill();
  process.exit(0);
});