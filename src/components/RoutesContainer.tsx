import { InputNumber, Table, Tag } from "antd";
import { DataType } from "../helpers/data";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { ColumnsType } from "antd/es/table";
import { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { setWaypoints } from "../store/actions/actions";
import { useRef } from "react";
import { getKey } from "../helpers/helpers";


interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}


function RoutesContainer() {

  const dispatch = useDispatch();
  const waypoints = useAppSelector(state => state.waypoints);

  const longtitudeRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!e.currentTarget.nonce) return;
    const idx = parseInt(e.currentTarget.nonce);
    const newWaypoints = waypoints.slice(0, idx).concat(waypoints.slice(idx + 1));
    dispatch(setWaypoints(newWaypoints));
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Маршрут',
      width: '20%',
      align: 'center',
      dataIndex: 'key',
      render: (_value, _record, index) => 'Точка ' + (index + 1),
    },
    {
      title: 'Широта',
      width: '30%',
      align: 'center',
      dataIndex: 'coordinate',
      render: (value) => value[0],
    },
    {
      title: 'Долгота',
      width: '30%',
      align: 'center',
      dataIndex: 'coordinate',
      render: (value) => value[1],
    },
    {
      title: 'Действие',
      width: '20%',
      align: 'center',
      render: (_, __, index) =>
        <Tag color="red" key={`del-${index}`} nonce={index.toString()} style={{ cursor: 'pointer' }} onClick={handleDelete} >
          Delete
        </Tag>,
    },
  ];

  const addRow: ColumnsType<any> = [
    {
      width: '20%',
      align: 'center',
      render: () => 'Точка ' + (waypoints.length + 1),
    },
    {
      width: '30%',
      align: 'center',
      render: () => <InputNumber min={-90} max={90} controls={false} ref={longtitudeRef} />,
    },
    {
      width: '30%',
      align: 'center',
      render: () => <InputNumber min={-180} max={180} controls={false} ref={latitudeRef} />,
    },
    {
      width: '20%',
      align: 'center',
      render: () =>
        <Tag color="green" style={{ cursor: 'pointer' }} onClick={() => {
          const point: DataType = { key: getKey(), coordinate: [Number(longtitudeRef.current?.value), Number(latitudeRef.current?.value)] };
          (waypoints.length === 0 || (waypoints[waypoints.length - 1].coordinate[0] !== point.coordinate[0] || waypoints[waypoints.length - 1].coordinate[1] !== point.coordinate[1])) &&
            dispatch(setWaypoints([...waypoints, point]));
        }} >
          Add
        </Tag>,
    },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const Row = (props: RowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
      transition,
      cursor: 'move',
      ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = waypoints.findIndex((i) => i.key === active.id);
      const overIndex = waypoints.findIndex((i) => i.key === over?.id);
      const newWaypoints = arrayMove(waypoints, activeIndex, overIndex);
      dispatch(setWaypoints(newWaypoints));
    }
  };


  return (
    <>
      <div className="waypointss-title">Постройте маршрут</div>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={waypoints.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table dataSource={waypoints} pagination={false} columns={columns} locale={{ emptyText: 'Пусто' }}
            components={{
              body: {
                row: Row,
              },
            }} />
        </SortableContext>
      </DndContext>
      <Table dataSource={[{ key: 'add' }]} pagination={false} columns={addRow} />
    </>
  );
}

export default RoutesContainer;
