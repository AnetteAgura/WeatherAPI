import './App.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import React, {Props, useEffect, useState} from "react";
import {LeafletMouseEvent} from "leaflet";
import {DomUtil, latLng, Util} from 'leaflet';
import { url } from 'inspector';
import { isCatchClause } from 'typescript';
import { render } from '@testing-library/react';

type Coordinate = {
    latitude: number,
    longitude: number
}

export default function App(){

    const [weatherData, setWeatherData] : any = useState([]);
    // userPosition isn't updating for map centering :(
    const [userPosition, setUserPosition] = useState<Coordinate>({latitude: 58.3780, longitude: 26.7290});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setUserPosition({latitude, longitude});

            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
                .then(res => res.json())
                .then(data => {
                    setWeatherData(data)
                    console.log(data);
                }).catch(console.error)
        }, () => {
            alert("You must allow location service to see accurate weather information.")
        })
    },  []);

    const Markers = () => {

        useMapEvents({
            click(e: LeafletMouseEvent) {
                let lat = e.latlng.lat
                let lng = e.latlng.lng

                // For updating the userPosition a little so the Marker would move
                setUserPosition({
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                });

                fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
                    .then(res => res.json())
                    .then(data => {
                        setWeatherData(data)
                        console.log(data);
                    }). catch(console.error)
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

    // In a weird way the Marker position is updating with userPosition but centering is not working
    return(<MapContainer center={[userPosition.latitude, userPosition.longitude]} zoom={9} scrollWheelZoom={true} id={"map"}>

        <Marker position={[userPosition.latitude, userPosition.longitude]}/>

        <Markers />

        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

    </MapContainer>)}