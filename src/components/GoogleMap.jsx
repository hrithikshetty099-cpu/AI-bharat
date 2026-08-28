import { useEffect, useRef, useState } from 'react'

export default function GoogleMap({ location, nextDestination, itineraryPlaces = [], route, onRecenter, onRouteUpdate }) {
  const mapNode = useRef(null)
  const map = useRef(null)
  const userMarker = useRef(null)
  const destinationMarkers = useRef([])
  const directionsRenderer = useRef(null)
  const directionsService = useRef(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  // Dynamically load Google Maps script
  useEffect(() => {
    const existingScript = document.getElementById('googleMapsScript')
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    
    const initializeGoogleMap = () => {
      setMapsLoaded(true)
    }

    if (!existingScript) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
      script.id = 'googleMapsScript'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
      script.onload = initializeGoogleMap
    } else if (window.google && window.google.maps) {
      initializeGoogleMap()
    } else {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval)
          initializeGoogleMap()
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }
  }, [])

  // Initialize the Map object
  useEffect(() => {
    if (!mapsLoaded || !mapNode.current) return

    const centerLat = nextDestination?.latitude || 12.9716
    const centerLng = nextDestination?.longitude || 77.5946

    map.current = new window.google.maps.Map(mapNode.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: false
    })

    directionsService.current = new window.google.maps.DirectionsService()
    directionsRenderer.current = new window.google.maps.DirectionsRenderer({
      map: map.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#e8753d',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    })

    return () => {
      map.current = null
    }
  }, [mapsLoaded, nextDestination?.latitude, nextDestination?.longitude])

  // Update markers and polyline navigation
  useEffect(() => {
    if (!map.current) return

    // 1. Update user location marker
    if (location) {
      const position = { lat: location.latitude, lng: location.longitude }
      if (!userMarker.current) {
        userMarker.current = new window.google.maps.Marker({
          position,
          map: map.current,
          title: 'Your live location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#1e6a52',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        })
      } else {
        userMarker.current.setPosition(position)
      }
    }

    // 2. Clear old destination markers
    destinationMarkers.current.forEach((marker) => {
      if (marker) marker.setMap(null)
    })
    destinationMarkers.current = []

    // 3. Add new destination markers
    destinationMarkers.current = itineraryPlaces.filter(Boolean).map((place, index) => {
      const isNext = index === 0
      const marker = new window.google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map: map.current,
        title: place.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: isNext ? '#e8753d' : '#b08a45',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<b>${place.name}</b><br/>${place.category}`
      })

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker)
      })

      return marker
    })

    // 4. Request route navigation
    if (location && nextDestination && directionsService.current && directionsRenderer.current) {
      const origin = new window.google.maps.LatLng(location.latitude, location.longitude)
      const dest = new window.google.maps.LatLng(nextDestination.latitude, nextDestination.longitude)
      
      directionsService.current.route(
        {
          origin: origin,
          destination: dest,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.current.setDirections(result)
            
            const routeLeg = result.routes[0].legs[0]
            onRouteUpdate?.({
              distance: routeLeg.distance.text,
              duration: routeLeg.duration.text
            })
          } else {
            console.error('Directions request failed due to ' + status)
          }
        }
      )
    } else {
      if (directionsRenderer.current) {
        directionsRenderer.current.setDirections({ routes: [] })
      }
      
      // Fit bounds to show all markers if not using directions
      const bounds = new window.google.maps.LatLngBounds()
      let hasPoints = false
      if (location) {
        bounds.extend({ lat: location.latitude, lng: location.longitude })
        hasPoints = true
      }
      if (nextDestination) {
        bounds.extend({ lat: nextDestination.latitude, lng: nextDestination.longitude })
        hasPoints = true
      }

      if (hasPoints) {
        map.current.fitBounds(bounds)
      }
    }
  }, [location, itineraryPlaces, route, nextDestination])

  const recenter = () => {
    if (location && map.current) {
      map.current.panTo({ lat: location.latitude, lng: location.longitude })
    }
    onRecenter?.()
  }

  return (
    <div className="google-map-shell" style={{ height: '100%', width: '100%', minHeight: '100%' }}>
      <div ref={mapNode} className="google-map-canvas" style={{ height: '100%', width: '100%', minHeight: '350px' }} />
      <div className="map-mode-badge">GOOGLE MAPS · NAVIGATING</div>
      <div className="map-controls">
        <button onClick={recenter} disabled={!location} title="Center on my location">◎</button>
        <button onClick={() => map.current && map.current.setZoom(map.current.getZoom() + 1)} title="Zoom in">+</button>
        <button onClick={() => map.current && map.current.setZoom(map.current.getZoom() - 1)} title="Zoom out">−</button>
      </div>
    </div>
  )
}

