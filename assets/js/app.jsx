

import React from 'react';
import ReactDOM from 'react-dom';
import Form from './form.jsx';
import Search from './search.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return <div className="container">
            <Form />
            <Search />
        </div>;
    }
};


ReactDOM.render(<App/>, document.getElementById('app'));

