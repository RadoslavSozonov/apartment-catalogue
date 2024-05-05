import { useState, Dispatch, SetStateAction } from "react";
import ApartmentInterface from "./interfaces/ApartmentInterface";
import DoorInterface from "./interfaces/DoorInterface";
import { Grid, Typography, Button } from "@mui/material";
import { ref, update } from 'firebase/database';
import firebase from './firebase';
import DataModificationDialogDoor from "./DataModificationDialogDoor";

interface DoorInformationInterface {
    apartmentIndex: number,
    apartmentKey: string,
    door: DoorInterface,
    doorIndex: number,
    apartments: ApartmentInterface[],
    setApartments: Dispatch<SetStateAction<ApartmentInterface[]>>,
    handleDeleteDoor: (apartmentKey: string, doorIndex: number) => {};
}


const DoorInformation = (doorInformation: DoorInformationInterface) => {
    const emptyDoor: DoorInterface = {height: 0, width: 0, fromRoom: "", toRoom: ""};

    const [editDoorDialogOpen, setEditDoorDialogOpen] = useState<boolean>(false);
    const [selectedApartmentKey, setSelectedApartmentKey] = useState<string>('');
    const [selectedDoorIndex, setSelectedDoorIndex] = useState<number>(-1);
    const [editedDoor, setEditedDoor] = useState<DoorInterface>(emptyDoor);

    const handleDoorChange = (index: number, field: keyof DoorInterface, value: string) => {
        const updateDoors = { ...editedDoor, [field]: value };
        setEditedDoor(updateDoors);
      }

    const handleEditDoor = (apartmentKey: string, doorIndex: number) => {
        setSelectedApartmentKey(apartmentKey);
        setSelectedDoorIndex(doorIndex);
        setEditedDoor(doorInformation.apartments.find((apartment) => apartment.key === apartmentKey)?.doors[doorIndex] || emptyDoor);
        setEditDoorDialogOpen(true);
    }

    const saveEditedRoom = async () => {
        try {
          if (selectedApartmentKey !== '' && selectedDoorIndex !== -1) {
            const updatedApartments = [...doorInformation.apartments];
            updatedApartments.forEach((apartment) => {
              if (apartment.key === selectedApartmentKey) {
                apartment.doors[selectedDoorIndex] = editedDoor;
              }
            });
            doorInformation.setApartments(updatedApartments);
            const dbRef = ref(firebase, `apartments/${selectedApartmentKey}/rooms/${selectedDoorIndex}`);
            await update(dbRef, editedDoor);
          }
          setEditDoorDialogOpen(false);
        } catch (error) {
          console.error('Error saving edited room:', error);
        }
    };

    return <>
        <Grid item key={doorInformation.doorIndex} style={{marginBottom: '10px'}}>
            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <Typography variant="body2">Room {doorInformation.doorIndex + 1}:</Typography>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>Width: {doorInformation.door.width}m</li>
                <li>Height: {doorInformation.door.height}m</li>
                <li>Between room: {doorInformation.door.fromRoom}</li>
                <li>Between room: {doorInformation.door.toRoom}</li>
            </ul>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditDoor(doorInformation.apartmentKey, doorInformation.doorIndex)}
                style={{ marginRight: '10px', marginTop: '5px' }}
              >
                Edit Door
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => doorInformation.handleDeleteDoor(doorInformation.apartmentKey, doorInformation.doorIndex)}
                style={{ marginRight: '10px', marginTop: '5px' }}
                >
                Delete Door
             </Button>
        </Grid>    

        <DataModificationDialogDoor
            index={doorInformation.doorIndex} 
            doorDialogOpen={editDoorDialogOpen} 
            setDoorDialogOpen={setEditDoorDialogOpen} 
            door={editedDoor}
            dialogTitle={'Edit Door'}
            handleDoorChange={handleDoorChange}
            doorModification={saveEditedRoom}
            modificationButtonText={"Edit"}
            rooms={doorInformation.apartments[doorInformation.apartmentIndex].rooms}
            />
    </>

}

export default DoorInformation;
