import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


const MAP_KEY ="AIzaSyBIZYc3YgxTyQkZI0CDQYrEDS-FUnGJTic";

export class MapDisplay extends Component {
  state = {
    map: null,
    markers: [], // List all the markers
    markerProps: [], // List all the props for each markers
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false,
  };

  componentDidMount = () => {
  }

  mapReady = (props, map) => {
    this.setState({map});
    this.updateMarkers(this.props.locations);
  }

  closeInfoWindow = () => {
    this.state.activeMarker && this
      .state
      .activeMarker
      .setAnimation(null);

    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      activeMarkerProps: null
    });
  }

  onMarkerClick = (props, marker, e) => {
    this.closeInfoWindow();

    this.setState({
      showingInfoWindow: true,
      activeMarker: marker,
      activeMarkerProps: props   
    });
  }

  updateMarkers = (locations) => {
    if (!locations)
      return;

    // remove markers from map
    this
      .state
      .markers
      .forEach(marker => marker.setMap(null));

    let markerProps = [];
    let markers = locations.map((item, index) => {
      let mProps = {
        key: index,
        index,
        name: item.name,
        position: item.pos,
        url: item.url
      };
      markerProps.push(mProps);

      let animation = this.props.google.maps.Animation.DROP;
      let marker = new this.props.google.maps.Marker({
        position: item.pos,
        map: this.state.map,
        animation
      });
      marker.addListener('click', () => {
        this.onMarkerClick(mProps, marker, null);
      });
      return marker;
    })
    this.setState({markers, markerProps});
  }


  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render= () => {
    const style = {
      width: '100%',
      height: '75%'
    }

    const center = {
      lat: this.props.lat,
      lng: this.props.lon
    }

    let amProps = this.state.activeMarkerProps;

    return (
        <Map 
          role="application"
          aria-label="map"
          onReady={this.mapReady}
        	google={this.props.google}
          style={style} 
        	initialCenter={{
        		lat: 40.810629,
        		lng: -73.950192
        	}}
          zoom={this.props.zoom}
          onClick={() => {
            this.closeInfoWindow();
          }}
        	>

        <InfoWindow 
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.closeInfoWindow}>
            <div>
              <h3>{amProps && amProps.name}</h3>
              {amProps && amProps.url
                ? (
                    <a href={amProps.url}>See website</a>
                )
                : ""
              }
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(MapDisplay)