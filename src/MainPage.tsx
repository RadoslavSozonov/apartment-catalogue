import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import firebase from './firebase';
import { Link } from 'react-router-dom';
import { ref, push } from 'firebase/database'
import RoomInterface from './interfaces/RoomInterface';
import DataModificationTextFieldsRoom from './DataModificationTextFieldsRoom';
import emptyRoom from './defaultValueObjects/EmptyRoomObject'
import WindowInterface from './interfaces/WindowInterface';
import DoorInterface from './interfaces/DoorInterface';
import DataModificationTextFieldsDoor from './DataModificationTextFieldsDoor';


interface ApartmentInterface {
  address: string;
  rooms: RoomInterface[];
  doors: DoorInterface[];
}

const MainPage: React.FC = () => {
  const [apartments, setApartments] = useState<ApartmentInterface[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newRooms, setNewRooms] = useState<RoomInterface[]>([]);
  const [newDoors, setNewDoors] = useState<DoorInterface[]>([]);
  const [manuallySetFloorArea, setManuallySetFloorArea] = useState<boolean[]>([]);
  const [manuallySetCeilArea, setManuallySetCeilArea] = useState<boolean[]>([]);
  const [manuallySetWallsArea, setManuallySetWallsArea] = useState<boolean[]>([]);

  const updateRoom = (room: RoomInterface, field: keyof RoomInterface, value: string|WindowInterface[], index: number): RoomInterface => {
    let updatedRoom: RoomInterface = { ...room, [field]: value };
    
    if(field == 'ceilArea'){
      let newArray = [...manuallySetFloorArea];
      newArray[index] = true
      setManuallySetFloorArea(newArray);
      newArray = [...manuallySetCeilArea];
      newArray[index] = true
      setManuallySetCeilArea(newArray);
    }
    if(field == 'floorArea'){
      let newArray = [...manuallySetFloorArea];
      newArray[index] = true
      setManuallySetFloorArea(newArray);
      newArray = [...manuallySetCeilArea];
      newArray[index] = true
      setManuallySetCeilArea(newArray);
    }
    if(field == 'combinedWallsArea'){
      let newArray = [...manuallySetWallsArea];
      newArray[index] = true
      setManuallySetWallsArea(newArray);
    }
    if((updatedRoom.floorArea != 0 && !manuallySetCeilArea[index]) || field == 'floorArea'){
      updatedRoom = { ...updatedRoom, 'ceilArea': updatedRoom.floorArea }
    }

    if(updatedRoom.length != 0 && updatedRoom.width != 0 && !manuallySetFloorArea[index]){
        updatedRoom = { ...updatedRoom, 'floorArea': calculateFloorOrCeilArea(updatedRoom) }
    }
    if(updatedRoom.length != 0 && updatedRoom.width != 0 && !manuallySetCeilArea[index]){
      updatedRoom = { ...updatedRoom, 'ceilArea': calculateFloorOrCeilArea(updatedRoom) }
    }
    if(updatedRoom.length != 0 && updatedRoom.width != 0 && updatedRoom.height != 0 && !manuallySetWallsArea[index]){
      updatedRoom = { ...updatedRoom, 'combinedWallsArea': calculateCombinedWallsArea(updatedRoom) }
    }
    return updatedRoom;
  }

  const handleRoomChange = (index: number, field: keyof RoomInterface, value: string|WindowInterface[]) => {
    const updatedRooms = newRooms.map((room, i) => (i === index ?  updateRoom(room, field, value, index): room));
    setNewRooms(updatedRooms);
  };

  const handleAddRoom = () => {
    setNewRooms([...newRooms, emptyRoom]);
    setManuallySetFloorArea([...manuallySetFloorArea, false]);
    setManuallySetCeilArea([...manuallySetCeilArea, false]);
    setManuallySetWallsArea([...manuallySetWallsArea, false]);
  };

  const handleDoorChange = (index: number, field: keyof DoorInterface, value: string) => {
    const updateDoors = newDoors.map((door, i) => (i === index ?  { ...door, [field]: value }: door));
    setNewDoors(updateDoors);
  }

  const handleAddDoor = () => {
    setNewDoors([...newDoors, {height:0, width: 0, fromRoom:"", toRoom:""}])
  };

  const handleAddApartment = () => {
    const newApartment: ApartmentInterface = {address: newAddress, rooms: newRooms, doors: newDoors };
    setApartments([]);
    saveApartmentData(newApartment);
    setNewAddress('');
    setNewRooms([]);
    setNewDoors([]);
  };

  const saveApartmentData = (apartment: ApartmentInterface) => {
    push(ref(firebase, 'apartments'), apartment);
    console.log("Done");
  };

  const calculateFloorOrCeilArea = (room: RoomInterface) => {
    const area = room.length * room.width
    return area;
  }

  const calculateCombinedWallsArea = (room: RoomInterface) => {
    const area = 2 * (room.width * room.height + room.length*room.height);
    return area;
  }

  return (
    <div style={{ padding: '20px' }}>
      
      <Button component={Link} to="/apartments" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Go to apartments List
      </Button>

      <Typography variant="h4">Enter Building Details</Typography>
      <TextField
        label="Apartment Address"
        variant="outlined"
        fullWidth
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
        style={{ marginTop: '20px' }}
      />
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Rooms
      </Typography>
      <Grid container spacing={2}>
        {newRooms.map((room, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DataModificationTextFieldsRoom index={index} room={room} handleRoomChange={handleRoomChange}/>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={handleAddRoom} style={{ marginTop: '20px' }}>
        Add Room
      </Button>

      <Button
          variant="contained"
          color="primary"
          onClick={handleAddDoor}
          style={{ marginTop: '20px', marginLeft: '10px' }}
      >
          Add Door
      </Button>
          {newDoors.map((door, doorIndex) => (
            <>
              <DataModificationTextFieldsDoor door={door} doorIndex={doorIndex} handleDoorChange={handleDoorChange} rooms={newRooms}/>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    const doors = newDoors;
                    doors.splice(doorIndex, 1);
                    setNewDoors(doors);
                  }
                }
                style={{ marginLeft: '10px' }}
              >
                Delete Door
              </Button>
            </>
            
          ))}
      <Button variant="contained" color="primary" onClick={handleAddApartment} style={{ marginTop: '20px', marginLeft: '10px' }}>
        Add Apartment
      </Button>
    </div>
  );
};

export default MainPage;
