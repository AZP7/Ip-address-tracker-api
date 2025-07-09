import React, { use, useEffect, useRef, useState } from 'react'
import './App.css'
import { MapContainer,Marker,TileLayer } from 'react-leaflet'
import bgMobile from './assets/images/pattern-bg-mobile.png'
import bgDesktop from './assets/images/pattern-bg-desktop.png'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import popup from './/assets/images/icon-location.svg'
import ChangeMapView from './ChangeMapView';



function App() {
  


const customIcon = L.icon({
  iconUrl: popup,
  iconSize: [32, 40], // adjust as needed
  iconAnchor: [16, 40], // adjust as needed
});

const [loading,setLoading] = useState(false)
const [error,setError] = useState()
const [tracker,setTracker] = useState(null)
const [geocode,setGeocode] = useState()
const Popref = useRef(null)
const [ip, setIp] = useState('')
const [result,setResult] = useState(true)

useEffect(()=>{
  const handleClickOutside = (event) => {
    if(Popref.current && !Popref.current.contains(event.target)){
      setResult(false)
    }}

  document.addEventListener('mousedown',handleClickOutside)
  document.addEventListener('touchstart',handleClickOutside)
  return  () => {
    document.removeEventListener('mousedown',handleClickOutside)
    document.removeEventListener('touchstart',handleClickOutside)
  }
},[])



const GetLocation = async (ip) => {

      const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_mKWO02AvC87dNSazLKD9pdCKGXPrs&ipAddress=${ip}`
      try{
          setLoading(true)
          setError('')
          if(ip && ip.length>0){
            const response = await fetch(apiURL)
            if(!response.ok){
              throw new Error('Failed to fetch data')
            }
            const data = await response.json()
            setTracker(data)
            setGeocode([data.location.lat, data.location.lng])
            setResult(true)
          }
      }catch(error){
        setError(error.message || "Something went wrong! Please try again later.")
    }finally{
        setLoading(false)
    }
}
const [desktop, setDesktop] = useState(window.innerWidth > 1023);

useEffect(() =>{
  const handleResize = () => {
    setDesktop(window.innerWidth > 1024);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
},[])

  return (

    <section className='content w-100'>
      <div className="header border border-primary d-flex flex-column align-items-center justify-content-center text-center"
      style={{backgroundImage: `url(${desktop ? bgDesktop : bgMobile})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>

        
        <h1 className='text-light fw-bold'>IP Address Tracker</h1> 

        <div className="search mt-3 d-flex shadow-lg"
        style={{width: '90%'}}>
            
            <input type="text" value={ip} onChange={(e)=>setIp(e.target.value)} className='searchBar p-3 border-0' disabled={loading}
            style={{outline: 'none',width:'80%',}}
            placeholder='Search for any IP address or domain'/>

            <i className={`icon_btn fa-solid fa-angle-right d-flex align-items-center justify-content-center bg-dark text-light ${loading ? 'disabled' : ''}`}
              style={{width: '20%', height: '100%'}}
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
          tracker && tracker.ip && result ?
             <div className="result"
              style={{width:'80%'}}
              ref={Popref}
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
      

      <div className="map">
        
        <MapContainer 
          center={Array.isArray(geocode) && geocode.length === 2 ? geocode : [20, 80]}
          zoom={13}>  
            <TileLayer
             attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>' 
             url='https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=naK2uFFuBtzbU3Eri7t3'
             />
             <ChangeMapView coords={geocode} />
            {Array.isArray(geocode) && geocode.length === 2 &&
              <Marker position={geocode} icon={customIcon} />
            }
          </MapContainer>
      </div>

    </section>
    
  )
}

export default App