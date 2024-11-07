'use client';

import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getLocationData } from "@/app/actions/actions";

interface LocationData {
    lat: number | null;
    lng: number | null;
    id: number;  // Assuming `id` or a unique field to identify the latest location
    // Add other fields as necessary from `locationdata`
}

export default function GoogleMaps() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());

    const mapRef = React.useRef<HTMLDivElement>(null);
    const [locations, setLocations] = useState<LocationData[]>([]);

    useEffect(() => {
        const fetchLocationData = async () => {
            const locationData = await getLocationData(selectedDate, selectedHour);
            if (locationData) {
                const formattedData = locationData.map(item => ({
                    lat: item.latitude, // Update as per your DB field
                    lng: item.longitude, // Update as per your DB field
                    id: item.id, // Ensure you have a unique identifier
                }));
                setLocations(formattedData);
            }
        };

        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
                version: 'quarterly',
            });

            const { Map } = await loader.importLibrary('maps');
            const { Marker } = (await loader.importLibrary('marker')) as google.maps.MarkerLibrary;

            // Center map on the last location if available, or a default location
            const centerLocation = locations.length > 0
                ? { lat: locations[locations.length - 1].lat!, lng: locations[locations.length - 1].lng! }
                : { lat: 39.60128890889341, lng: -9.069839810859907 }; // Fallback center

            const options: google.maps.MapOptions = {
                center: centerLocation,
                zoom: 15,
                mapId: 'NEXT_MAPS_TUTS',
            };

            const map = new Map(mapRef.current as HTMLDivElement, options);

            locations.forEach((location, index) => {
                new Marker({
                    map: map,
                    position: { lat: location.lat ?? 0 , lng: location.lng ?? 0 },
                    icon: index === locations.length - 1
                        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Different color for last marker
                        : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Regular markers
                });
            });
        };

        fetchLocationData().then(initializeMap);
    }, [selectedDate, selectedHour]); // Re-run effect when `selectedDate` or `selectedHour` changes

    return(
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
            <div className="h-[600px]" ref={mapRef} />
        </>
    );
}



// 'use client';
//
// import React, { useEffect } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
//
// export default function GoogleMaps() {
//     const mapRef = React.useRef<HTMLDivElement>(null);
//
//     useEffect(() => {
//         const initializeMap = async () => {
//             const loader = new Loader({
//                 apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
//                 version: 'quartely',
//             });
//
//             const { Map } = await loader.importLibrary('maps');
//
//             const locationInMap = {
//                 lat: 39.60128890889341,
//                 lng: -9.069839810859907,
//             };
//
//             // MARKER
//             const { Marker } = (await loader.importLibrary(
//                 'marker'
//             )) as google.maps.MarkerLibrary;
//
//             const options: google.maps.MapOptions = {
//                 center: locationInMap,
//                 zoom: 15,
//                 mapId: 'NEXT_MAPS_TUTS',
//             };
//
//             const map = new Map(mapRef.current as HTMLDivElement, options);
//
//             // add the marker in the map
//             const marker = new Marker({
//                 map: map,
//                 position: locationInMap,
//             });
//         };
//
//         initializeMap();
//     }, []);
//
//     return <div className="h-[600px]" ref={mapRef} />;
// }