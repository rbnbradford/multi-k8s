import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { OtherPage } from './OtherPage';
import { fibonacciServiceRestApi } from './api/infrastructure/fibonacci-service-rest-api';
import { fibonacciLiveUpdateServiceWebSockets } from './api/infrastructure/fibonacci-live-update-service-web-sockets';
import { FibContainer } from './FibContainer';

const fibonacciService = fibonacciServiceRestApi(window.location.host + '/api');
const fibonacciLiveUpdateService = fibonacciLiveUpdateServiceWebSockets(window.location.host + '/stream');

const App = () =>
	<Router>
		<div className="App">
			<h1>Fib Calculator v2</h1>
			<header className="App-header">
				<Link to='/'>Home</Link>
				<Link to='/otherpage'>Other Page</Link>
			</header>
		</div>
		<div>
			<Route
				exact path='/'
				component={() => FibContainer({fibonacciLiveUpdateService, fibonacciService})}
				// component={FibContainer}
			/>
			<Route
				path='/otherpage'
				component={OtherPage}
			/>
		</div>
	</Router>;

export default App;
