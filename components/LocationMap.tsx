'use client'

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
})

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
})

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false,
})

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
})

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon issue in Next.js
import L from 'leaflet'


const locations = [
  {
    id: 1,
    name: 'United States',
    lat: 39.8283,
    lng: -98.5795,
    address: 'Serving clients across USA',
  },
  {
    id: 2,
    name: 'United Kingdom',
    lat: 54.7024,
    lng: -3.2766,
    address: 'Serving clients across UK',
  },
  {
    id: 3,
    name: 'Qatar',
    lat: 25.3548,
    lng: 51.1839,
    address: 'Serving clients in Qatar',
  },
  {
    id: 4,
    name: 'Saudi Arabia',
    lat: 23.8859,
    lng: 45.0792,
    address: 'Serving clients in Saudi Arabia',
  },
  {
    id: 5,
    name: 'Pakistan',
    lat: 30.3753,
    lng: 69.3451,
    address: 'Serving clients in Pakistan',
  },
]

// Custom red marker icon
const createRedMarkerIcon = () => {
  if (typeof window !== 'undefined' && L) {
    return L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="#DC2626"/>
          <circle cx="16" cy="16" r="8" fill="#FFFFFF"/>
        </svg>
      `),
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    })
  }
  return undefined
}

export default function LocationMap() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Fix for default marker icon
    if (typeof window !== 'undefined' && L) {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
    }
  }, [])

  // Calculate center point for all locations
  const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
  const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length

  if (!isMounted) {
    return (
      <Box
        sx={{
          width: '100%',
          height: { xs: '400px', md: '500px' },
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
        }}
      >
        Loading map...
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: '400px', md: '500px' },
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        mt: 3,
      }}
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          const redIcon = createRedMarkerIcon()
          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={redIcon}
            >
              <Popup>
                <Box sx={{ p: 1 }}>
                  <strong>{location.name}</strong>
                  <br />
                  {location.address}
                </Box>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </Box>
  )
}
