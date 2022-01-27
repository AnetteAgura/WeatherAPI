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

interface ILocation {
    latitude: number;
    longitude: number;
}

export default function App(){

    const [weatherData, setWeatherData] = useState<IWeatherData>();
    const [initialPosition, setInitialPosition] = useState<[number, number]>([58.3780, 26.7290]);

    const Markers = () => {

      const map = useMapEvents({
          click(e) {
              setInitialPosition([
                  e.latlng.lat,
                  e.latlng.lng

              ]);
              GetWeather();
              },
        });

      return ( initialPosition ?
              <Marker
              key={initialPosition[1]}
              position={initialPosition}
              interactive={false}
              /> : null
      )}
    const GetWeather = () => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${initialPosition[0]}&lon=${initialPosition[1]}&APPID=a874d3d875a1b67b607feaa88782161d&units=metric`)
            .then(res => res.json())
            .then(result => {
                setWeatherData(result)
                console.log(result);
            });

    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);

        });
    }, [initialPosition]);

       return<MapContainer center={initialPosition} zoom={13} scrollWheelZoom={true} id={"map"}>

           <Markers />

           <Marker position={initialPosition}/>

           <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           />

      </MapContainer>}







