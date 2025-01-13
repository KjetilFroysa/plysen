const fs = require('fs');
const path = require('path');
const Wool = require('../classes/ullClass.js');

// Read the ullLager.json file
const ullLagerPath = path.join(__dirname, '../ullLager.json');
const ullLagerData = fs.readFileSync(ullLagerPath, 'utf8');
const ullLager = JSON.parse(ullLagerData);

// Create Wool objects from ullLager items
const woolObjects = ullLager.map(item => {
    const bildePath = `/img/${item.nummer}.jpg`; // Construct the image path dynamically
    return new Wool(item.navn, item.nummer, item.kvantitet, bildePath);
});

module.exports = woolObjects;