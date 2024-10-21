import './App.css';
import './firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import Login from './routes/Login';
import Home from './routes/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Redirect, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<Router forceRefresh={true}>
			<Routes>
				<Route path='/login'><Login/></Route>
				<Route exact path='*'><Home/></Route>	
			</Routes>
		</Router>
	);
}

export default App;
