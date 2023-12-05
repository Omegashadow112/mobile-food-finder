import React,{useState,useEffect} from 'react';
import axios from 'axios';
let config = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`,
      'Access-Control-Allow-Origin' : '*',
    },
    params: {
      term: 'Tourists Must See List', 
//term to search locations by
      raduis: 0.5, 
      latitude: 40.7050758, 
      longitude: -74.0091604, 
// for lat/long we are searching locations by proximity of users location which is the location from geolocation api
      sort_by: 'distance', 
//can sort by best_match, rating, review_count or distance    

      limit: 5, 
//the amount of location markers you want to show
    },
  };


let getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          let newOrigin = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          config.params.latitude = newOrigin.latitude;
          config.params.longitude = newOrigin.longitude;
this.setState({
            origin: newOrigin,
          });
          resolve(true);
        },
        err => {
          console.log('error');
          console.log(err);
          reject(reject);
        },
        { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
      );
    });
  };
  let fetchMarkerData = () => {
    return axios
      .get('https://api.yelp.com/v3/businesses/search', config)
      .then(responseJson => {
        this.setState({
          isLoading: false,
          markers: responseJson.data.businesses.map(x => x),
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  

const Finder = () => {
   
    return (
        <div className="flex items-center justify-center sm:justify-start">
            <p className="flex-1 text-center sm:text-left">Hello Earth</p>
       
        </div>
    );
};

export default Finder;
