import { TextField, MenuItem, Button } from "@mui/material";
import DoorInterface from "./interfaces/DoorInterface";
import RoomInterface from "./interfaces/RoomInterface";


interface DataModificationTextFieldsDoorInterface {
    door: DoorInterface;
    doorIndex: number;
    handleDoorChange: (index: number, field: keyof DoorInterface, value: string) => void; 
    rooms: RoomInterface[]
}

const DataModificationTextFieldsDoor = (dataModificationTextFieldsDoorInterface: DataModificationTextFieldsDoorInterface) => {

    return <>
        <div key={dataModificationTextFieldsDoorInterface.doorIndex}>
              <TextField
                label="Height (m)"
                variant="outlined"
                type="number"
                fullWidth
                value={dataModificationTextFieldsDoorInterface.door.height}
                onChange={(e) => dataModificationTextFieldsDoorInterface.handleDoorChange(dataModificationTextFieldsDoorInterface.doorIndex, 'height', e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Width (m)"
                variant="outlined"
                type="number"
                fullWidth
                value={dataModificationTextFieldsDoorInterface.door.width}
                onChange={(e) => dataModificationTextFieldsDoorInterface.handleDoorChange(dataModificationTextFieldsDoorInterface.doorIndex, 'width', e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                select
                label="Between room"
                variant="outlined"
                fullWidth
                value={dataModificationTextFieldsDoorInterface.door.fromRoom}
                onChange={(e) => dataModificationTextFieldsDoorInterface.handleDoorChange(dataModificationTextFieldsDoorInterface.doorIndex, 'fromRoom', e.target.value)}
                style={{ marginBottom: '10px' }}
              >{dataModificationTextFieldsDoorInterface.rooms.map((room) => (
                <MenuItem key={room.name} value={room.name}>
                  {room.name}
                </MenuItem>
              ))}
              </TextField>

              <TextField
                select
                label="Between room"
                variant="outlined"
                fullWidth
                value={dataModificationTextFieldsDoorInterface.door.toRoom}
                onChange={(e) => dataModificationTextFieldsDoorInterface.handleDoorChange(dataModificationTextFieldsDoorInterface.doorIndex, 'toRoom', e.target.value)}
                style={{ marginBottom: '10px' }}
              >{dataModificationTextFieldsDoorInterface.rooms.map((room) => (
                <MenuItem key={room.name} value={room.name}>
                  {room.name}
                </MenuItem>
              ))}
              </TextField>
            </div>
    </>

}

export default DataModificationTextFieldsDoor;