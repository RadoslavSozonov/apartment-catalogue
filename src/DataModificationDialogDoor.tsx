import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DoorInterface from "./interfaces/DoorInterface";
import { Dispatch, SetStateAction } from "react";
import DataModificationTextFieldsDoor from "./DataModificationTextFieldsDoor";
import RoomInterface from "./interfaces/RoomInterface";

interface DataModificationDialogDoorInterface {
    doorDialogOpen: boolean;
    setDoorDialogOpen: Dispatch<SetStateAction<boolean>>;
    index: number;
    door: DoorInterface;
    dialogTitle: string;
    doorModification: () => {};
    handleDoorChange: (index: number, field: keyof DoorInterface, value: string) => void;
    modificationButtonText: string;
    rooms: RoomInterface[];
}

const DataModificationDialogDoor = (dataModificationDialog: DataModificationDialogDoorInterface) => {
    return <>
    <Dialog open={dataModificationDialog.doorDialogOpen} onClose={() => dataModificationDialog.setDoorDialogOpen(false)}>
        <DialogTitle>{dataModificationDialog.dialogTitle}</DialogTitle>
        <DialogContent>
            <DataModificationTextFieldsDoor 
                doorIndex={dataModificationDialog.index} 
                door={dataModificationDialog.door} 
                handleDoorChange={dataModificationDialog.handleDoorChange}
                rooms={dataModificationDialog.rooms}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dataModificationDialog.setDoorDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={dataModificationDialog.doorModification} color="primary">
            {dataModificationDialog.modificationButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
}

export default DataModificationDialogDoor;