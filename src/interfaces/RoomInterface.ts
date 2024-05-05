import WindowInterface from "./WindowInterface";

interface RoomInterface {
    name: string;
    length: number;
    width: number;
    height: number;
    floorArea: number;
    ceilArea: number;
    combinedWallsArea: number;
    windows: WindowInterface[];
}

export default RoomInterface