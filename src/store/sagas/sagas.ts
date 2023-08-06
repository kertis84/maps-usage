import { call, put } from 'redux-saga/effects';
import { AxiosError, AxiosResponse } from "axios";
import OSRMResponse from "../../models/OSRMResponse";
import { getPolylines } from "../../services/OSRMService";
import polyline from "@mapbox/polyline";
import { GET_OSRM_PATH_ERROR, GET_OSRM_PATH_SUCCEEDED, SET_WAYPOINTS } from '../reducers/reducers';
import { DataType } from '../../helpers/data';


// Устанавливаем маршрут в два этапа. Запишем выбранный маршрут в store, затем запрашиваем трек
export function* setWayPointsSaga({
    payload,
}: {
    type: "SET_ROUTE";
    payload: DataType[];
}) {
    yield put({ type: SET_WAYPOINTS, payload: payload });
    if (payload.length > 1) {
        try {
            const response: AxiosResponse<OSRMResponse> = yield call(getPolylines, payload.map((val) => val.coordinate));
            if (response.data.code.toLocaleUpperCase() === "OK") {
                const res = response.data.routes.map((m) => polyline.decode(m.geometry));
                yield put({ type: GET_OSRM_PATH_SUCCEEDED, payload: res });
            }
            else {
                yield put({ type: GET_OSRM_PATH_ERROR });
            }
        }
        catch (err) {
            if (err instanceof AxiosError) {
                if (err.code === 'ERR_BAD_REQUEST')
                    alert("Невозможно построить маршрут");
                else if (err.code === 'ERR_NETWORK')
                    alert("Ошибка соединения с сервером построения маршрута\nhttp://router.project-osrm.org\nПопробуйте использовать VPN или прокси");
                else
                    console.error(err);
            }
            else {
                console.error(err);
            }
        }
    }
}