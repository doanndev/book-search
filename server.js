// server.js
const express = require('express');
const cors = require('cors');
const client = require('./lib/elasticsearch');
const createIndex = require('./lib/createIndex')
const bulkData = require('./lib/bulkData')


const app = express();
const port = 3001;

app.use(cors()); // Cho phép Next.js frontend kết nối

app.get('/', async(req,res) => {
    return res.json({message: "server running at port 3001"})
})
app.get('/api/createIndex', async( req,res) => {
    createIndex()
    return res.json({message: "check console.log"})
})

app.get('./api/bulkData', async (req,res) => {
    bulkData()
    return res.json({message: "check console.log"})
})

app.get('/api/search', async (req, res) => {
  const {query} = req.query; 
  

  if (!query) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  try {
    const result = await client.search({
      index: 'books', 
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title', 'author', 'description'], 
          },
        },
      },
    });

    const books = result.hits.hits.map((hit) => hit._source);
    console.log(books);
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search failed', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
