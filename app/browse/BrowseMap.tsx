"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapListing = {
  id: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  monthlyRent: number;
  suburb: string;
  city: string;
};

type BrowseMapProps = {
  listings: MapListing[];
};

// ============================================================
// MAP BOUNDS
// ============================================================

function MapBounds({
  listings,
}: {
  listings: MapListing[];
}) {
  const map = useMap();

  useEffect(() => {
    // Only use listings that have valid coordinates.
    const validListings = listings.filter(
      (listing) =>
        Number.isFinite(listing.latitude) &&
        Number.isFinite(listing.longitude)
    );

    // If no listings have coordinates, keep
    // the default map position.
    if (validListings.length === 0) return;

    const bounds = L.latLngBounds(
      validListings.map((listing) => [
        listing.latitude as number,
        listing.longitude as number,
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [listings, map]);

  return null;
}

// ============================================================
// BROWSE MAP
// ============================================================

export default function BrowseMap({
  listings,
}: BrowseMapProps) {
  const markerIcon = useRef(
    L.icon({
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
  );

  // Harare fallback center.
  const defaultCenter: [number, number] = [
    -17.8252,
    31.0335,
  ];

  // Only render markers for listings
  // that actually have coordinates.
  const validListings = listings.filter(
    (listing) =>
      Number.isFinite(listing.latitude) &&
      Number.isFinite(listing.longitude)
  );

  return (
    <div className="sticky top-6 h-[650px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds listings={listings} />

        {validListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[
              listing.latitude as number,
              listing.longitude as number,
            ]}
            icon={markerIcon.current}
          >
            <Popup>
              <div className="min-w-[180px]">
                <h3 className="font-semibold text-slate-900">
                  {listing.title}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {listing.suburb}, {listing.city}
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  US${listing.monthlyRent}/month
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}