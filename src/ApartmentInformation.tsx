import { useState, FunctionComponent, SetStateAction, Dispatch } from 'react';
import { Typography, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import RoomInformation from './RoomInformation';
// import firebase from 'firebase/compat';
import { ref, push, update } from 'firebase/database';
import firebase from './firebase';
import RoomInterface from './interfaces/RoomInterface';
import ApartmentInterface from './interfaces/ApartmentInterface';
import DataModificationDialog from './DataModificationDialog';
import emptyRoom from './defaultValueObjects/EmptyRoomObject'
import WindowInterface from './interfaces/WindowInterface';
import DoorInformation from './DoorInformation';
import DoorInterface from './interfaces/DoorInterface';
import DataModificationDialogDoor from './DataModificationDialogDoor';

interface ApartmentInformationInterface {
    apartments: ApartmentInterface[],
    apartmentIndex: number,
    setApartments: Dispatch<SetStateAction<ApartmentInterface[]>>,
    handleDeleteApartment: (key: string) => {},
    handleDeleteRoom: (apartmentKey: string, roomIndex: number) => {},
    handleDeleteDoor: (apartmentKey: string, roomIndex: number) => {};
}

const ApartmentInformation: FunctionComponent<ApartmentInformationInterface> = ({apartments, apartmentIndex, setApartments, handleDeleteApartment, handleDeleteRoom, handleDeleteDoor}) => {
    const emptyDoor: DoorInterface = {height: 0, width: 0, fromRoom: "", toRoom: ""};
    const [expandedApartment, setExpandedApartment] = useState<string | null>(null);
    const [addRoomDialogOpen, setAddRoomDialogOpen] = useState<boolean>(false);
    const [addDoorDialogOpen, setAddDoorDialogOpen] = useState<boolean>(false);
    const [newRoom, setNewRoom] = useState<RoomInterface>(emptyRoom);
    const [newDoor, setNewDoor] = useState<DoorInterface>(emptyDoor);
    const [selectedApartmentKey, setSelectedApartmentKey] = useState<string>('');
    const [manuallySetFloorArea, setManuallySetFloorArea] = useState<boolean>(false);
    const [manuallySetCeilArea, setManuallySetCeilArea] = useState<boolean>(false);
    const [manuallySetWallsArea, setManuallySetWallsArea] = useState<boolean>(false);

    const updateRoom = (room: RoomInterface, field: keyof RoomInterface, value: string|WindowInterface[]): RoomInterface => {
      let updatedRoom: RoomInterface = { ...room, [field]: value };
      
      if(field == 'ceilArea'){
        setManuallySetFloorArea(true);
        setManuallySetCeilArea(true);
      }
      if(field == 'floorArea'){
        setManuallySetFloorArea(true);
        setManuallySetCeilArea(true);
      }
      if(field == 'combinedWallsArea'){
        setManuallySetWallsArea(true);
      }
      if((updatedRoom.floorArea != 0 && !manuallySetCeilArea) || field == 'floorArea'){
        updatedRoom = { ...updatedRoom, 'ceilArea': updatedRoom.floorArea }
      }

      if(updatedRoom.length != 0 && updatedRoom.width != 0 && !manuallySetFloorArea){
          updatedRoom = { ...updatedRoom, 'floorArea': calculateFloorOrCeilArea(updatedRoom) }
      }
      if(updatedRoom.length != 0 && updatedRoom.width != 0 && !manuallySetCeilArea){
        updatedRoom = { ...updatedRoom, 'ceilArea': calculateFloorOrCeilArea(updatedRoom) }
      }
      if(updatedRoom.length != 0 && updatedRoom.width != 0 && updatedRoom.height != 0 && !manuallySetWallsArea){
        updatedRoom = { ...updatedRoom, 'combinedWallsArea': calculateCombinedWallsArea(updatedRoom) }
      }
      return updatedRoom;
    }
  
    const handleRoomChange = (index: number, field: keyof RoomInterface, value: string|WindowInterface[]) => {
      setNewRoom(updateRoom(newRoom, field, value));
    };

    const calculateFloorOrCeilArea = (room: RoomInterface) => {
      const area = room.length * room.width
      return area;
    }
  
    const calculateCombinedWallsArea = (room: RoomInterface) => {
      const area = 2 * (room.width * room.height + room.length*room.height);
      return area;
    }

    const handleApartmentClick = (address: string) => {
      if (expandedApartment === address) {
        setExpandedApartment(null);
      } else {
        setExpandedApartment(address);
      }
    };

    const handleAddRoom = (apartmentKey: string) => {
      setSelectedApartmentKey(apartmentKey);
      setNewRoom(emptyRoom);
      setAddRoomDialogOpen(true);
    };

    const handleAddDoor = (apartmentKey: string) => {
      setSelectedApartmentKey(apartmentKey);
      setNewDoor(emptyDoor);
      setAddDoorDialogOpen(true);
    }
  
    const saveNewRoom = async () => {
      try {
        if (selectedApartmentKey !== '') {
          const updatedApartments = [...apartments];
          updatedApartments.forEach((apartment) => {
            if (apartment.key === selectedApartmentKey) {
              apartment.rooms.push(newRoom);
            }
          });
          setApartments(updatedApartments);
          const dbRef = ref(firebase, `apartments/${selectedApartmentKey}`);
          await update(dbRef, apartments[apartmentIndex]);
        }
        setAddRoomDialogOpen(false);
      } catch (error) {
        console.error('Error saving new room:', error);
      }
    };

    const saveNewDoor = async () => {
      try {
        if (selectedApartmentKey !== '') {
          const updatedApartments = [...apartments];
          updatedApartments.forEach((apartment) => {
            if (apartment.key === selectedApartmentKey) {
              apartment.doors.push(newDoor);
            }
          });
          setApartments(updatedApartments);
          const dbRef = ref(firebase, `apartments/${selectedApartmentKey}`);
          await update(dbRef, apartments[apartmentIndex]);
        }
        setAddDoorDialogOpen(false);
      } catch (error) {
        console.error('Error saving new Door:', error);
      }
    };

    const handleDoorChange = (index: number, field: keyof DoorInterface, value: string) => {
      const updateDoors = { ...newDoor, [field]: value };
      setNewDoor(updateDoors);
    }

    return <>
        <Paper key={apartmentIndex} style={{ padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>
            <Typography variant="h5" onClick={() => handleApartmentClick(apartments[apartmentIndex].address)}>
                {apartments[apartmentIndex].address} {expandedApartment === apartments[apartmentIndex].address ? <ExpandLess /> : <ExpandMore />}
            </Typography>
            {expandedApartment === apartments[apartmentIndex].address && (
              <div>
                <Typography variant="body1">Number of rooms: {apartments[apartmentIndex].rooms.length}</Typography>
                <Typography variant="body1">Room Details:</Typography>
                <Grid container spacing={2}>
                    {apartments[apartmentIndex].rooms.map((room, roomIndex) => (
                      <RoomInformation apartmentKey={apartments[apartmentIndex].key} room={room} roomIndex={roomIndex} apartments={apartments} setApartments={setApartments} handleDeleteRoom={handleDeleteRoom}/>
                    ))}
                </Grid>
                <div style={{ marginBottom: '15px' }}>
                  <Typography variant="body1" >Number of doors: {apartments[apartmentIndex].doors?.length?apartments[apartmentIndex].doors.length:0}</Typography>
                {apartments[apartmentIndex].doors ? <Typography variant="body1">Doors Details:</Typography>:<></>}
                <Grid container spacing={2}>
                    {apartments[apartmentIndex].doors?.map((door, doorIndex) => (
                      <DoorInformation apartmentIndex={apartmentIndex} apartmentKey={apartments[apartmentIndex].key} door={door} doorIndex={doorIndex} apartments={apartments} setApartments={setApartments} handleDeleteDoor={handleDeleteDoor}/>
                    ))}
                </Grid>
                </div>
                
              </div>
            )}
            <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteApartment(apartments[apartmentIndex].key)}
                style={{ marginRight: '10px' }}
              >
                Delete Apartment
            </Button>
            {
              expandedApartment? 
              <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddRoom(apartments[apartmentIndex].key)}
                style={{ marginRight: '10px' }}
              >
                Add Room
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddDoor(apartments[apartmentIndex].key)}
                style={{ marginRight: '10px' }}
              >
                Add Door
              </Button> 
              </>
              :
              <></>
            }
            
            </Paper>

            <DataModificationDialog 
              index={apartmentIndex} 
              roomDialogOpen={addRoomDialogOpen} 
              setRoomDialogOpen={setAddRoomDialogOpen} 
              room={newRoom}
              dialogTitle={'Add Room'}
              handleRoomChange={handleRoomChange}
              roomModification={saveNewRoom}
              modificationButtonText={"Add"}
            />

            <DataModificationDialogDoor
            index={apartmentIndex} 
            doorDialogOpen={addDoorDialogOpen} 
            setDoorDialogOpen={setAddDoorDialogOpen} 
            door={newDoor}
            dialogTitle={'Add Door'}
            handleDoorChange={handleDoorChange}
            doorModification={saveNewDoor}
            modificationButtonText={"Add"}
            rooms={apartments[apartmentIndex].rooms}
            />
        </>
}

export default ApartmentInformation