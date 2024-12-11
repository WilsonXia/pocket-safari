const helper = require('./helper.js');
const Game = require('./gameLogic.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const closeAd = () => {
    const popupAd = document.getElementById('popupAd');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const results = document.getElementById('results');
    popupAd.classList.add('hidden');
    endScreen.classList.add('hidden');
    results.classList.remove('hidden');
    // Reveal Game screen
    gameScreen.classList.remove('hidden');
    Game.extraTry();
}

const openAd = () => {
    const popupAd = document.getElementById('popupAd');
    const gameScreen = document.getElementById('gameScreen');
    const profitModel = document.getElementById('profit-model');
    const results = document.getElementById('results');

    profitModel.classList.add('hidden');
    gameScreen.classList.add('hidden');
    results.classList.add('hidden');
    popupAd.classList.remove('hidden');

    window.setTimeout(()=>{
        const exitAdBtn = document.getElementById('btn-exitAd');
        exitAdBtn.classList.remove('hidden');
    }, 2000)
}

// Components
const TryCounter = (props) => {
    return (
        <div id='tryCounter'>
            <p>Tries: {props.tries}</p>
        </div>
    );
}

const GameGrid = (props) => {
    const tileClick = (e) => {
        // Tell the Game to Inspect that tile
        Game.inspectSpot(e.target, props.setTries, props.setAnimals);
    }

    let tiles = [];
    for (let i = 0; i < props.gridSize; i++) {
        let newTile = <div className="tile" id={i}>{i + 1}</div>;
        // Create tiles, allow interaction for Hiding Spots
        const check = props.hidingSpots.find(spot => spot === i);
        if (check || check === 0) {
            newTile = <div className="tile hidingSpot" onClick={tileClick} id={i}>{i + 1}</div>;
        }
        tiles.push(newTile);
    }

    return (
        <div id='gameGrid'>
            {tiles}
        </div>
    );
}

const FoundAnimalsList = (props) => {
    if (props.foundAnimals.length === 0) {
        return (
            <div>
                <p>Nothing...</p>
            </div>
        );
    }

    let foundList = props.foundAnimals.map(
        anim => {
            return (<li>
                <p>{anim.name}</p>
            </li>);
        }
    );

    return (<ul id='foundAnimalList'>
        {foundList}
    </ul>);
}

const PopupAd = () => {
    return (
        <div id='popupAd' className='hidden'>
            <h1>This is an Advertisement.</h1>
            <button id='btn-exitAd' className='hidden' onClick={closeAd}>
                Close
            </button>
        </div>
    )
}

const EndScreen = (props) => {
    return (
        <div id='endScreen' className='hidden'>
            <div id='results'>
                <h2>Excursion Complete!</h2>
                <section>
                    <p>You found: </p>
                    <FoundAnimalsList foundAnimals={props.foundAnimals} />
                </section>
                <section id='profit-model'>
                    <p>Want one more try?</p>
                    <button id='btn-viewAd' onClick={openAd}>
                        View Ad
                    </button>
                </section>
                <a href="/zoo"><button>Return to Zoo</button></a>
            </div>
            <PopupAd/>
        </div>
    )
}

const GameScreen = (props) => {
    const [tries, setTries] = useState(Game.tries);

    return (
        <div id='gameScreen'>
            <h1>Pick a spot!</h1>
            <TryCounter tries={tries} />
            <GameGrid setTries={setTries} setAnimals={props.setFoundAnimals} gridSize={Game.gridSize * Game.gridSize} hidingSpots={Game.hidingSpots} />
        </div>
    );
}

const App = () => {
    const [foundAnimals, setFoundAnimals] = useState([]);

    return (
        <div id='screens'>
            <GameScreen setFoundAnimals={setFoundAnimals}/>
            <EndScreen foundAnimals={foundAnimals}/>
        </div>
    );
}

const init = async () => {
    await Game.initGame();

    const root = createRoot(document.getElementById('game'));
    root.render(<App />);
}

window.onload = init;