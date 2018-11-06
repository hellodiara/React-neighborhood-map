import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';

class App extends Component {
  state = {
    lat: 40.8156637,
    lng: -73.9655981,
    zoom: 14,
    all: locations
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <h1>Harlem Sights</h1>
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
