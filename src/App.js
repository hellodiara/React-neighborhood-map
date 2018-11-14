import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';
import {GoogleApiWrapper} from 'google-maps-react';
import {MAP_KEY} from "./constants";
import {FS_VERSION} from "./constants";
import {FS_SECRET} from "./constants";
import {FS_CLIENT} from "./constants";

class App extends Component {

  constructor(props) {
    super(props);
    this.toggleShowingInfoWindow = this.toggleShowingInfoWindow.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);
    this.updateMarkerProps = this.updateMarkerProps.bind(this);
    this.updateActiveMarker = this.updateActiveMarker.bind(this);
    this.updateActiveMarkerProps = this.updateActiveMarkerProps.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  state = {
    lat: 40.8156637,
    lng: -73.9655981,
    zoom: 14,
    all: locations,
    filtered: null,
    open: false,
    showingInfoWindow: false,
    map: null,
    markers: [], // List all the markers
    markerProps: [], // List all the props for each markers
    activeMarker: null,
    activeMarkerProps: null    
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

  toggleShowingInfoWindow(toggler) {
      this.setState({
            showingInfoWindow: toggler
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

  updateMap(map) {
    this.setState({map});
  }

  updateMarkers(markers) {
    this.setState({markers});
  }

  updateMarkerProps(markerProps) {
    this.setState({markerProps});
  }

  updateActiveMarker(activeMarker) {
    this.setState({activeMarker})
  }

  updateActiveMarkerProps(activeMarkerProps) {
    this.setState({activeMarkerProps})
  }

  clickListItem = (index) => {
    // set the state to the selected location array index
    let newLocations = [index];
    this.setState({ filtered: newLocations, open: !this.state.open });
    this.toggleShowingInfoWindow(true);
  }

  getBusinessInfo(props, data) {
    // search for matching place data in Foursquare and compare to data we have 
    if ( typeof data !== "undefined" && data.hasOwnProperty("response") && data.response.hasOwnProperty("venues") ) {
      return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name) );
    }
    return data
  }

  onMarkerClick(props, marker, e) {
    this.toggleShowingInfoWindow(false);

    // Get Foursquare data for selected place
    let url = "https://api.foursquare.com/v2/venues/search?client_id=" + FS_CLIENT + "&client_secret=" + FS_SECRET + "&v=" + FS_VERSION + "&radius=100&ll=" + props.position.lat + "," + props.position.lng;
    let headers = new Headers();
    let request = new Request(url, {
      methord: 'GET',
      headers
    });

    // Create props for active marker
    let activeMarkerProps;
    fetch(request)
      .then(function(response) {
          if (response.ok) {
            return response.json();
          } else {
            alert("Foursquare API failed!")
          }
      })
      .then(result => {
        // Get business info from Foursquare
        let restaurant = this.getBusinessInfo(props, result);
        activeMarkerProps = {
          ...props,
          foursquare: typeof restaurant !== "undefined" ? restaurant[0]: []
        };

        // Get list of restaurant images form Foursquare if there is
        if (activeMarkerProps.foursquare && typeof restaurant !== "undefined" ) {
          let url = "https://api.foursquare.com/v2/venues/" + restaurant[0].id + "/photos?client_id=" + FS_CLIENT + "&client_secret=" + FS_SECRET + "&v=" + FS_VERSION;
          fetch(url)
            .then(function(response) {
                if (response.ok) {
                  return response.json();
                } else {
                  alert("Foursquare API failed!")
                }
            })
            .then(result => {
              activeMarkerProps = {
                ...activeMarkerProps,
                images: result.response.photos
              };
              if(this.state.activeMarker)
                this.state.activeMarker.setAnimation(null);
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
              this.toggleShowingInfoWindow(true);
              this.updateActiveMarker(marker);
              this.updateActiveMarkerProps(activeMarkerProps);
            })
            .catch(error => console.error(error));

        } else {
            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
            this.toggleShowingInfoWindow(true);
            this.updateActiveMarker(marker);
            this.updateActiveMarkerProps(activeMarkerProps);

        }

      })        
      .catch(error => console.error(error));


    this.toggleShowingInfoWindow(true);

    this.updateActiveMarker(marker);
    this.updateActiveMarkerProps(props); 
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
            locations={this.state.filtered}
            selectedIndex={this.state.selectedIndex}
            clickListItem={this.clickListItem}
            showingInfoWindow={this.state.showingInfoWindow}
            toggleShowingInfoWindow={this.toggleShowingInfoWindow.bind(this)}
            updateMarkers={this.updateMarkers.bind(this)}
            updateMap={this.updateMap.bind(this)}
            updateMarkerProps={this.updateMarkerProps.bind(this)}
            updateActiveMarker={this.updateActiveMarker.bind(this)}
            updateActiveMarkerProps={this.updateActiveMarkerProps.bind(this)}
            map={this.state.map}
            markers={this.state.markers}
            markerProps={this.state.markerProps}
            activeMarker={this.state.activeMarker}
            activeMarkerProps={this.state.activeMarkerProps}
            onMarkerClick={this.onMarkerClick.bind(this)}
          />
          <ListDrawer
            locations={this.state.filtered}
            open={this.state.open}
            toggleDrawer={this.toggleDrawer}
            filterLocations={this.updateQuery}
            onMarkerClick={this.onMarkerClick.bind(this)}
            clickListItem={this.clickListItem}
            google={this.props.google}
            toggleShowingInfoWindow={this.toggleShowingInfoWindow.bind(this)}
            updateMarkers={this.updateMarkers.bind(this)}
            updateMarkerProps={this.updateMarkerProps.bind(this)}
            updateActiveMarker={this.updateActiveMarker.bind(this)}
            updateActiveMarkerProps={this.updateActiveMarkerProps.bind(this)}
            map={this.state.map}
            markers={this.state.markers}
            markerProps={this.state.markerProps}
            activeMarker={this.state.activeMarker}
            activeMarkerProps={this.state.activeMarkerProps}
          /> 
      </div>
    );
  }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(App)