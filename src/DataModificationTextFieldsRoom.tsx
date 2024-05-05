import { Button, TextField } from "@mui/material";
import RoomInterface from "./interfaces/RoomInterface";
import WindowInterface from "./interfaces/WindowInterface";

interface DataModificationTextFieldsRoomInterface {
    index: number;
    room: RoomInterface;
    handleRoomChange: (index: number, field: keyof RoomInterface, value: string|WindowInterface[]) => void;
}

const DataModificationTextFieldsRoom = (dataModificationTextFieldsRooms: DataModificationTextFieldsRoomInterface) => {
    return <>
        <TextField
            label={`Room ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Name`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.name}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'name', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <TextField
            label={`Room ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Length (m)`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.length}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'length', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <TextField
            label={`Room ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Width (m)`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.width}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'width', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <TextField
            label={`Room ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Height (m)`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.height}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'height', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <TextField
            label={`Room ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Floor Area (m2)`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.floorArea}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'floorArea', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <TextField
            label={`Room ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Ceil Area (m2)`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.ceilArea}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'ceilArea', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <TextField
            label={`4 Walls ${dataModificationTextFieldsRooms.index == -1? "" :dataModificationTextFieldsRooms.index + 1} Area (m2)`}
            variant="outlined"
            fullWidth
            value={dataModificationTextFieldsRooms.room.combinedWallsArea}
            onChange={(e) => dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'combinedWallsArea', e.target.value)}
            style={{ marginTop: '10px' }}
        />
        <Button
            variant="contained"
            color="primary"
            onClick={() => 
              dataModificationTextFieldsRooms
                .handleRoomChange(
                  dataModificationTextFieldsRooms.index, 
                  'windows', 
                  dataModificationTextFieldsRooms.room.windows?
                    [...dataModificationTextFieldsRooms.room.windows, { height: 0, width: 0 }]:
                    [...[], { height: 0, width: 0 }]
                )
              }
            style={{ marginTop: '10px' }}
          >
            Add Window
        </Button>
          {dataModificationTextFieldsRooms.room.windows && dataModificationTextFieldsRooms.room.windows.map((window, windowIndex) => (
            <div key={windowIndex}>
              <TextField
                label={`Window ${windowIndex + 1} Height (m)`}
                variant="outlined"
                type="number"
                fullWidth
                value={window.height}
                onChange={(e) => {
                  const updatedWindows = [...dataModificationTextFieldsRooms.room.windows];
                  updatedWindows[windowIndex].height = parseFloat(e.target.value);
                  dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'windows', updatedWindows);
                }}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label={`Window ${windowIndex + 1} Width (m)`}
                variant="outlined"
                type="number"
                fullWidth
                value={window.width}
                onChange={(e) => {
                  const updatedWindows = [...dataModificationTextFieldsRooms.room.windows];
                  updatedWindows[windowIndex].width = parseFloat(e.target.value);
                  dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'windows', updatedWindows);
                }}
                style={{ marginBottom: '10px' }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    const windows = dataModificationTextFieldsRooms.room.windows;
                    windows.splice(windowIndex, 1);
                    dataModificationTextFieldsRooms.handleRoomChange(dataModificationTextFieldsRooms.index, 'windows', dataModificationTextFieldsRooms.room.windows)
                  }
                }
                style={{ marginLeft: '10px' }}
              >
                Delete Window
              </Button>
            </div>
          ))}
    </>

}

export default DataModificationTextFieldsRoom;