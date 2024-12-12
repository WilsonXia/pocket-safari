const { random } = require('underscore');
const { chooseRandom, sendPost, handleMessage, hideMessage } = require('./helper');

let grid = [];
const gridSize = 3;
const numOfAnimals = 3;

let hiddenAnimals = [];
let hidingSpots = [];
let foundAnimals = [];

let tries = 3;

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
    let sum = 1; // base rarity is 1
    for (let i = 0; i < flips; i++) {
        if(coinFlip()){
            sum++;
        }
    }
    return sum;
}

const pickAnimal = (animals, flips) => {
    const rarity = getRarity(flips);
    let filtered = animals.filter(animal => animal.rarity === rarity);
    // Make sure that if there isn't an animal of that rarity, return a lower rarity animal
    if (filtered.length === 0) {
        filtered = animals.filter(animal => animal.rarity <= rarity);
    }
    const anim = chooseRandom(filtered);
    return anim;
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

const inspectSpot = (element, setTries, setFound) => {
    // Check if we have tries left
    if(tries <= 0){
        console.log('out of tries');
        return;
    }
    // Check if the spot can be searched
    if(element.classList.contains('searched')){
        console.log('this has already been searched!');
        return;
    }
    // Continue with inspection
    const spot = parseInt(element.id, 10);
    // Find an animal in the spot
    let found = hiddenAnimals.find(a => a.spot === spot);
    // If not found, tell the user they found nothing.
    if(!found){
        element.classList.add('hide');
        handleMessage(`Nothing is there.`);
    } else {
        // Found the animal
        foundAnimals.push(found.animal);
        element.innerHTML = `<p class='has-text-centered'>${found.animal.name}</p>`;
        setFound([...foundAnimals]);
        handleMessage(`You found a ${found.animal.name}!`);
    }
    // Reflect changes
    tries--;
    element.classList.add('searched');
    element.classList.remove('hidingSpot');
    setTries(tries);
    // Check if the game ended
    if(tries <= 0){
        endGame();
    }
}

const extraTry = () => {
    // give 1 more try
    tries = 1;
    foundAnimals = [];
}

const endGame = async () => {
    // Post results
    await sendPost('/addZooAnimal', {animals: foundAnimals});
    window.setTimeout(()=>{
        // show the endScreen
        handleMessage('Game Over!');
        document.getElementById('endScreen').classList.remove('hidden');
    }, 1000)
}

const initGame = async () => {
    // Reset animals
    foundAnimals = [];
    // Give 3 tries
    tries = 3;
    // Set up Grid
    setUpGrid();
    // Pick 3 Animals according to rarity
    await generateAnimals();
    // Match an animal to a hiding spot
    matchAnimalsToSpot();
    handleMessage(`There are ${numOfAnimals} hidden animals!`);
}

module.exports = {
    initGame,
    inspectSpot,
    extraTry,
    gridSize,
    hidingSpots,
    tries,
    foundAnimals,
}