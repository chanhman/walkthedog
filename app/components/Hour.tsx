// ### Notes

// - I will use a calendar plugin that will have a day view, incrementing time by the hour
// - I will query all the rows in the Bookings table whose startTime contains the current date
// - For each hour, I will render the Hour component, passing the hour, selected date, and if a row from the Bookings table exists, the booking data to the component
// - I will try to make this component as dumb as possible, only using data that has been passed to it
// - When checking for bookingData, grab the dog id as well
// - Use the dog id then get its information like the dog's name

import React, { useState } from 'react';
import { bookingAPI } from '../../lib/api/booking';
import { dogsAPI } from '../../lib/api/dogs';

const Hour = ({ date, time, bookingData, userId }) => {
  const hasBookingData = Object.keys(bookingData).length > 0;
  const startTime = new Date(`${date}T${time}`);

  const [booked, setBooked] = useState(hasBookingData);
  const [dogName, setDogName] = useState('');
  const [dogId, setDogId] = useState('');

  const handleBooking = () => {
    bookingAPI.addBooking(userId, startTime, dogId);
    setBooked(true);
  };

  const handleCanceling = () => {
    bookingAPI.deleteBooking(startTime);
    setBooked(false);
  };

  useEffect(() => {
    /* TODO: Work with a designer on how to select a dog if there are more than one. Grab the first dog for now. */
    const dogs = dogsAPI.getDogs(userId);

    if (dogs) {
      setDogName(dogs[0].name);
      setDogId(dogs[0].id);
    }
  }, []);

  if (booked) {
    return (
      <div>
        <div>
          <div>{time}</div>
          {bookingData.userId === userId ? (
            <button onClick={handleCanceling}>Cancel</button>
          ) : (
            'Booked'
          )}
        </div>
        {bookingData.userId === userId && (
          <div>Your dog {dogName} is booked for a walk!</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>{time}</div>
        <button onClick={handleBooking}>Book</button>
      </div>
    </div>
  );
};
