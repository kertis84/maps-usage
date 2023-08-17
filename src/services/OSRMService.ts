import $api from "./axios";
import { AxiosResponse } from "axios";
import OSRMResponse from "../models/OSRMResponse";
import { PointTuple } from "leaflet";


const params = new URLSearchParams({ skip_waypoints: 'true', geometries: 'polyline', overview: 'full'});

export const getPolylines = async (points: PointTuple[]): Promise<AxiosResponse<OSRMResponse>> => {
        const coordinates_str = points.map(point => [...point].reverse().join(',')).join(';');
        return await $api.get<OSRMResponse>(coordinates_str + '?' + params.toString());
    }
