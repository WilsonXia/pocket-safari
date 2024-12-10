const { random } = require('underscore');
const { chooseRandom, copyArray } = require('./helper');

let grid = [];
const gridSize = 3;
const numOfAnimals = 3;

let hiddenAnimals = [];
let hidingSpots = [];
let capturedAnimals = [];

let tries = 0;

// Game Logic
const setUpGrid = () => {
    // Clear grid
    grid = [];
    let totalSpaces = gridSize * gridSize;
    // Refresh the list of possible hiding spots
    for(let i = 0; i < totalSpaces; i++){
        grid.push(i);
    }

    // Fill hiding spots
    for(let i = 0; i < numOfAnimals + tries; i++){
        hidingSpots.push(createHidingSpot());
    }
}

const createHidingSpot = () => {
    // Get a random spot from the grid
    let spot = chooseRandom(grid);
    // filter that spot out of the possible hiding spots
    grid = grid.filter(s => s !== spot);
    return spot;
}

// Coin Flip
const coinFlip = () => {
    return (random(1) === 0);
}

const getRarity = (flips) => {
    let sum = 0;
    for (let i = 0; i < flips; i++) {
        sum += coinFlip();
    }
    console.log(`Sum: ${sum}`);
    return sum;
}

const pickAnimal = (animals, flips) => {
    const rarity = getRarity(flips);
    let filtered = animals.filter(animal => animal.rarity === rarity);
    // Make sure that if there isn't an animal of that rarity, return a lower rarity animal
    if (filtered.length === 0) {
        filtered = animals.filter(animal => animal.rarity <= rarity);
    }
    return chooseRandom(filtered);
}

const generateAnimals = async () => {
    // Get the full list of animals
    const response = await fetch('/getAnimals');
    const data = await response.json();    
    // Clear hiddenAnimals
    hiddenAnimals = [];
    // Pick an animal
    for(let i = 0; i < numOfAnimals; i++){
        let coinFlips = 4;
        // Make the last iteration luckier
        if( i === numOfAnimals - 1){
            coinFlips += 1;
        }
        hiddenAnimals.push(pickAnimal(data.animals, coinFlips));
    }
}

const matchAnimalsToSpot = () => {
    console.log('hiding spots before:');
    console.log(hidingSpots);
    // let spots = copyArray(hidingSpots);
    let spots = [...hidingSpots];
    hiddenAnimals = hiddenAnimals.map(
        animal => {
            // Obtain a random hiding spot
            let spot = chooseRandom(spots);
            spots = spots.filter(s => s !== spot);
            return {
                animal,
                spot,
            }
        }
    )
}

// const inspectSpot = (spot) => {

//     if(hiddenAnimals.filter(anim => anim.spot === spot)){
//         return 
//     }
// }

const initGame = async () => {
    // Give 3 tries
    tries = 3;
    // Set up Grid
    setUpGrid();
    // Pick 3 Animals according to rarity
    await generateAnimals();
    // Match an animal to a hiding spot
    matchAnimalsToSpot();
    console.log(hiddenAnimals);
    console.log(hidingSpots);
}

module.exports = {
    initGame,
    gridSize,
    hidingSpots,
}