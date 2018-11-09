import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';

class App extends Component {
  state = {
    lat: 40.8156637,
    lng: -73.9655981,
    zoom: 14,
    all: locations,
    filtered: null,
    open: false
  }

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "white",
      padding: 10
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };

  toggleDrawer = () => {
    this.setState({
      open: !this.sate.open
    });
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
            <i className="fa fa-bars"> </i>
          </button>
          <h1>Harlem Sights</h1>
        </div>
          <MapDisplay
            lat={this.state.lat}
            lng={this.state.lng}
            zoom={this.state.zoom}
            locations={this.state.all}
          />
          <ListDrawer
            locations={this.state.all}
            open={this.state.open}
            toggleDrawer={this.toggleDrawer}
          /> 
      </div>
    );
  }
}

export default App;
