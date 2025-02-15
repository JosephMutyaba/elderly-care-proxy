'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getLocationData } from "@/app/actions/locationactions";

interface LocationData {
    lat: number | null;
    lng: number | null;
    id: number;
    timestamp: string;
}

export default function GoogleMaps() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState<string | null>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const pathRef = useRef<google.maps.Polyline | null>(null);
    const [locations, setLocations] = useState<LocationData[]>([]);

    const loaderRef = useRef<Loader>(new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
    }));

    // Initialize map
    useEffect(() => {
        let isMounted = true;

        const initializeMap = async () => {
            if (!mapRef.current || googleMapRef.current) return;

            try {
                setIsLoading(true);
                setMapError(null);

                // Wait for DOM to be ready
                await new Promise(resolve => setTimeout(resolve, 100));

                if (!isMounted || !mapRef.current) return;

                const { Map } = await loaderRef.current.importLibrary('maps');
                const { Marker } = await loaderRef.current.importLibrary('marker') as google.maps.MarkerLibrary;

                const defaultCenter = { lat: 39.60128890889341, lng: -9.069839810859907 };

                if (!mapRef.current) {
                    throw new Error('Map container not found');
                }

                googleMapRef.current = new Map(mapRef.current, {
                    center: defaultCenter,
                    zoom: 20,
                    mapId: 'NEXT_MAPS_TUTS',
                });

                // Add legend
                const legend = document.createElement('div');
                legend.className = 'bg-white p-2 rounded shadow-md absolute bottom-4 right-4';
                legend.innerHTML = `
                    <div class="text-sm font-semibold mb-2 text-black">Movement Timeline</div>
                    <div class="flex items-center gap-2 bg-gray-100 p-2">
                        <div class="w-4 h-4 rounded-full" style="background: red"></div>
                        <span class="text-xs text-black">Start</span>
                        <div class="w-20 h-4" style="background: linear-gradient(to right, red, blue)"></div>
                        <div class="w-4 h-4 rounded-full" style="background: blue"></div>
                        <span class="text-xs text-black">Current</span>
                    </div>
                `;
                googleMapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

            } catch (error) {
                if (isMounted) {
                    setMapError(error instanceof Error ? error.message : 'Failed to load map');
                    console.error('Map initialization error:', error);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeMap();

        return () => {
            isMounted = false;
            markersRef.current.forEach(marker => marker.setMap(null));
            if (pathRef.current) {
                pathRef.current.setMap(null);
            }
            markersRef.current = [];
        };
    }, []);

    // Update markers when locations change
    useEffect(() => {
        const updateMarkers = async () => {
            if (!googleMapRef.current) return;

            try {
                const { Marker } = await loaderRef.current.importLibrary('marker') as google.maps.MarkerLibrary;
                const { Polyline } = await loaderRef.current.importLibrary('maps');

                // Clear existing markers and path
                markersRef.current.forEach(marker => marker.setMap(null));
                if (pathRef.current) {
                    pathRef.current.setMap(null);
                }
                markersRef.current = [];

                // Create path coordinates
                const pathCoordinates = locations
                    .filter(loc => loc.lat != null && loc.lng != null)
                    .map(loc => ({ lat: loc.lat!, lng: loc.lng! }));

                // Create path
                pathRef.current = new Polyline({
                    path: pathCoordinates,
                    geodesic: true,
                    strokeColor: '#4285F4',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    map: googleMapRef.current
                });

                // Add new markers
                const newMarkers = locations.map((location, index) => {
                    const markerColor = `hsl(${(index / (locations.length - 1)) * 240}, 100%, 50%)`;

                    const markerSvg = {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: markerColor,
                        fillOpacity: 0.9,
                        strokeWeight: 2,
                        strokeColor: 'white',
                        scale: 8
                    };

                    return new Marker({
                        map: googleMapRef.current!,
                        position: { lat: location.lat ?? 0, lng: location.lng ?? 0 },
                        icon: markerSvg,
                        title: location.timestamp
                    });
                });

                markersRef.current = newMarkers;

                if (locations.length > 0) {
                    const lastLocation = locations[locations.length - 1];
                    googleMapRef.current.setCenter({
                        lat: lastLocation.lat ?? 0,
                        lng: lastLocation.lng ?? 0
                    });
                }
            } catch (error) {
                console.error('Error updating markers:', error);
            }
        };

        updateMarkers();
    }, [locations]);

    // Fetch data periodically
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const locationData = await getLocationData(selectedDate, selectedHour);
                if (locationData) {
                    const formattedData = locationData.map(item => ({
                        lat: item.latitude,
                        lng: item.longitude,
                        id: item.id,
                        timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));

                    formattedData.sort((a, b) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );

                    setLocations(formattedData);
                }
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        fetchLocationData();
        const intervalId = setInterval(fetchLocationData, 60000);

        return () => clearInterval(intervalId);
    }, [selectedDate, selectedHour]);

    if (mapError) {
        return <div className="h-[600px] flex items-center justify-center text-red-500">
            Error loading map: {mapError}
        </div>;
    }

    return (
        <>
            <div className="flex gap-4 mb-4">
                <div>
                    <label>Date: </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label>Hour: </label>
                    <input
                        type="number"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(Number(e.target.value))}
                        min="0"
                        max="23"
                        className="border rounded px-2 py-1"
                    />
                </div>
            </div>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    Loading map...
                </div>
            )}
            <div className="h-[600px] relative" ref={mapRef} />
        </>
    );
}





























