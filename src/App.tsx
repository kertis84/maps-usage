import { Col, Row } from "antd";
import RoutesContainer from "./components/RoutesContainer";
import MapContainer from "./components/MapContainer";


function App() {
  return (
    <>
      <Row>
        <Col span={6}><RoutesContainer /></Col>
        <Col span={18}><MapContainer /></Col>
      </Row>
    </>
  );
}

export default App;
