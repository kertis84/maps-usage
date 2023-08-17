export default interface OSRMResponse {
    code: string;
    routes: IRoute[];
};

interface IRoute {
    distance: number;
    duration: number;
    geometry: string;
    legs: ILeg[];
    weight: number;
    weight_name: string;
};

interface ILeg {
    distance: number;
    duration: number;
    steps: number[];
    summary: string;
    weight: number;
};
