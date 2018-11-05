import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';

class App extends Component {
  state = {
    lat: 40.810629,
    lng: -73.950192,
    zoom: 15,
    all: locations
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
            zoom={this.state.zoom}
            locations={this.state.all}
          />
      </div>
    );
  }
}

export default App;
