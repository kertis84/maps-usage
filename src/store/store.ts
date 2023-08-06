import { combineReducers, createStore, applyMiddleware } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import { takeEvery } from "redux-saga/effects";
import { setWayPointsSaga } from "./sagas/sagas";
import { pathReducer, wayPointsReducer } from "./reducers/reducers";
import { SET_ROUTE } from "./actions/actions";

const sagaMiddleware = createSagaMiddleware();

// главная сага
function* sagas() {
  yield takeEvery(SET_ROUTE, setWayPointsSaga);
};

// главный reducer
const rootReducer = combineReducers({
  waypoints: wayPointsReducer,    // контрольные точки и название маршрута
  path: pathReducer               // трек
});

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(sagas);

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
