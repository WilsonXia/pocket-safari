const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const greeting = e.target.querySelector('#domoGreeting').value;

    if (!name || !age) {
        helper.handleError('Name and Age are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, greeting }, onDomoAdded);
    return false;
}

const handleDomoEdit = (e, id, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const greeting = e.target.querySelector('#domoGreeting').value;
    const domoID = id;

    if (!greeting) {
        helper.handleError('A greeting is required');
        return false;
    }

    helper.sendPost(e.target.action, { domoID, greeting }, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input type="text" id="domoName" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input type="number" id="domoAge" name='age' min='0' />
            <label htmlFor="greeting">Greeting: </label>
            <input type="text" id="domoGreeting" name="greeting" placeholder="Enter a greeting" />

            <input className='makeDomoSubmit' type='submit' value="Make Domo" />
        </form>
    )
}

// Make something that allows you to edit pre-existing domos
const EditGreetingForm = (props) => {
    return (
        <form id="greetingForm"
            onSubmit={(e) => handleDomoEdit(e, props.domoID, props.triggerReload)}
            name='greetingForm'
            action='/editSpeech'
            method='POST'
            className='greetingForm'
        >
            <label htmlFor="greeting">New Greeting: </label>
            <input type="text" id="domoGreeting" name="greeting" placeholder="Enter a greeting" />
            <input type='submit' value="Submit" />
        </form>
    );
}

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]); // Dependency, will trigger effect on change

    if (domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomos'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className='domo'>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
                <h3 className='domoName'>"{domo.greeting}"</h3>
                <div>
                    <EditGreetingForm domoID={domo._id} triggerReload={props.triggerReload} />
                </div>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
}

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id='makeDomo'>
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id='domos'>
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;