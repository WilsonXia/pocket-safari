const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleAddZooAnimal = (e, handler) => {
    // Send a POST request to increment the zoo animals
    e.preventDefault();
    helper.sendPost('/addZooAnimal', {}, handler);
    // return false;
}

const StartGameButton = () => {
    return (
        <div className='is-flex is-justify-content-center'>
            <a href="/game"><button
                id='btn-addZooAnimal' className='button'
            >Start Game</button></a>
        </div>
    );
}

const ZooAnimalList = (props) => {
    const [animals, setAnimals] = useState(props.animals);

    useEffect(() => {
        const loadAnimalsFromServer = async () => {
            const response = await fetch('/getZoo');
            const data = await response.json();

            setAnimals(data.zoo.animals);
        };
        loadAnimalsFromServer();
    }, [props.reloadAnimals]); // Dependency, will trigger effect on change
    if (animals.length === 0) {
        return (
            <div className='animalList'>
                <h3 className='emptyAnimals'>No Animals Yet!</h3>
            </div>
        );
    }

    const animalNodes = animals.map(animal => {
        return (
            <div key={animal._id} className='animal container'>
                {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' /> */}
                <h3 className='animalName'>{animal.name}</h3>
                <h3 className='animalRarity'>Rarity: {animal.rarity}</h3>
                <h3 className='animalCount'>Found: {animal.numCaught}</h3>
                <h3 className='animalDesc'>{animal.description}</h3>
            </div>
        );
    });

    return (
        <div id='animalContainer'>
            <h2 className='title'>Animals</h2>
            <div className='animalList'>
                {animalNodes}
            </div>
        </div>
    );
}

const App = () => {
    const [reloadAnimals, setReloadAnimals] = useState(false);
    // Consists of a button to obtain a 'random' animal
    // A small list to display all the zoo animals
    return (
        <div>
            <h1 class="title has-text-centered">Zoo</h1>
            <StartGameButton triggerReload={() => setReloadAnimals(!reloadAnimals)} />
            <ZooAnimalList animals={[]} reloadAnimals={reloadAnimals} />
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<App />);
}

window.onload = init;