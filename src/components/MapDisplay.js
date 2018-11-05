import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const MAP_KEY ="AIzaSyBIZYc3YgxTyQkZI0CDQYrEDS-FUnGJTic";

class mapDisplay extends Component {
  state = {
    showInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    map: null
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
        <Map 
          role="application"
          aria-label="map"
        	google={this.props.google}
          style={style} 
        	initialCenter={{
        		lat: 40.810629,
        		lng: -73.950192
        	}}
          zoom={15}
        	onClick={this.onMapClicked}
        	>

        <Marker 
        onClick={this.onMarkerClick}
        title={'Test'}
        name={'Apollo Theather'} 
        position={{lat:40.810629, lng:-73.950192}}/>

        <InfoWindow 
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(mapDisplay)