// 'use client';
//
// import React, { useEffect, useState, useRef } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
// import { getLocationData } from "@/app/actions/locationactions";
//
// interface LocationData {
//     lat: number | null;
//     lng: number | null;
//     id: number;
//     timestamp: string;
// }
//
// export default function GoogleMaps() {
//     const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
//     const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
//     const mapRef = useRef<HTMLDivElement>(null);
//     const [locations, setLocations] = useState<LocationData[]>([]);
//
//     const googleMapRef = useRef<google.maps.Map | null>(null);
//     const markersRef = useRef<google.maps.Marker[]>([]);
//     const pathRef = useRef<google.maps.Polyline | null>(null);
//     const loaderRef = useRef<Loader>(new Loader({
//         apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
//         version: 'quarterly',
//     }));
//
//     // // Function to format timestamp for marker tooltips
//     // const formatTimestamp = (timestamp: string) => {
//     //     try {
//     //         const date = new Date(timestamp);
//     //         if (isNaN(date.getTime())) {
//     //             return 'Invalid date';
//     //         }
//     //         return date.toLocaleTimeString('en-US', {
//     //             hour: '2-digit',
//     //             minute: '2-digit',
//     //             second: '2-digit',
//     //             hour12: true
//     //         });
//     //     } catch (error) {
//     //         return 'Invalid date';
//     //     }
//     // };
//
//     // Initialize map
//     useEffect(() => {
//         const initializeMap = async () => {
//             if (!mapRef.current || googleMapRef.current) return;
//
//             try {
//                 const { Map } = await loaderRef.current.importLibrary('maps');
//
//                 const defaultCenter = { lat: 39.60128890889341, lng: -9.069839810859907 };
//
//                 googleMapRef.current = new Map(mapRef.current, {
//                     center: defaultCenter,
//                     zoom: 20,
//                     mapId: 'NEXT_MAPS_TUTS',
//                 });
//
//                 addLegendToMap(googleMapRef.current);
//             } catch (error) {
//                 console.error('Error initializing map:', error);
//             }
//         };
//
//         initializeMap();
//
//         return () => {
//             markersRef.current.forEach(marker => marker.setMap(null));
//             if (pathRef.current) {
//                 pathRef.current.setMap(null);
//             }
//             markersRef.current = [];
//         };
//     }, []);
//
//     // Function to add legend
//     const addLegendToMap = (map: google.maps.Map) => {
//         const legend = document.createElement('div');
//         legend.className = 'bg-white p-2 rounded shadow-md absolute bottom-4 right-4';
//         legend.innerHTML = `
//             <div class="text-sm font-semibold mb-2">Movement Timeline</div>
//             <div class="flex items-center gap-2 bg-gray-100 p-2">
//                 <div class="w-4 h-4 rounded-full" style="background: red"></div>
//                 <span class="text-xs">Start</span>
//                 <div class="w-20 h-4" style="background: linear-gradient(to right, red, blue)"></div>
//                 <div class="w-4 h-4 rounded-full" style="background: blue"></div>
//                 <span class="text-xs">Current</span>
//             </div>
//         `;
//         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
//     };
//
//     const getMarkerColor = (index: number, total: number) => {
//         const hue = (index / total) * 240;
//         return `hsl(${hue}, 100%, 50%)`;
//     };
//
//     // Update markers and path
//     const updateMarkersAndPath = async () => {
//         if (!googleMapRef.current) return;
//
//         try {
//             // Import both libraries separately
//             const { Marker } = await loaderRef.current.importLibrary('marker') as google.maps.MarkerLibrary;
//             const { Polyline } = await loaderRef.current.importLibrary('maps');
//
//             // Clear existing markers and path
//             markersRef.current.forEach(marker => marker.setMap(null));
//             if (pathRef.current) {
//                 pathRef.current.setMap(null);
//             }
//             markersRef.current = [];
//
//             // Create path coordinates
//             const pathCoordinates = locations
//                 .filter(loc => loc.lat != null && loc.lng != null)
//                 .map(loc => ({ lat: loc.lat!, lng: loc.lng! }));
//
//             // Create path
//             pathRef.current = new Polyline({
//                 path: pathCoordinates,
//                 geodesic: true,
//                 strokeColor: '#4285F4',
//                 strokeOpacity: 0.8,
//                 strokeWeight: 3,
//                 map: googleMapRef.current
//             });
//
//             // Add new markers
//             const newMarkers = locations.map((location, index) => {
//                 const markerColor = getMarkerColor(index, locations.length - 1);
//
//                 const markerSvg = {
//                     path: google.maps.SymbolPath.CIRCLE,
//                     fillColor: markerColor,
//                     fillOpacity: 0.9,
//                     strokeWeight: 2,
//                     strokeColor: 'white',
//                     scale: 8
//                 };
//
//                 return new Marker({
//                     map: googleMapRef.current!,
//                     position: { lat: location.lat ?? 0, lng: location.lng ?? 0 },
//                     icon: markerSvg,
//                     title: formatTimestamp(location.timestamp)
//                 });
//             });
//
//             markersRef.current = newMarkers;
//
//             // Center map on latest location if available
//             if (locations.length > 0) {
//                 const lastLocation = locations[locations.length - 1];
//                 googleMapRef.current.setCenter({
//                     lat: lastLocation.lat ?? 0,
//                     lng: lastLocation.lng ?? 0
//                 });
//             }
//         } catch (error) {
//             console.error('Error updating markers and path:', error);
//         }
//     };
//
//     // Update markers when locations change
//     useEffect(() => {
//         updateMarkersAndPath();
//     }, [locations]);
//
//
//
//     // Function to format timestamp for marker tooltips
//     const formatTimestamp = (timestamp: string) => {
//         try {
//             // First check if we can create a valid date from the timestamp
//             const date = new Date(timestamp);
//             if (isNaN(date.getTime())) {
//                 console.log('Invalid timestamp received:', timestamp); // For debugging
//                 return 'Invalid time';
//             }
//
//             // Only return the time portion
//             return date.toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: false // 24-hour format
//             });
//         } catch (error) {
//             console.log('Error parsing timestamp:', timestamp, error); // For debugging
//             return 'Invalid time';
//         }
//     };
//
//
//     // Fetch data periodically
//     useEffect(() => {
//         const fetchLocationData = async () => {
//             try {
//                 const locationData = await getLocationData(selectedDate, selectedHour);
//                 if (locationData) {
//                     const formattedData = locationData.map(item => ({
//                         lat: item.latitude,
//                         lng: item.longitude,
//                         id: item.id,
//                         timestamp: formatTimestamp(item.created_at)
//                     }));
//
//                     formattedData.sort((a, b) =>
//                         new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//                     );
//
//                     setLocations(formattedData);
//                 }
//             } catch (error) {
//                 console.error('Error fetching location data:', error);
//             }
//         };
//
//         // Initial fetch
//         fetchLocationData();
//
//         // Set up interval for periodic fetching (every minute)
//         const intervalId = setInterval(fetchLocationData, 60000);
//
//         // Cleanup interval on unmount or when date/hour changes
//         return () => clearInterval(intervalId);
//     }, [selectedDate, selectedHour]);
//
//     return (
//         <>
//             <div className="flex gap-4 mb-4">
//                 <div>
//                     <label>Date: </label>
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         className="border rounded px-2 py-1"
//                     />
//                 </div>
//                 <div>
//                     <label>Hour: </label>
//                     <input
//                         type="number"
//                         value={selectedHour}
//                         onChange={(e) => setSelectedHour(Number(e.target.value))}
//                         min="0"
//                         max="23"
//                         className="border rounded px-2 py-1"
//                     />
//                 </div>
//             </div>
//             <div className="h-[600px]" ref={mapRef} />
//         </>
//     );
// }






























