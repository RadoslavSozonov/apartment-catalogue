import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import RoomInterface from "./interfaces/RoomInterface";
import { Dispatch, SetStateAction } from "react";
import DataModificationTextFieldsRoom from "./DataModificationTextFieldsRoom";
import WindowInterface from "./interfaces/WindowInterface";

interface DataModificationDialogInterface {
    roomDialogOpen: boolean;
    setRoomDialogOpen: Dispatch<SetStateAction<boolean>>;
    index: number;
    room: RoomInterface;
    dialogTitle: string;
    roomModification: () => {};
    handleRoomChange: (index: number, field: keyof RoomInterface, value: string|WindowInterface[]) => void;
    modificationButtonText: string;
}

const DataModificationDialog = (dataModificationDialog: DataModificationDialogInterface) => {
    return <>
    <Dialog open={dataModificationDialog.roomDialogOpen} onClose={() => dataModificationDialog.setRoomDialogOpen(false)}>
        <DialogTitle>{dataModificationDialog.dialogTitle}</DialogTitle>
        <DialogContent>
            <DataModificationTextFieldsRoom 
                index={dataModificationDialog.index} 
                room={dataModificationDialog.room} 
                handleRoomChange={dataModificationDialog.handleRoomChange}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dataModificationDialog.setRoomDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={dataModificationDialog.roomModification} color="primary">
            {dataModificationDialog.modificationButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
}

export default DataModificationDialog;