import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import NoMapDisplay from './NoMapDisplay';
import {MAP_KEY} from "../constants";
import {FS_VERSION} from "../constants";
import {FS_SECRET} from "../constants";
import {FS_CLIENT} from "../constants";


export class MapDisplay extends Component {

  componentDidMount() {
    this.updateMarkers(this.props.locations);
    // Google Map error handling
    window.gm_authFailure = () => {
         alert('ERROR!! \n API has failed. Map could not load.')
         console.log('ERROR!! \nAPI has failed. Map could not load.')
      }
  }
  
  componentDidUpdate(prevProps) {
    if ( prevProps["locations"] !== this.props.locations ) {
          this.updateMarkers(this.props.locations);
    }
  }

  mapReady = (props, map) => {
    this.props.updateMap(map);
    this.updateMarkers(this.props.locations);
  }

  closeInfoWindow = () => {
    this.props.activeMarker && this
      .props
      .activeMarker
      .setAnimation(null);

    this.props.toggleShowingInfoWindow(false);
  }

  updateMarkers = (locations) => {
    if (!locations)
      return;

    // remove markers from map
    this.props.markers.forEach(marker => marker.setMap(null));

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
        map: this.props.map,
        animation
      });
      marker.addListener('click', () => {
        this.props.onMarkerClick(mProps, marker, null);
      });
      return marker;
    })

    this.props.updateMarkers(markers);
    this.props.updateMarkerProps(markers);
  }


  onMapClicked = (props) => {
    if (this.props.showingInfoWindow) {
      this.props.toggleShowingInfoWindow(false);
      this.props.updateActiveMarker(null);
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

    let amProps = this.props.activeMarkerProps;

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
          marker={this.props.activeMarker}
          visible={this.props.showingInfoWindow}
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

export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer: NoMapDisplay})(MapDisplay)
