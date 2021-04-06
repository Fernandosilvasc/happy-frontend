import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../services/api";
import usePosition from "../hooks/usePosition";

import mapMarkerImg from "../images/map-marker.svg";
import mapIcon from "../utils/mapIcon";
import Loader from "react-loader-spinner";
import "../styles/pages/orphanages-map.scss";

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const getPosition = usePosition();
  const { latitude, longitude} = getPosition.currentPosition;

  useEffect(() => {
    api
      .get("/orphanages")
      .then((res) => {
        setOrphanages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  return (
    <div id='page-map'>
      <aside>
        <header>
          <img src={mapMarkerImg} alt='Happy' />
          <h2>Let's start the search for an orphanage</h2>
          <p>Many children are waiting to see you :)</p>
        </header>

        <footer>
          <strong>BC</strong>
          <span>Vancouver</span>
        </footer>
      </aside>

      {getPosition.isLoading ? (
          <div className="spinner">
            <Loader 
            type="TailSpin" 
            color="#15d6d6" 
            height={80} 
            width={80}
            />
        </div>
      ) : (
      <Map
        // center={[49.1782144, -122.847232]}
        center={[latitude, longitude]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}>
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {orphanages.map((orphanage) => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapIcon}
              position={[orphanage.latitude, orphanage.longitude]}>
              <Popup
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className='map-popup'>
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color={"#FFF"} />
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </Map>
      )}


      <Link to='/orphanages/create' className='create-orphanage'>
        <FiPlus size={32} color='#fff' />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
