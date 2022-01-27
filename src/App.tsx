import './App.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import React, {Props, useEffect, useState} from "react";
import {LeafletMouseEvent, map} from "leaflet";
import markerIconPng from "./marker-icon.png"
import logo from "./logo.png"
import {Icon} from "leaflet";
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
    const [CityData, setCityData]: any = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setUserPosition({latitude, longitude});

            fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
                .then(res => res.json())
                .then(data => {
                    setWeatherData(data)
                    console.log(data);
                }).catch(console.error)
        }, () => {
            alert("You must allow location service to see accurate weather information.")
        } )
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

                fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
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
                    icon={new Icon({iconUrl: markerIconPng, iconSize: [64, 64], iconAnchor: [20, 65]})}

                /> : null
        )
    }


    let fetchDescription = function (index: number) {
        if (weatherData.daily !== undefined && weatherData.daily.length > 0) {
            return weatherData.daily[index].weather[0].description.toUpperCase();
        }
    }

    let fetchDayTemp = function (index: number) {
        if (weatherData.daily !== undefined && weatherData.daily.length > 0) {
            return (weatherData.daily[index].temp.day) + ' °C';
        }
    }

    let fetchNightTemp = function (index: number) {
        if (weatherData.daily !== undefined && weatherData.daily.length > 0) {
            return (weatherData.daily[index].temp.night) + ' °C';
        }
    }

    let fetchtimezone = function (index: number) {
        if (weatherData.timezone !== undefined && weatherData.timezone.length > 0) {
            return (weatherData.timezone);
        }
    }
    // In a weird way the Marker position is updating with userPosition but centering is not working
    return(



        <div>
            <div id="web_header">
                <img src={logo}/>
            </div>
            <div id="outermap">
                <div id="bigmap">
        <MapContainer  center={[userPosition.latitude, userPosition.longitude]} maxBoundsViscosity={1} zoom={9} scrollWheelZoom={true} id={"map"}>

        <Marker   position={[userPosition.latitude, userPosition.longitude]}/>

        <Markers />

        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    </MapContainer>
        </div>
        </div>
            <div id="forecast_container">
                <div id="timezone">
                    <h1> Timezone </h1>
                    <h1> {fetchtimezone(0)} </h1>
                </div>
                <div id="forecasts">
                <div id="forecast_item">

                    <div id="row">
                        <h1 id="heading"> Today </h1>

                    </div>
                    <div id="row">
                        <h1> Weather:  </h1>
                        <h1> {fetchDescription(0)}</h1>
                    </div>
                    <div id="row">
                        <h1> Päeval:  </h1>
                        <h1> {fetchDayTemp(0)} </h1>
                    </div>
                    <div id="row">
                        <h1> Öösel:  </h1>
                        <h1> {fetchNightTemp(0)} </h1>
                    </div>


                </div>

                    <div id="forecast_item">

                        <div id="row">
                            <h1 id="heading"> Tomorrow </h1>

                        </div>
                        <div id="row">
                            <h1> Weather:  </h1>
                            <h1> {fetchDescription(1)}</h1>
                        </div>
                        <div id="row">
                            <h1> Päeval:  </h1>
                            <h1> {fetchDayTemp(1)} </h1>
                        </div>
                        <div id="row">
                            <h1> Öösel:  </h1>
                            <h1> {fetchNightTemp(1)} </h1>
                        </div>


                    </div>

                    <div id="forecast_item">

                        <div id="row">
                            <h1 id="heading"> 3rd Day </h1>

                        </div>
                        <div id="row">
                            <h1> Weather:  </h1>
                            <h1> {fetchDescription(2)}</h1>
                        </div>
                        <div id="row">
                            <h1> Päeval:  </h1>
                            <h1> {fetchDayTemp(2)} </h1>
                        </div>
                        <div id="row">
                            <h1> Öösel:  </h1>
                            <h1> {fetchNightTemp(2)} </h1>
                        </div>


                    </div>

                    <div id="forecast_item">

                        <div id="row">
                            <h1 id="heading"> 4th Day </h1>

                        </div>
                        <div id="row">
                            <h1> Weather:  </h1>
                            <h1> {fetchDescription(3)}</h1>
                        </div>
                        <div id="row">
                            <h1> Päeval:  </h1>
                            <h1> {fetchDayTemp(3)} </h1>
                        </div>
                        <div id="row">
                            <h1> Öösel:  </h1>
                            <h1> {fetchNightTemp(3)} </h1>
                        </div>


                    </div>

                    <div id="forecast_item">

                        <div id="row">
                            <h1 id="heading"> 5th Day </h1>

                        </div>
                        <div id="row">
                            <h1> Weather:  </h1>
                            <h1> {fetchDescription(4)}</h1>
                        </div>
                        <div id="row">
                            <h1> Päeval:  </h1>
                            <h1> {fetchDayTemp(4)} </h1>
                        </div>
                        <div id="row">
                            <h1> Öösel:  </h1>
                            <h1> {fetchNightTemp(4)} </h1>
                        </div>


                    </div>
            </div>
            </div>
        </div>)


}