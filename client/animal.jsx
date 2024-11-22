const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleAnimal = (e, onAnimalAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#animalName').value;
    const rarity = e.target.querySelector('#animalRarity').value;
    const description = e.target.querySelector('#animalDescription').value;

    if (!name || !rarity) {
        helper.handleError('Name and Rarity are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, rarity, description }, onAnimalAdded);
    return false;
}

const handleAnimalEdit = (e, id, onAnimalAdded) => {
    e.preventDefault();
    helper.hideError();

    const greeting = e.target.querySelector('#animalDescription').value;
    const animalID = id;

    if (!greeting) {
        helper.handleError('A greeting is required');
        return false;
    }

    helper.sendPost(e.target.action, { animalID, greeting }, onAnimalAdded);
    return false;
}

const AnimalForm = (props) => {
    return (
        <form id="animalForm"
            onSubmit={(e) => handleAnimal(e, props.triggerReload)}
            name="animalForm"
            action="/animal"
            method="POST"
            className="animalForm"
        >
            <label htmlFor="name">Name: </label>
            <input type="text" id="animalName" name="name" placeholder="Animal Name" />
            <label htmlFor="rarity">Rarity: </label>
            <input type="number" id="rarity" name='rarity' min='0' />
            <label htmlFor="description">Description: </label>
            <input type="text" id="animalDescription" name="description" placeholder="Enter a Description" />

            <input className='makeAnimalSubmit' type='submit' value="Make Animal" />
        </form>
    )
}

// Make something that allows you to edit pre-existing animals
const EditGreetingForm = (props) => {
    return (
        <form id="greetingForm"
            onSubmit={(e) => handleAnimalEdit(e, props.animalID, props.triggerReload)}
            name='greetingForm'
            action='/editAnimal'
            method='POST'
            className='greetingForm'
        >
            <label htmlFor="greeting">New Description: </label>
            <input type="text" id="animalDescription" name="description" placeholder="Enter a Description" />
            <input type='submit' value="Submit" />
        </form>
    );
}

const AnimalList = (props) => {
    const [animals, setAnimals] = useState(props.animals);

    useEffect(() => {
        const loadAnimalsFromServer = async () => {
            const response = await fetch('/getAnimals');
            const data = await response.json();
            setAnimals(data.animals);
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
            <div key={animal.id} className='animal'>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='animalName'>Name: {animal.name}</h3>
                <h3 className='animalAge'>Age: {animal.age}</h3>
                <h3 className='animalName'>"{animal.greeting}"</h3>
                <div>
                    <EditGreetingForm animalID={animal._id} triggerReload={props.triggerReload} />
                </div>
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

    return (
        <div>
            <div id='makeAnimal'>
                <AnimalForm triggerReload={() => setReloadAnimals(!reloadAnimals)} />
            </div>
            <div id='animals'>
                <AnimalList animals={[]} reloadAnimals={reloadAnimals} triggerReload={() => setReloadAnimals(!reloadAnimals)} />
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;