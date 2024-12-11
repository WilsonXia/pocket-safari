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

    const description = e.target.querySelector('#animalDescription').value;
    const rarity = e.target.querySelector('#animalRarity').value;
    const animalID = id;

    if (!description && !rarity) {
        helper.handleError('No changes have been made');
        return false;
    }

    helper.sendPost(e.target.action, { animalID, rarity, description }, onAnimalAdded);
    // Refresh changes
    e.target.querySelector('#animalDescription').value = '';
    e.target.querySelector('#animalRarity').value = '';
    return false;
}

const toggleEditFormView = (e) => {
    let editForm = e.target.parentNode.parentNode.querySelector('#editFormHolder');
    if (editForm.classList.contains('hidden')) {
        editForm.classList.remove('hidden');
    } else {
        editForm.classList.add('hidden');
    }
}

const AnimalForm = (props) => {
    return (
        <form id="animalForm"
            onSubmit={(e) => handleAnimal(e, props.triggerReload)}
            name="animalForm"
            action="/animal"
            method="POST"
            className="is-flex-direction-column is-justify-content-center has-background-primary p-4 animalForm"
        >
            <h2 className='has-text-centered title is-size-4'>Create New Animal</h2>
            <div className="field">
                <label htmlFor="name">Name: </label>
                <div className="control">
                    <input className='input' type="text" id="animalName" name="name" placeholder="Animal Name" />
                </div>
            </div>
            <div className="field">
                <label htmlFor="rarity">Rarity: </label>
                <div className="control">
                    <select className='select' name="rarity" id="animalRarity">
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
            </div>
            <div className="field">
                <label htmlFor="description">Description: </label>
                <div className="control">
                    <input className='input' type="text" id="animalDescription" name="description" placeholder="Enter a Description" />
                </div>
            </div>
            <div className="field">
                <div className="control is-flex is-justify-content-center">
                    <input className='button formSubmit' type='submit' value="Make Animal" />
                </div>
            </div>
        </form>
    )
}

// Make something that allows you to edit pre-existing animals
const EditAnimalForm = (props) => {
    return (
        <form id="animalForm"
            onSubmit={(e) => handleAnimalEdit(e, props.animalID, props.triggerReload)}
            name='animalForm'
            action='/editAnimal'
            method='POST'
            className='animalForm is-flex-direction-column is-justify-content-center has-background-primary p-4'
        >
            <div className="field">
                <label htmlFor="rarity">New Rarity</label>
                <div className="control">
                    <select className='select' name="rarity" id="animalRarity">
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <label htmlFor="description">New Description</label>
                <div className="control">
                    <input className='input' type="text" id="animalDescription" name="description" placeholder="Enter a Description" />
                </div>
            </div>

            <div className="field">
                <div className="control is-flex is-justify-content-center">
                    <input className='button formSubmit' type='submit' value="Submit Changes" />
                </div>
            </div>
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
            <div>
                <h2 className='has-text-centered title is-size-4'>All Animals</h2>
                <div className='animalList'>
                    <h3 className='emptyAnimals'>No Animals Yet!</h3>
                </div>
            </div>
        );
    }

    const animalNodes = animals.map(animal => {
        return (
            <div key={animal.id} className='animal'>
                {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' /> */}
                <h3 className='animalName'>Name: {animal.name}</h3>
                <h3 className='animalRarity'>Rarity: {animal.rarity}</h3>
                <h3 className='animalDescription'>"{animal.description}"</h3>
                <a onClick={toggleEditFormView}><h2 className='has-text-centered has-background-primary'>Edit</h2></a>

                <div id='editFormHolder' className='hidden'>
                    <EditAnimalForm animalID={animal._id} triggerReload={props.triggerReload} />
                </div>
            </div>
        );
    });

    return (
        <div>
            <h2 className='has-text-centered title is-size-4'>All Animals</h2>
            <div className='animalList'>
                {animalNodes}
            </div>
        </div>
    );
}

const App = () => {
    const [reloadAnimals, setReloadAnimals] = useState(false);

    return (
        <div>
            <div id='makeAnimal' className='section is-flex is-justify-content-center'>
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