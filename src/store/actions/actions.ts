import { DataType } from "../../helpers/data";

export const SET_ROUTE = 'SET_ROUTE';

// наш единственный action устанавливает выбранный маршрут
export const setWaypoints = (waypoints: DataType[]) => ({
    type: SET_ROUTE,
    payload: waypoints,
});

