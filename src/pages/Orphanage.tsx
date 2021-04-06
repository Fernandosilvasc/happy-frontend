import React, { useEffect, useState } from "react";
// import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";

import api from "../services/api";
import "../styles/pages/orphanage.scss";
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hour: string;
  open_on_weekends: string;
  images: Array<{
    id: number;
    path: string;
  }>;
}
interface OrphanageParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    api
      .get(`orphanages/${params.id}`)
      .then((res) => {
        setOrphanage(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);

  if (!orphanage) {
    return <p>Loading...</p>;
  }

  return (
    <div id='page-orphanage'>
      <Sidebar />

      <main>
        <div className='orphanage-details'>
          <img src={orphanage.images[activeImageIndex].path} alt={orphanage.name} />

          <div className='images'>
            {orphanage.images.map((image, index) => {
              return (
                <button 
                key={image.id} 
                className={activeImageIndex === index ? 'active' : ''} 
                type='button'
                onClick={() => {
                  setActiveImageIndex(index);
                }}
                >
                  <img src={image.path} alt={orphanage.name} />
                </button>
              );
            })}
          </div>

          <div className='orphanage-details-content'>
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className='map-container'>
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={10}
                style={{ width: "100%", height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}>
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]}
                />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`} >See routes on Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instructions</h2>
            <p>{orphanage.instructions}</p>

            <div className='open-details'>
              <div className='hour'>
                <FiClock size={32} color='#15B6D6' />
                Monday to Friday <br />
                {orphanage.opening_hour}
              </div>

              {orphanage.open_on_weekends ? (
                <div className='open-on-weekends'>
                  <FiInfo size={32} color='#39CC83' />
                  We are open 
                  <br />
                  on Weekends!
                </div>
              ) : (
                <div className='open-on-weekends closed-on-weekends'>
                  <FiInfo size={32} color='#FF669D' />
                  Sorry, We are not open <br />
                  on Weekends!
                </div>
              )}
              {console.log(orphanage.open_on_weekends)}
            </div>

            {/* <button type='button' className='contact-button'>
              <FaWhatsapp size={20} color='#FFF' />
              Please feel free to reach us!
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}