// 'use client';
//
// import React, { useEffect, useState } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
// import {getLocationData} from "@/app/actions/locationactions";
//
// interface LocationData {
//     lat: number | null;
//     lng: number | null;
//     id: number;
//     timestamp: string;  // Added timestamp field
// }
//
// export default function GoogleMaps() {
//     const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
//     const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
//     const mapRef = React.useRef<HTMLDivElement>(null);
//     const [locations, setLocations] = useState<LocationData[]>([]);
//
//     // Function to generate color based on position in timeline
//     const getMarkerColor = (index: number, total: number) => {
//         // Generate a color gradient from red (older) to blue (newer)
//         const hue = (index / total) * 240; // 0 (red) to 240 (blue)
//         return `hsl(${hue}, 100%, 50%)`;
//     };
//
//     useEffect(() => {
//         const fetchLocationData = async () => {
//             const locationData = await getLocationData(selectedDate, selectedHour);
//             if (locationData) {
//                 const formattedData = locationData.map(item => ({
//                     lat: item.latitude,
//                     lng: item.longitude,
//                     id: item.id,
//                     timestamp: item.created_at // Make sure this field exists in your DB
//                 }));
//                 // Sort by timestamp to ensure correct color progression
//                 formattedData.sort((a, b) =>
//                     new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//                 );
//                 setLocations(formattedData);
//             }
//         };
//
//         const initializeMap = async () => {
//             const loader = new Loader({
//                 apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
//                 version: 'quarterly',
//             });
//
//             const { Map } = await loader.importLibrary('maps');
//             const { Marker } = (await loader.importLibrary('marker')) as google.maps.MarkerLibrary;
//
//             const centerLocation = locations.length > 0
//                 ? { lat: locations[locations.length - 1].lat!, lng: locations[locations.length - 1].lng! }
//                 : { lat: 39.60128890889341, lng: -9.069839810859907 };
//
//             const options: google.maps.MapOptions = {
//                 center: centerLocation,
//                 zoom: 20,
//                 mapId: 'NEXT_MAPS_TUTS',
//             };
//
//             const map = new Map(mapRef.current as HTMLDivElement, options);
//
//             // Create markers with gradient colors
//             locations.forEach((location, index) => {
//                 const markerColor = getMarkerColor(index, locations.length - 1);
//
//                 // Create custom SVG marker
//                 const markerSvg = {
//                     path: google.maps.SymbolPath.CIRCLE,
//                     fillColor: markerColor,
//                     fillOpacity: 0.9,
//                     strokeWeight: 2,
//                     strokeColor: 'white',
//                     scale: 8
//                 };
//
//                 new Marker({
//                     map: map,
//                     position: { lat: location.lat ?? 0, lng: location.lng ?? 0 },
//                     icon: markerSvg,
//                     title: new Date(location.timestamp).toLocaleTimeString() // Hover tooltip showing time
//                 });
//             });
//
//             // Add a legend
//             const legend = document.createElement('div');
//             legend.className = 'bg-white p-2 rounded shadow-md absolute bottom-4 right-4';
//             legend.innerHTML = `
//                 <div class="text-sm font-semibold mb-2">Timeline</div>
//                 <div class="flex items-center gap-2 bg-gray-100">
//                     <div class="w-4 h-4 rounded-full" style="background: red"></div>
//                     <span class="text-xs">Older</span>
//                     <div class="w-20 h-4" style="background: linear-gradient(to right, red, blue)"></div>
//                     <div class="w-4 h-4 rounded-full" style="background: blue"></div>
//                     <span class="text-xs">Newer</span>
//                 </div>
//             `;
//             map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
//         };
//
//         fetchLocationData().then(initializeMap);
//     }, [selectedDate, selectedHour]);
//
//     return(
//         <>
//             <div className="flex gap-4 mb-4">
//                 <div>
//                     <label>Date: </label>
//                     <input
//                         type="date"
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         className="border rounded px-2 py-1"
//                     />
//                 </div>
//                 <div>
//                     <label>Hour: </label>
//                     <input
//                         type="number"
//                         value={selectedHour}
//                         onChange={(e) => setSelectedHour(Number(e.target.value))}
//                         min="0"
//                         max="23"
//                         className="border rounded px-2 py-1"
//                     />
//                 </div>
//             </div>
//             <div className="h-[600px]" ref={mapRef} />
//         </>
//     );
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // 'use client';
// //
// // import React, { useEffect, useState } from 'react';
// // import { Loader } from '@googlemaps/js-api-loader';
// // import { getLocationData } from "@/app/actions/actions";
// //
// // interface LocationData {
// //     lat: number | null;
// //     lng: number | null;
// //     id: number;  // Assuming `id` or a unique field to identify the latest location
// //     // Add other fields as necessary from `locationdata`
// // }
// //
// // export default function GoogleMaps() {
// //     const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
// //     const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());
// //
// //     const mapRef = React.useRef<HTMLDivElement>(null);
// //     const [locations, setLocations] = useState<LocationData[]>([]);
// //
// //     useEffect(() => {
// //         const fetchLocationData = async () => {
// //             const locationData = await getLocationData(selectedDate, selectedHour);
// //             if (locationData) {
// //                 const formattedData = locationData.map(item => ({
// //                     lat: item.latitude, // Update as per your DB field
// //                     lng: item.longitude, // Update as per your DB field
// //                     id: item.id, // Ensure you have a unique identifier
// //                 }));
// //                 setLocations(formattedData);
// //             }
// //         };
// //
// //         const initializeMap = async () => {
// //             const loader = new Loader({
// //                 apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
// //                 version: 'quarterly',
// //             });
// //
// //             const { Map } = await loader.importLibrary('maps');
// //             const { Marker } = (await loader.importLibrary('marker')) as google.maps.MarkerLibrary;
// //
// //             // Center map on the last location if available, or a default location
// //             const centerLocation = locations.length > 0
// //                 ? { lat: locations[locations.length - 1].lat!, lng: locations[locations.length - 1].lng! }
// //                 : { lat: 39.60128890889341, lng: -9.069839810859907 }; // Fallback center
// //
// //             const options: google.maps.MapOptions = {
// //                 center: centerLocation,
// //                 zoom: 15,
// //                 mapId: 'NEXT_MAPS_TUTS',
// //             };
// //
// //             const map = new Map(mapRef.current as HTMLDivElement, options);
// //
// //             locations.forEach((location, index) => {
// //                 new Marker({
// //                     map: map,
// //                     position: { lat: location.lat ?? 0 , lng: location.lng ?? 0 },
// //                     icon: index === locations.length - 1
// //                         ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Different color for last marker
// //                         : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Regular markers
// //                 });
// //             });
// //         };
// //
// //         fetchLocationData().then(initializeMap);
// //     }, [selectedDate, selectedHour]); // Re-run effect when `selectedDate` or `selectedHour` changes
// //
// //     return(
// //         <>
// //             <div className="flex gap-4 mb-4">
// //                 <div>
// //                     <label>Date: </label>
// //                     <input
// //                         type="date"
// //                         value={selectedDate}
// //                         onChange={(e) => setSelectedDate(e.target.value)}
// //                         className="border rounded px-2 py-1"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label>Hour: </label>
// //                     <input
// //                         type="number"
// //                         value={selectedHour}
// //                         onChange={(e) => setSelectedHour(Number(e.target.value))}
// //                         min="0"
// //                         max="23"
// //                         className="border rounded px-2 py-1"
// //                     />
// //                 </div>
// //             </div>
// //             <div className="h-[600px]" ref={mapRef} />
// //         </>
// //     );
// // }
// //
// //
// //
// // // 'use client';
// // //
// // // import React, { useEffect } from 'react';
// // // import { Loader } from '@googlemaps/js-api-loader';
// // //
// // // export default function GoogleMaps() {
// // //     const mapRef = React.useRef<HTMLDivElement>(null);
// // //
// // //     useEffect(() => {
// // //         const initializeMap = async () => {
// // //             const loader = new Loader({
// // //                 apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
// // //                 version: 'quartely',
// // //             });
// // //
// // //             const { Map } = await loader.importLibrary('maps');
// // //
// // //             const locationInMap = {
// // //                 lat: 39.60128890889341,
// // //                 lng: -9.069839810859907,
// // //             };
// // //
// // //             // MARKER
// // //             const { Marker } = (await loader.importLibrary(
// // //                 'marker'
// // //             )) as google.maps.MarkerLibrary;
// // //
// // //             const options: google.maps.MapOptions = {
// // //                 center: locationInMap,
// // //                 zoom: 15,
// // //                 mapId: 'NEXT_MAPS_TUTS',
// // //             };
// // //
// // //             const map = new Map(mapRef.current as HTMLDivElement, options);
// // //
// // //             // add the marker in the map
// // //             const marker = new Marker({
// // //                 map: map,
// // //                 position: locationInMap,
// // //             });
// // //         };
// // //
// // //         initializeMap();
// // //     }, []);
// // //
// // //     return <div className="h-[600px]" ref={mapRef} />;
// // // }