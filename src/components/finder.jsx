    import React, { useState } from 'react';
    import axios from 'axios';
    import { Map, Marker } from "pigeon-maps" 

    const Finder = () => {
      const [latitude, setLatitude] = useState(-27.465);
      const [longitude, setLongitude] = useState(153.023);
      const [showMap, setShowMap] = useState(false);

      async function fetchData() {
        const { latitude: userLatitude, longitude: userLongitude } = await getUserLocation();
        setLatitude(userLatitude);
        setLongitude(userLongitude);
        setShowMap(true);

        const res = await axios.get(`http://worker-odd-snow-b170.danielheinrichemail.workers.dev/?term=korean&raduis=5000&latitude=${userLatitude}&longitude=${userLongitude}&sort_by=distance&limit=50`);
        return res;
      }
      
      function getUserLocation() {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.requestAuthorization();
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
              },
              (error) => {
                reject(error);
              }
            );
          } else {
            reject(new Error("Geolocation is not supported by this browser."));
          }
        });
      }
  

      return (
        <div className="flex items-center justify-center h-screen" style={{ backgroundImage: "url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.australia.com%2Fcontent%2Fdam%2Fassets%2Fimage%2Fjpeg%2F8%2Fb%2Fg%2FSTO-QLD-102198.jpg&f=1&nofb=1&ipt=67be86ab4768b8c10500571b45006cdb45006c705fbb167bedd042c9ec17faaa&ipo=images')", backgroundSize: "cover" }}>
          {showMap ? (
            <Map center={[latitude, longitude]} zoom={12} width={600} height={400}>
              <Marker anchor={[latitude, longitude]} />
            </Map>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={fetchData}>Find Restaurant</button>
          )}
        </div>
      );
    };

    export default Finder;

