require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns'); 
const bodyParser = require('body-parser'); 
const { isReadable } = require('stream');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Echo test server
app.get('/api/echo/:input', (req, res) => {
  let input = req.params.input; 
  if (input == "")
    res.json({ echo: 'To echo <str>, enter url /api/echo/<str>' });
  else 
    res.json({ echo: input })
});

// Helper functions
function isValidURL(url_str) {
  if (typeof url_str != "string" && !(x instanceof String)) 
    return false; 

  let URL_obj; 
  try {
    URL_obj = new URL(url_str); 
  } catch(err) {
    return false; 
  }
  if (URL_obj.protocol != "http:" && URL_obj.protocol != "https:")
    return false; 

  dns.lookup(URL_obj.hostname, (err, address) => {
    if (err) return false;
  }); 
  
  return true; 
}

// Temporary DB
let savedUrls = []; 

// Process requests
app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;  // find corresponding html tag --> "name=url"
  if (isValidURL(url)) {
    if (!savedUrls.includes(url))
      savedUrls.push(url); 
    res.json({
      original_url: url, 
      short_url: savedUrls.findIndex((x) => x == url) 
    }); 
  }
  else 
    res.json({ error: 'invalid url' });
}); 

app.get('/api/shorturl/:id', (req, res) => {
  let id = req.params.id; 
  console.log('requesting url shortened with', id); 
  console.log('bruh', savedUrls); 
  console.log('redirecting to', savedUrls[id]); 
  // res.send('always return something, otherwise you might timeout'); 
  res.redirect(savedUrls[id]);
}); 

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
