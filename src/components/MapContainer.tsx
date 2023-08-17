import L from "leaflet";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../store/store";
import { getCenter, getKey, precisionRound } from "../helpers/helpers";
import { DataType, data } from "../helpers/data";
import { useDispatch } from "react-redux";
import { setWaypoints } from "../store/actions/actions";

const MapContainer = () => {
    const map = useRef(undefined as unknown as L.Map);
    const pathRef = useRef(undefined as unknown as L.Polyline);
    const tileLayer = useRef(undefined as unknown as L.TileLayer);

    const dispatch = useDispatch();
    const path = useAppSelector((state) => state.path);
    const waypoints = useAppSelector((state) => state.waypoints);


    const SetMarkerListeners = (map: L.Map, marker: L.CircleMarker) => {

        let key = '';

        const trackCursor = (evt: L.LeafletMouseEvent) => marker.setLatLng(evt.latlng);

        marker.on("mousedown", (e) => {
            map.dragging.disable();
            map.on("mousemove", trackCursor);
            waypoints.forEach((point) => {
                if (e.latlng.equals(point.coordinate))
                    key = point.key;
            });
        });

        marker.on("mouseup", function (e) {
            let moved = false;
            map.dragging.enable();
            map.off("mousemove", trackCursor);
            const newWaypoints = waypoints.map((point) => {
                if (point.key === key && !e.latlng.equals(point.coordinate)) {
                    point.coordinate = [precisionRound(e.latlng.lat, 8), precisionRound(e.latlng.lng, 8)];
                    moved = true;
                }
                return point;
            });
            moved && dispatch(setWaypoints(newWaypoints));
        });

        marker.on("contextmenu", function (e) {
            const newWaypoints = waypoints.filter((point) => !e.latlng.equals(point.coordinate));
            dispatch(setWaypoints(newWaypoints));
        });

        return marker;
    }


    useEffect(() => {
        let current_zoom = 10;

        if (map.current) {
            map.current.off();
            map.current.remove();
        }

        map.current = L.map("map", {
            center: getCenter(data.map((point) => point.coordinate)),
            zoom: current_zoom,
            attributionControl: false,
            doubleClickZoom: false
        });

        map.current.setView(
            getCenter(data.map((point) => point.coordinate)),
            map.current.getBoundsZoom(data.map((point) => point.coordinate))
        );

        tileLayer.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.current);
        dispatch(setWaypoints(data));

    }, []);


    useEffect(() => {
        map.current.eachLayer((layer) => {
            layer !== tileLayer.current && layer.remove();
        });

        map.current.off('dblclick');
        map.current.on('dblclick', function (e) {
            const point: DataType = { key: getKey(), coordinate: [precisionRound(e.latlng.lat, 8), precisionRound(e.latlng.lng, 8)] };
            dispatch(setWaypoints([...waypoints, point]));
        });

        if (waypoints.length > 0 && map.current) {
            waypoints.forEach((point) => {
                const marker = L.circleMarker(point.coordinate, {
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 1,
                    radius: 7,
                }).addTo(map.current);

                SetMarkerListeners(map.current, marker);
            });
        }
    }, [waypoints]);


    useEffect(() => {
        path && (pathRef.current = L.polyline(path, { weight: 5 }).addTo(map.current));
    }, [path]);

    return <div id="map" className="map-container"></div>
}

export default MapContainer;
