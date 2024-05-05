import { useState, FunctionComponent, Dispatch, SetStateAction } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Typography, Paper, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { ref, update } from 'firebase/database'
import firebase from './firebase';
import RoomInterface from './interfaces/RoomInterface';
import ApartmentInterface from './interfaces/ApartmentInterface';
import DataModificationDialog from './DataModificationDialog';
import emptyRoom from './defaultValueObjects/EmptyRoomObject'
import WindowInterface from './interfaces/WindowInterface';
  
interface RoomInformationInterface {
    apartmentKey: string
    room: RoomInterface,
    roomIndex: number,
    apartments: ApartmentInterface[],
    setApartments: Dispatch<SetStateAction<ApartmentInterface[]>>
    handleDeleteRoom: (apartmentKey: string, roomIndex: number) => {}
}

const RoomInformation: FunctionComponent<RoomInformationInterface> = (roomInformationInterface: RoomInformationInterface) => {

  const [editRoomDialogOpen, setEditRoomDialogOpen] = useState<boolean>(false);

  const [selectedApartmentKey, setSelectedApartmentKey] = useState<string>('');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(-1);
  const [editedRoom, setEditedRoom] = useState<RoomInterface>(emptyRoom);
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
    setEditedRoom(updateRoom(editedRoom, field, value));
  };

  const calculateFloorOrCeilArea = (room: RoomInterface) => {
    const area = room.length * room.width
    return area;
  }

  const calculateCombinedWallsArea = (room: RoomInterface) => {
    const area = 2 * (room.width * room.height + room.length*room.height);
    return area;
  }
  

    const handleEditRoom = (apartmentKey: string, roomIndex: number) => {
        setSelectedApartmentKey(apartmentKey);
        setSelectedRoomIndex(roomIndex);
        setEditedRoom(roomInformationInterface.apartments.find((apartment) => apartment.key === apartmentKey)?.rooms[roomIndex] || emptyRoom);
        setEditRoomDialogOpen(true);
    };

    const saveEditedRoom = async () => {
        try {
          if (selectedApartmentKey !== '' && selectedRoomIndex !== -1) {
            const updatedApartments = [...roomInformationInterface.apartments];
            updatedApartments.forEach((apartment) => {
              if (apartment.key === selectedApartmentKey) {
                apartment.rooms[selectedRoomIndex] = editedRoom;
              }
            });
            roomInformationInterface.setApartments(updatedApartments);
            const dbRef = ref(firebase, `apartments/${selectedApartmentKey}/rooms/${selectedRoomIndex}`);
            await update(dbRef, editedRoom);
          }
          setEditRoomDialogOpen(false);
        } catch (error) {
          console.error('Error saving edited room:', error);
        }
    };

    const calculateWallsAreaWithWindows = (room: RoomInterface) => {
      let areaWallsAreaWithWindows = room.combinedWallsArea;
      if(room.windows && room.windows.length > 0) {
          for(const window of room.windows){
            areaWallsAreaWithWindows-= window.height * window.width;
          }
      }

      return areaWallsAreaWithWindows > 0? areaWallsAreaWithWindows : 0;
    }

    return <>
        <Grid item key={roomInformationInterface.roomIndex} style={{marginBottom: '10px'}}>
            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <Typography variant="body2">Room {roomInformationInterface.roomIndex + 1}:</Typography>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>Room Name: {roomInformationInterface.room.name}</li>
                <li>Length: {roomInformationInterface.room.length}m</li>
                <li>Width: {roomInformationInterface.room.width}m</li>
                <li>Height: {roomInformationInterface.room.height}m</li>
                <li>Floor Area: {roomInformationInterface.room.floorArea}m²</li>
                <li>Ceiling Area: {roomInformationInterface.room.ceilArea}m²</li>
                
                {roomInformationInterface.room.windows && roomInformationInterface.room.windows.length > 0 && (
                  <li>
                    Windows:
                    <ul>
                      {roomInformationInterface.room.windows.map((window, index) => (
                        <li key={index}>
                          Height: {window.height}m, Width: {window.width}m, Area: {window.height*window.width}m²
                        </li>
                      ))}
                    </ul>
                  </li>
                )}

                <li>Walls Area w/o windows: {roomInformationInterface.room.combinedWallsArea}m²</li>
                <li>Walls Area with windows: {calculateWallsAreaWithWindows(roomInformationInterface.room)}m²</li>
            </ul>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditRoom(roomInformationInterface.apartmentKey, roomInformationInterface.roomIndex)}
                style={{ marginRight: '10px', marginTop: '5px' }}
              >
                Edit Room
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => roomInformationInterface.handleDeleteRoom(roomInformationInterface.apartmentKey, roomInformationInterface.roomIndex)}
                style={{ marginRight: '10px', marginTop: '5px' }}
                >
                Delete Room
             </Button>
             
        </Grid>

        {/* Edit Room Dialog */}

        <DataModificationDialog 
              index={-1} 
              roomDialogOpen={editRoomDialogOpen} 
              setRoomDialogOpen={setEditRoomDialogOpen} 
              room={editedRoom}
              dialogTitle={'Edit Room'}
              handleRoomChange={handleRoomChange}
              roomModification={saveEditedRoom}
              modificationButtonText={"Edit"}
            />
    </>
}

export default RoomInformation;