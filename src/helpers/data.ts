import { PointTuple } from "leaflet";

export interface DataType {
    key: string;
    coordinate: PointTuple;
}

// исходные данные 
export const data: DataType[] = [
    {key: '1', coordinate: [59.84660399, 30.19496392]},
    {key: '2', coordinate: [59.82934196, 30.42423701]},
    {key: '3', coordinate: [59.83567701, 30.38064206]},
    {key: '4', coordinate: [59.93567701, 30.48064206]},
];
