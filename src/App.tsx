import './App.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import React, { useEffect, useState } from "react";
import {LeafletMouseEvent} from "leaflet";
import {DomUtil, latLng, Util} from 'leaflet';
import { url } from 'inspector';
import { isCatchClause } from 'typescript';
import { render } from '@testing-library/react';

type WeatherData = {
  list: [];
}

type Coordinate = {
    latitude: number,
    longitude: number
}

export default function App(){

    const [weatherData, setWeatherData] = useState<WeatherData>();
    const [userPosition, setUserPosition] = useState<Coordinate>({latitude: 58.3780, longitude: 26.7290});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setUserPosition({latitude, longitude});
        }, () => {
            alert("Must share location for accurate weather information")
        })
    },  []);

    const GetWeather = () => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${userPosition.latitude}&lon=${userPosition.longitude}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
            .then(res => res.json())
            .then(result => {
                setWeatherData(result)
                console.log(result);
            });
    }

    const Markers = () => {

            useMapEvents({
                click(e: LeafletMouseEvent) {
                    setUserPosition({
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    });
                },
            });
        return (userPosition ?
                <Marker
                    key={1}
                    position={[userPosition.latitude, userPosition.longitude]}
                    interactive={true}
                /> : null
        )
    }

       return(<MapContainer center={[userPosition.latitude, userPosition.longitude]} zoom={13} scrollWheelZoom={true} id={"map"}>

           <Marker position={[userPosition.latitude, userPosition.longitude]}/>

           <Markers />

           <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           />

      </MapContainer>)}







