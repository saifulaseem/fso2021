import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ filter, filterChange }) => {
    return (
        <div>
            Find Countries: <input value={filter} onChange={filterChange} />
        </div>
    )
}

const Countries = ({ filter, countries, filterChange }) => {
    const filteredResult = filter === ''
        ? []
        : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    if (filteredResult.length > 10) {
        return (<p>Too many matches,specify another filter</p>)
    }
    if (filteredResult.length < 10 && filteredResult.length > 1) {
        return (filteredResult.map(country => (
            <div key={country.cca3}>
                <p >{country.name.common}</p>
                <button value={country.name.common} type="button" onClick={filterChange} >Show</button>
            </div>
        )))
    }
    else if (filteredResult.length === 1) {
        return (
            filteredResult.map(country => <Country key={country.cca3} country={country} />)
        )
    }
    else
        return (<></>)
}
const Country = ({ country: country }) => {
    const [weather, setWeather] = useState({});
    const latlong = country.capitalInfo.latlng;
    const api_key = process.env.REACT_APP_API_KEY

    useEffect(async () => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latlong[0]}&lon=${latlong[1]}&appid=${api_key}&units=metric`)
            .then(res => {
                setWeather(res.data);
            })
    }, []);
    return (<div>
        <h2>{country.name.common}</h2>
        <p >  capital {country.capital}
            <br />
            region {country.region} </p>
        <h2>languages</h2>
        <ul>
            {Object.keys(country.languages).map((key) => {
                return <li key={key}>{country.languages[key]}</li>
            })}
        </ul>
        <img src={country.flags.png} height="150" width="auto" />
        <h2>Weather in {country.capital}</h2>
        <p><strong>temperature : </strong> {weather?.current?.temp}</p>
        <img src={"http://openweathermap.org/img/w/" + weather?.current?.weather[0]?.icon + ".png"} />
        <p><strong>wind : </strong> {weather?.current?.wind_speed} mph direction :{weather?.current?.wind_deg} degrees</p>
        
    </div>)
}
const App = () => {
    const [countries, setCountries] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')


    useEffect(() => {
        console.log('effect')
        axios
            .get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const handleFilterChange = (e) => {
        console.log(e.target);
        setFilter(e.target.value)
    }

    return (
        <div>
            <Filter filter={filter} filterChange={handleFilterChange} />
            <Countries filter={filter} countries={countries} filterChange={handleFilterChange} />
        </div>
    )
}

export default App