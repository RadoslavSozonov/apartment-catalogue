import DoorInterface from "./DoorInterface";
import RoomInterface from "./RoomInterface";

interface ApartmentInterface {
    key: string;
    address: string;
    rooms: RoomInterface[];
    doors: DoorInterface[]
}

export default ApartmentInterface;