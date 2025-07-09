import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function ChangeMapView({ coords }) {

  const map = useMap();

  useEffect(() => {
    if (Array.isArray(coords) && coords.length === 2) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);

  return null;
}
export default ChangeMapView;
