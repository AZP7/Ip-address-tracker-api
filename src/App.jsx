import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { MapContainer,Marker,TileLayer } from 'react-leaflet'
import bgMobile from './assets/images/pattern-bg-mobile.png'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import popup from './/assets/images/icon-location.svg'

function App() {
  
  const iptracker = {
  "ip": "45.125.4.199",
  "location": {
    "country": "MM",
    "region": "Yangon Region",
    "city": "Kanbe",
    "lat": 16.83382,
    "lng": 96.16603,
    "postalCode": "",
    "timezone": "+06:30",
    "geonameId": 1320942
  },
  "as": {
    "asn": 133384,
    "name": "GTCL-AS-AP",
    "route": "45.125.4.0/24",
    "domain": "",
    "type": ""
  },
  "isp": ""
}

const geocode = [16.83382,96.16603]

const customIcon = L.icon({
  iconUrl: popup,
  iconSize: [32, 40], // adjust as needed
  iconAnchor: [16, 40], // adjust as needed
});

const [loading,setLoading] = useState(false)
const [error,setError] = useState()
const [tracker,setTracker] = useState(null)
const [isopen,setIsOpen] = useState(false)
const showmap = useRef(null)

const HandleCLickOutside = (e)=>{
  if(showmap.current && !showmap.current.contains(e.target)){
    setIsOpen(false)
  }
}
useEffect(() => {
  document.addEventListener('mousedown', HandleCLickOutside)
  document.addEventListener('touchstart', HandleCLickOutside)
  return () => {
    document.removeEventListener('mousedown', HandleCLickOutside)
    document.removeEventListener('touchstart', HandleCLickOutside)
  }
}, [])

const [ip, setIp] = useState('')


const GetLocation = async (ip) => {

  const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_mKWO02AvC87dNSazLKD9pdCKGXPrs&ipAddress=${ip}`
  setLoading(true)
  if(ip.length>0){
      const response = await fetch(apiURL)
      if(!response.ok){
        throw new Error('Failed to fetch data')
        setError('Failed to fetch data')
      }
      else{
        setLoading(false)
        setError(null)
        const data = await response.json()
        setTracker(data)
      }
  }
  else{
    setError('Please enter a valid IP address or domain')
    setLoading(false)
  }
}



  return (

    <section className='content border border-danger w-100'>
      <div className="header border border-primary d-flex flex-column align-items-center justify-content-center text-center"
      style={{backgroundImage: `url(${bgMobile})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>

        
        <h1>IP Address Tracker</h1> 

        <div className="search mt-3 d-flex shadow-lg"
        style={{width: '90%'}}>
            
            <input type="text" value={ip} onChange={(e)=>setIp(e.target.value)} className='searchBar p-3 border-0'
            style={{outline: 'none',width:'80%',}}
            placeholder='Search for any IP address or domain'/>

            <i className="icon_btn fa-solid fa-angle-right d-flex align-items-center justify-content-center bg-dark text-light"
              style={{width: '20%', height: '100%', cursor: 'pointer'}}
              onClick={()=>GetLocation(ip)}
            ></i>
        </div>
        {
          loading ? 
        <p className='text-light fw-bold mt-3'
          style={{height:'20px'}}
          >
          Please Wait!
        </p>
        :
        null
        }
        {
          error ?
            <p className='text-danger fw-bold mt-3'
            style={{height:'20px'}}>
              {error}
            </p>
            :
            null
        }
        {
          tracker && tracker.ip && !loading ?
             <div className="result border-danger border-3"
              style={{width:'80%'}}
            >
              <div className="d-flex flex-column">
                <div className="text-center pt-2">
                  <h5 className='text-secondary'>IP Address</h5>
                  <p className='fw-bold'>{tracker.ip}</p>
                </div>
                <div className="text-center pt-2">
                  <h5 className='text-secondary'>Location</h5>
                  <p className='fw-bold'>{tracker.location?.city}, {tracker.location?.region}</p>
                </div>
                <div className="text-center pt-2">
                  <h5 className='text-secondary'>Timezone</h5>
                  <p className='fw-bold'>UTC {tracker.location?.timezone}</p>
                </div>
                <div className="text-center pt-2">
                  <h5 className='text-secondary '>ISP</h5>
                  <p className='fw-bold'>{tracker.isp ? tracker.isp : "N/A"}</p>
                </div>
              </div>
            </div>
            :
            null
        }


      </div>
      

      <div className="map border border-danger border-2">
        <MapContainer center={[iptracker.location.lat, iptracker.location.lng]} zoom={13}>  
            <TileLayer
             attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>' 
             url='https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=naK2uFFuBtzbU3Eri7t3'
             />
             {
              tracker && tracker.location &&
              <Marker position={[tracker.location.lat, tracker.location.lng]} icon={customIcon}>
             </Marker>}
          </MapContainer>
      </div>

    </section>
    
  )
}

export default App