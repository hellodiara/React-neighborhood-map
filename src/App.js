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

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterLocations(this.state.all, "")
    });
  }

 toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  } 

  updateQuery = (query) => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, query)
    });
  }

  filterLocations = (locations, query) => {
    // filter locations to match what you type in search
    return locations.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }

  clickListItem = (index) => {
    // set the state to the selected location array index
    let newLocations = [index];
    this.setState({ filtered: newLocations, open: !this.state.open })
    // this.setState({ selectedIndex: index, open: !this.state.open })
  }

  render = () => {
    console.log(this.state.filtered);
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
            locations={this.state.filtered}
            selectedIndex={this.state.selectedIndex}
            clickListItem={this.clickListItem}
          />
          <ListDrawer
            locations={this.state.filtered}
            open={this.state.open}
            toggleDrawer={this.toggleDrawer}
            filterLocations={this.updateQuery}
            clickListItem={this.clickListItem}
          /> 
      </div>
    );
  }
}

export default App;
