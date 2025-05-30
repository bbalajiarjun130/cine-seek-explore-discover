const fs = require('fs');

// Read the original file
const rawData = fs.readFileSync('csvjson.json', 'utf-8');
const data = JSON.parse(rawData);

// Transform genre and actors fields
data.forEach(movie => {
  if (typeof movie.genre === 'string') {
    movie.genre = movie.genre.split(',').map(g => g.trim());
  }

  if (typeof movie.actors === 'string') {
    movie.actors = movie.actors.split(',').map(a => a.trim());
  }
});

// Write to a new JSON file
fs.writeFileSync('updated_csvjson.json', JSON.stringify(data, null, 2));

console.log('Updated file saved as updated_csvjson.json');