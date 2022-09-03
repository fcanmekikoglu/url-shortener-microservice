require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./src/models/url')
const validator = require('validator')
require('./src/db/db')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  try {
    const urlValidator = validator.isURL(req.body.url)

    if (urlValidator === false) {
      const invalid = { error: 'invalid url' }
      return res.json(invalid)
    }

    const foundUrl = await Url.findOne({original_url: req.body.url})
    if(foundUrl){
      const invalid = { error: `${foundUrl.original_url} exists at ${foundUrl.short_url}` }
      return res.json(invalid)
    }

    const urlToSave = new Url({ original_url: req.body.url })
    await urlToSave.save()

    res.status(201).send({ original_url: urlToSave.original_url, short_url: urlToSave.short_url })
  } catch (e) {
    res.status(400).send(`${e}`)
  }
})


app.get('/api/shorturl/:short', async (req, res, next) => {
  try {
    const foundUrl = await Url.findOne({short_url: req.params.short})
    
    
    console.log(foundUrl)
    res.redirect(foundUrl.original_url)
  } catch (e) {
    res.status(400).send(`${e}`)
  }
})




app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
