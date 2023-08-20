import { call, put } from 'redux-saga/effects';
import { AxiosError, AxiosResponse } from 'axios';
import OSRMResponse from '../../models/OSRMResponse';
import { getPolylines } from '../../services/OSRMService';
import polyline from '@mapbox/polyline';
import { GET_OSRM_PATH_ERROR, GET_OSRM_PATH_SUCCEEDED, SET_WAYPOINTS } from '../reducers/reducers';
import { DataType } from '../../helpers/data';
import { API_URL } from '../../services/axios';


enum ErrTypeEnum {
    ERR_BAD_REQUEST = 'ERR_BAD_REQUEST',
    ERR_NETWORK = 'ERR_NETWORK',
    CONSOLE_LOG = 'ANY_ERR',
}

function message_err(err: AxiosError<any, any>) {
    const err_types = {
        'ERR_BAD_REQUEST': () => alert('Невозможно построить маршрут'),
        'ERR_NETWORK': () => alert(['Ошибка соединения с сервером построения маршрута', API_URL, 'Попробуйте использовать VPN или прокси'].join('\n')),
        'ANY_ERR': () => console.error(err),
    };

    const message_fn = err_types[err.code as ErrTypeEnum ?? 'ANY_ERR'];
    message_fn();
}

// Устанавливаем маршрут в два этапа. Запишем выбранный маршрут в store, затем запрашиваем трек
export function* setWayPointsSaga({
    payload,
}: {
    type: 'SET_ROUTE';
    payload: DataType[];
}) {
    yield put({ type: SET_WAYPOINTS, payload: payload });
    if (payload.length > 1) {
        try {
            const response: AxiosResponse<OSRMResponse> = yield call(getPolylines, payload.map((val) => val.coordinate));
            const res = response.data.code.toLocaleUpperCase() === 'OK' ? response.data.routes.map((m) => polyline.decode(m.geometry)) : [];
            const action = res ? { type: GET_OSRM_PATH_SUCCEEDED, payload: res } : { type: GET_OSRM_PATH_ERROR }
            yield put(action);
        }
        catch (err) {
            err instanceof AxiosError ? message_err(err) : console.error(err);
            yield put({ type: GET_OSRM_PATH_ERROR });
        }
    }
    else {
        yield put({ type: GET_OSRM_PATH_ERROR });
    }
}

