// lib/createIndex.js
const esClient = require('./elasticsearch')

async function createIndex() {
  try {
    const indexExists = await esClient.indices.exists({ index: 'books' });

    if (!indexExists.body) {
      const response = await esClient.indices.create({
        index: 'books',
        body: {
            settings: {
                index: {
                  number_of_shards: 1,
                  number_of_replicas: 1,
                  max_ngram_diff: 7
                },
                analysis: {
                  filter: {
                    vietnamese_folding: {
                      type: "icu_folding"
                    }
                  },
                  tokenizer: {
                    ngram_tokenizer: {
                      type: "ngram",
                      min_gram: 3,
                      max_gram: 10,
                      token_chars: ["letter", "digit", "punctuation"]
                    },
                    edge_ngram_tokenizer: {
                      type: "edge_ngram",
                      min_gram: 2,
                      max_gram: 10,
                      token_chars: [
                        "letter",
                        "digit"
                      ]
                    }
                  },
                  analyzer: {
                    ngram_analyzer: {
                      type: "custom",
                      tokenizer: "ngram_tokenizer",
                      filter: ["lowercase", "vietnamese_folding"],
    
                    },
                    edge_ngram_analyzer: {
                      type: "custom",
                      tokenizer: "edge_ngram_tokenizer",
                      filter: [
                        "lowercase"
                      ]
                    },
                    keyword_analyzer: {
                      type: "custom",
                      tokenizer: "keyword",
                      filter: ["lowercase", "vietnamese_folding"],
                    }
                  }
                }
              },
          mappings: {
            properties: {
              title: { type: 'text' },
              author: { type: 'text' },
              description: { type: 'text' },
              published_date: { type: 'date' }
            }
          }
        }
      });

      console.log('Index created:', response);
    } else {
      console.log('Index already exists');
    }
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

module.exports = createIndex
