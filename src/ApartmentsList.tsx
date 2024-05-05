import React, { useState, useEffect } from 'react';
import firebase from './firebase';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ref, child, get , remove } from 'firebase/database'
import ApartmentInformation from './ApartmentInformation';
import ApartmentInterface from './interfaces/ApartmentInterface';


const ApartmentsList: React.FC = () => {
  const [apartments, setApartments] = useState<ApartmentInterface[]>([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const dbRef = ref(firebase);
      const snapshot = await get(child(dbRef,'apartments'));
      const apartmentsData: ApartmentInterface[] = [];
      snapshot.forEach((childSnapshot) => {
        const apartment = childSnapshot.val();
        apartmentsData.push({ key: childSnapshot.key, ...apartment });
      });
      setApartments(apartmentsData);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const handleDeleteApartment = async (apartmentKey: string) => {
    try {
      const dbRef = ref(firebase, `apartments/${apartmentKey}`);
      await remove(dbRef);
      // Update the apartments list after deletion
      const updatedApartments = apartments.filter((apartment) => apartment.key !== apartmentKey);
      setApartments(updatedApartments);
    } catch (error) {
      console.error('Error deleting apartment:', error);
    }
  };

  const handleDeleteRoom = async (apartmentKey: string, roomIndex: number) => {
    try {
      const updatedApartments = [...apartments];
      const roomToDelete = updatedApartments.find((apartment) => apartment.key === apartmentKey)?.rooms[roomIndex];
      if (roomToDelete) {
        updatedApartments.forEach((apartment) => {
          if (apartment.key === apartmentKey) {
            apartment.rooms.splice(roomIndex, 1);
          }
        });
        setApartments(updatedApartments);
        const dbRef = ref(firebase, `apartments/${apartmentKey}/rooms/${roomIndex}`);
        await remove(dbRef);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleDeleteDoor = async (apartmentKey: string, doorIndex: number) => {
    try {
      const updatedApartments = [...apartments];
      const doorToDelete = updatedApartments.find((apartment) => apartment.key === apartmentKey)?.doors[doorIndex];
      if (doorToDelete) {
        updatedApartments.forEach((apartment) => {
          if (apartment.key === apartmentKey) {
            apartment.doors.splice(doorIndex, 1);
          }
        });
        setApartments(updatedApartments);
        const dbRef = ref(firebase, `apartments/${apartmentKey}/doors/${doorIndex}`);
        await remove(dbRef);
      }
    } catch (error) {
      console.error('Error deleting door:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button component={Link} to="/" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Go back to main page
      </Button>
      <Typography variant="h4">List of Apartments</Typography>
      {
        apartments.map((apartment, index) => (
          <>
            <ApartmentInformation 
              apartments={apartments} 
              apartmentIndex={index} 
              setApartments={setApartments} 
              handleDeleteApartment={handleDeleteApartment} 
              handleDeleteRoom={handleDeleteRoom}
              handleDeleteDoor={handleDeleteDoor}
              />
          </>
        ))

      }
    </div>
  );
};

export default ApartmentsList;
