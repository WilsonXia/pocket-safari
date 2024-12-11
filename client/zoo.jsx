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

const AddZooAnimalButton = () => {
    return (
        <div>
            <a href="/game"><button
            id='btn-addZooAnimal'
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
            <div key={animal._id} className='animal'>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='animalName'>{animal.name}</h3>
                <h3 className='animalCount'>Found: {animal.numCaught}</h3>
            </div>
        );
    });

    return (
        <div className='animalList'>
            {animalNodes}
        </div>
    );
}

const App = () => {
    const [reloadAnimals, setReloadAnimals] = useState(false);
    // Consists of a button to obtain a 'random' animal
    // A small list to display all the zoo animals
    return (
        <div>
            <h3>Zoo</h3>
            <AddZooAnimalButton triggerReload={() => setReloadAnimals(!reloadAnimals)}/>
            <ZooAnimalList animals={[]} reloadAnimals={reloadAnimals}/>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<App />);
}

window.onload = init;