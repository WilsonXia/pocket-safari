const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const Game = require('./gameLogic.js');

const closeAd = () => {
    const popupAd = document.getElementById('popupAd');
    popupAd.classList.add('hidden');
}

const openAd = () => {
    const popupAd = document.getElementById('popupAd');
    popupAd.classList.remove('hidden');
}

// Components
const GameGrid = (props) => {
    const tileClick = (e) => {
        // Tell the Game to Inspect that tile
        console.log(`${e.target.id} clicked!`);
    }

    let tiles = [];
    for(let i = 0; i < props.gridSize; i++){
        let newTile = <div className="tile" id={i}>{i+1}</div>;
        // Create tiles, allow interaction for Hiding Spots
        if(props.hidingSpots.find(spot => spot === i)){
            newTile = <div className="tile" onClick={tileClick} id={i}>{i+1}</div>;
        }
        tiles.push(newTile);
    }

    return (
        <div>
            <h1>Pick a spot!</h1>
            <div id='gameGrid'>
                {tiles}
            </div>
        </div>
    );
}

const FoundAnimalsList = (props) => {
    const {found, setFound} = useState(props.foundAnimals);

    if(found.length === 0){
        return (
            <div>
                <p>Nothing...</p>
            </div>
        );
    }

    let foundList = found.map(
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
        <div id='popupAd'>
            <h1>This is an Advertisement.</h1>
            <button onClick={closeAd}>
                Close
            </button>
        </div>
    )
}

const EndScreen = () => {
    return (
        <div id='results'>
            <h2>Excursion Complete!</h2>
            <section>
                <p>You found: </p>
                <FoundAnimalsList/>
            </section>
            <section>
                <p>Want one more try?</p>
                <button id='btn-viewAd'>View Ad</button>
            </section>
            <button>Return to Zoo</button>
        </div>
    )
}


const init = async () => {
    await Game.initGame();
    const root = createRoot(document.getElementById('game'));
    root.render(<GameGrid gridSize={Game.gridSize * Game.gridSize} hidingSpots={Game.hidingSpots}/>);

}

window.onload = init;