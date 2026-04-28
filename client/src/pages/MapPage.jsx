import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { API } from '../context/AuthContext';
import './MapPage.css';

const centerDefault = [20.5937, 78.9629]; // Lat, Lng

export default function MapPage() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                    // Fetch nearby stores
                    API.get(`/stores?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&radius=100`)
                        .then(res => setStores(res.data))
                        .catch(() => fetchAllStores())
                        .finally(() => setLoading(false));
                },
                () => fetchAllStores()
            );
        } else {
            fetchAllStores();
        }
    }, []);

    const fetchAllStores = () => {
        API.get('/stores')
            .then(res => setStores(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return (
        <div className="map-page">
            <div className="map-sidebar">
                <div className="map-sidebar-header">
                    <h2><MapPin size={20} /> Nearby Stores</h2>
                    <p>{stores.length} stores found {userLocation ? 'near you' : 'across India'}</p>
                </div>
                <div className="map-store-list">
                    {loading ? (
                        <div className="spinner"></div>
                    ) : stores.length === 0 ? (
                        <p style={{ padding: '24px', color: 'var(--gray-400)', textAlign: 'center' }}>No stores found nearby.</p>
                    ) : (
                        stores.map((store, i) => (
                            <motion.div key={store._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                <div className={`map-store-item ${selectedStore?._id === store._id ? 'selected' : ''}`} onClick={() => setSelectedStore(store)}>
                                    <img src={store.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200'} alt={store.name} />
                                    <div className="map-store-info">
                                        <h4>{store.name}</h4>
                                        <p className="map-store-cat">{store.category}</p>
                                        <div className="map-store-meta">
                                            <span className="stars"><Star size={12} fill="currentColor" /> {store.rating}</span>
                                            {userLocation && store.location?.coordinates && (
                                                <span><Navigation size={12} /> {getDistance(userLocation[0], userLocation[1], store.location.coordinates[1], store.location.coordinates[0]).toFixed(1)} km</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <div className="map-main">
                <div className="map-placeholder" style={{ zIndex: 0 }}>
                    <MapContainer
                        center={userLocation || centerDefault}
                        zoom={userLocation ? 13 : 5}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* User Location Marker */}
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>You are here</Popup>
                            </Marker>
                        )}

                        {/* Store Markers */}
                        {stores.map((store) => {
                            if (!store.location?.coordinates) return null;
                            const storePos = [store.location.coordinates[1], store.location.coordinates[0]];
                            return (
                                <Marker
                                    key={store._id}
                                    position={storePos}
                                    eventHandlers={{
                                        click: () => setSelectedStore(store),
                                    }}
                                >
                                    {selectedStore?._id === store._id && (
                                        <Popup>
                                            <div className="map-pin-popup" style={{ padding: '4px', maxWidth: '200px' }}>
                                                <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{store.name}</h4>
                                                <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#666' }}>{store.address}</p>
                                                <Link to={`/store/${store._id}`} className="btn btn-primary btn-sm" style={{ display: 'block', textAlign: 'center' }}>
                                                    Visit Store
                                                </Link>
                                            </div>
                                        </Popup>
                                    )}
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
