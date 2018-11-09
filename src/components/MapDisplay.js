import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const MAP_KEY = "AIzaSyBIZYc3YgxTyQkZI0CDQYrEDS-FUnGJTic";
const FS_CLIENT = "PGYDOGD0NSNG5C2ESJB4HCIK2OARIE1X22WB0F5B31OAYKAS";
const FS_SECRET = "4VNII1ZNUOVVVSCEIL2Z0OC2LJ0A53RSAN4ISPUHQRH0V1UV";
const FS_VERSION = "20180323";

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

  getBusinessInfo = (props, data) => {
    console.log(data);
    // search for matching place data in Foursquare and compare to data we have 
    return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name) );
  }

  onMarkerClick = (props, marker, e) => {
    this.closeInfoWindow();

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
      .then(response => response.json())
      .then(result => {
        // Get business info from Foursquare
        let restaurant = this.getBusinessInfo(props, result);
        activeMarkerProps = {
          ...props,
          foursquare: restaurant[0]
        };

        // Get list of restaurant images form Foursquare if there is
        if (activeMarkerProps.foursquare) {
          let url = "https://api.foursquare.com/v2/venues/" + restaurant[0].id + "/photos?client_id=" + FS_CLIENT + "&client_secret=" + FS_SECRET + "&v=" + FS_VERSION;
          fetch(url)
            .then(response => response.json())
            .then(result => {
              activeMarkerProps = {
                ...activeMarkerProps,
                images: result.response.photos
              };
              if(this.state.activeMarker)
                this.state.activeMarker.setAnimation(null);
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
              this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
            })
        } else {
            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
            this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps})
        }

      })

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
                : ""}
              {amProps && amProps.images 
                ? (
                <div><img 
                alt={amProps.name + " place picture"}
                src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix}
                ></img>
                <p> Image from Foursquare</p>
                </div>
                ) 
                : ""}
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: MAP_KEY
})(MapDisplay)