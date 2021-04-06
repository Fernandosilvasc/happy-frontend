import React, { useState, FormEvent, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { FiPlus } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import usePosition from "../hooks/usePosition";
import Loader from "react-loader-spinner";

import "../styles/pages/create-orphanage.scss";

export default function CreateOrphanage() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [instructions, setInstructions] = useState("");
  const [opening_hours, setOpeningHours] = useState("");
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const history = useHistory();
  const getPosition = usePosition();
  const { latitude, longitude } = getPosition.currentPosition;

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectImagesPreview = selectedImages.map((image) => {
      return URL.createObjectURL(image);
    });
    setPreviewImages(selectImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;
    const data = new FormData();

    data.append("name", name);
    data.append("about", about);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("instructions", instructions);
    data.append("opening_hours", opening_hours);
    data.append("open_on_weekends", String(open_on_weekends));

    images.forEach((image) => {
      data.append("images", image);
    });

    await api.post("orphanages", data);

    alert("The data has been saved with success!");
    history.push("/app");
  }

  return (
    <div id='page-create-orphanage'>
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className='create-orphanage-form'>
          <fieldset>
            <legend>Data</legend>

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
                // center={[49.1748952, -122.8246378]}
                center={[latitude, longitude]}
                style={{ width: "100%", height: 280 }}
                zoom={12}
                onclick={handleMapClick}>
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />

                {position.latitude !== 0 && (
                  <Marker
                    interactive={false}
                    icon={mapIcon}
                    position={[position.latitude, position.longitude]}
                  />
                )}
              </Map>
            )}

            <div className='input-block'>
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='about'>
                About<span>Maximum 300 characters</span>
              </label>
              <textarea
                id='name'
                maxLength={300}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='images'>Images</label>

              <div className='images-container'>
                {previewImages.map((image) => {
                  return <img key={image} src={image} alt={name} />;
                })}

                <label htmlFor='image[]' className='new-image'>
                  <FiPlus size={24} color='#15b6d6' />
                </label>
              </div>
              <input
                multiple
                type='file'
                id='image[]'
                onChange={handleSelectImages}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Attendance</legend>

            <div className='input-block'>
              <label htmlFor='instructions'>Instructions</label>
              <textarea
                id='instructions'
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='opening_hours'>Opening Hours</label>
              <input
                id='opening_hours'
                value={opening_hours}
                onChange={(event) => setOpeningHours(event.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='open_on_weekends'>Open on weekends</label>

              <div className='button-select'>
                <button
                  type='button'
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}>
                  Yes
                </button>
                <button
                  type='button'
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(false)}>
                  No
                </button>
              </div>
            </div>
          </fieldset>

          <button className='confirm-button' type='submit'>
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
