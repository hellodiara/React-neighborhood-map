import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';

class App extends Component {
  state = {
    lat: 59.95,
    lng: 30.33,
    zoom: 11,

  }

  render = () => {
    return (
      <div className="App">
        <div>
          <h1> Harlem Sights </h1>
        </div>
          <MapDisplay
            lat={this.state.lat}
            lng={this.state.lng}
            locations={this.state.all}
          />
      </div>
    );
  }
}

export default App;
