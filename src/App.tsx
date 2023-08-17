import { Button, Dropdown, MenuProps } from "antd";
import RoutesContainer from "./components/RoutesContainer";
import MapContainer from "./components/MapContainer";


function App() {
    return (
        <div>
            <div className="routes-container">
                <Dropdown placement="bottomLeft" trigger={['click']} dropdownRender={() => <RoutesContainer />} >
                    <Button className="waypointss-title">Редактировать маршрут</Button>
                </Dropdown>
            </div>
            <MapContainer />
        </div>
    );
}

export default App;
