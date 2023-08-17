import { PointTuple } from "leaflet";
import { DataType } from "../../helpers/data";

export const GET_OSRM_PATH_SUCCEEDED = 'GET_OSRM_PATH_SUCCEEDED';
export const GET_OSRM_PATH_ERROR = 'GET_OSRM_PATH_ERROR';
export const SET_WAYPOINTS = 'SET_WAYPOINTS';

// reducer для трека
export const pathReducer = (
    state: PointTuple[] = [],
    action: { type: string; payload: PointTuple[] },
) => {
    switch (action.type) {
        case GET_OSRM_PATH_SUCCEEDED:   // запись трека в store
            return action.payload;
        case GET_OSRM_PATH_ERROR:       // трек не удалось получить
            return [];
        default:
            return state;
    }
};

// reducer для маршрута
export const wayPointsReducer = (
    state: DataType[] = [],
    action: { type: string; payload: DataType[] },
) => {
    switch (action.type) {
        case SET_WAYPOINTS:         // запись выбранного маршрута в store (название и контрольные точки)
            return action.payload;
        default:
            return state;
    }
};

