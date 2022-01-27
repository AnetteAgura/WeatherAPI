import './App.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import React, { useEffect, useState } from "react";
import {DomUtil, latLng, Util} from 'leaflet';
import { url } from 'inspector';
import { isCatchClause } from 'typescript';
import { render } from '@testing-library/react';

interface IWeatherData {
  list: [];
}

export type WeatherData = {
  temp_f: number;
  temp_c: number;
  weather: string;
  icon: string;
};

export default function App(){

  //const [weatherData, setWeatherData] = useState<IWeatherData>();
    const [initialPosition, setInitialPosition] = useState<[number, number]>([58.3780, 26.7290]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([58.3780, 26.7290]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);

        });
    }, []);

    const Markers = () => {

      const map = useMapEvents({
          click(e) {                                
              setSelectedPosition([
                  e.latlng.lat,
                  e.latlng.lng
              ]);
              },
        });
      return ( selectedPosition ?
              <Marker
              key={selectedPosition[0]}
              position={selectedPosition}
              interactive={false}
              /> :null
      )}

       return<MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true} id={"map"}>

           <Markers />

           <Marker position={selectedPosition || initialPosition}/>

           <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           />

      </MapContainer>}







