import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { AppContainer } from './App';

const Root = () => (
    <BrowserRouter>
        <Route render={props => <AppContainer query={queryString.parse(props.location.search, { arrayFormat: 'comma' })} />} />
    </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));
