import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function LeafletMapComponent() {
  // Default position: London (you can change this to whatever coordinates you want)
  const position = [51.505, -0.09];

  return (
    <div className="map-wrapper" style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* OpenStreetMap TileLayer (Free) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Add Markers Here */}
        <Marker position={position}>
          <Popup>
            A customizable popup! <br /> Easy to style.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
