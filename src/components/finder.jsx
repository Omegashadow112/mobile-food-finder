    import React, { useState } from 'react';
    import axios from 'axios';
    import { Map, Marker } from "pigeon-maps" 
    import response from './response.json';
    import StarRatings from 'react-star-ratings';
    const Finder = () => {
      const [latitude, setLatitude] = useState(-27.465);
      const [longitude, setLongitude] = useState(153.023);
      const [showMap, setShowMap] = useState(false);

      const [errorMessage, setErrorMessage] = useState(null);
      const [restaurants, setRestaurants] = useState([]);
      const [loading, setLoading] = useState(false);
      const [randominess, setRandominess] = useState(0);
      const [term, setTerm] = useState('korean');
      async function askUserForterm() {
        const term = prompt("What type of food do you want to eat?");
        return term;
      }
      async function fetchData() {
        try {
          const userTerm = await askUserForterm();
          setTerm(userTerm);
          setLoading(true);
          const { latitude: userLatitude, longitude: userLongitude } = await getUserLocation();
          setLatitude(userLatitude);
          setLongitude(userLongitude);
          setShowMap(true);
      
          const res = await axios.get(`https://worker-odd-snow-b170.danielheinrichemail.workers.dev/?term=${userTerm}&radius=2500&latitude=${userLatitude}&longitude=${userLongitude}&sort_by=distance&limit=50`);
          setRestaurants(res.data);
      
          const randomIndex = Math.floor(Math.random() * res.data.businesses.length);
          setRandominess(randomIndex);
      
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setErrorMessage(error.message);
        }
      }
      
      function getUserLocation() {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
              },
              (error) => {
                // Add a specific message for Safari users
                if (error.code === error.PERMISSION_DENIED)
                  reject(new Error("Please enable location services for this website."));
                else
                  reject(error);
              },
              { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 } // These options can help on iOS devices
            );
          } else {
            reject(new Error("Geolocation is not supported by this browser."));
          }
        });
      }
      function backToMenu() {
        setShowMap(false);
      }
      function newRestaurant() {
        const randomIndex = Math.floor(Math.random() * restaurants.businesses.length);
        setRandominess(randomIndex);
      }
      return (
        <div style={{ backgroundImage: "url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.australia.com%2Fcontent%2Fdam%2Fassets%2Fimage%2Fjpeg%2F8%2Fb%2Fg%2FSTO-QLD-102198.jpg&f=1&nofb=1&ipt=67be86ab4768b8c10500571b45006cdb45006c705fbb167bedd042c9ec17faaa&ipo=images')", backgroundSize: "cover" }}>
          
         {loading ? (
  <div className="flex items-center justify-center h-screen">
    <h1 className="bg-white hover:text-black font-bold py-2 px-4">Loading...</h1>
  </div>
) : errorMessage ? (
  <div className="flex items-center justify-center h-screen">
  <div className="bg-red-500 hover text-white font-bold py-2 px-4 ">{errorMessage}</div>
  </div>
) : (
  <>
    {showMap ? (
  <div className="flex flex-col items-center justify-center h-screen">
  <div className="flex space-x-4">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l" onClick={backToMenu}>Back to Menu</button>
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r" onClick={newRestaurant}>New Restaurant</button>
  </div>
   <Map 
  center={[restaurants.businesses[randominess].coordinates.latitude, restaurants.businesses[randominess].coordinates.longitude]} 
  zoom={17} 
  height={"50%"} width={"100%"}
>
  <Marker anchor={[restaurants.businesses[randominess].coordinates.latitude, restaurants.businesses[randominess].coordinates.longitude]} />
</Map>
    <div className="flex space-x-4 bg-white p-4">
    <div className="flex flex-col ">
  <h1>{restaurants.businesses[randominess].name}</h1>
  <StarRatings
  rating={restaurants.businesses[randominess].rating}
  numberOfStars={5}
  name='rating'
  starDimension="20px"
  starSpacing="5px"
  starRatedColor="yellow" // Makes the stars yellow
/>
<h2><a className="text-blue-500 hover:text-blue-700" href={`https://maps.google.com/?q=${restaurants.businesses[randominess].name}`}>{restaurants.businesses[randominess].location.display_address.join(' ')}</a></h2>
<h2>Price: {restaurants.businesses[randominess].price || '$'}</h2>
<h2>{restaurants.businesses[randominess].categories[0].title}</h2>
</div>
  {restaurants.businesses[randominess].image_url !== "" && (
    <img className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48" src={restaurants.businesses[randominess].image_url} alt="restaurant" />
  )}
</div>
  </div>
) : (
      <div className="flex items-center justify-center h-screen">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={fetchData}>Find Restaurant</button>
      </div>
    )}
  </>
)}
          
        </div>
      );
    };

    export default Finder;

