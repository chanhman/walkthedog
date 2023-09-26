'use client';

import React, { useState } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
import { bookingAPI } from '../../lib/api/booking';
import { dogsAPI } from '../../lib/api/dogs';

export default function Hour({ date, time }: { date: string; time: string }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [dogData, setDogData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  const router = useRouter();

  const fetchCurrentUserId = async function () {
    const supabase = createServerComponentClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setCurrentUserId(user.id);
    }
  };
  fetchCurrentUserId();

  const startDateAndTime = new Date(`${date}T${time}`);
  const fetchBooking = async function () {
    const results = await bookingAPI.getBooking(startDateAndTime);

    if (results.data) {
      setBookingData(results.data);
    }
  };
  fetchBooking();

  const fetchDogs = async function () {
    const results = await dogsAPI.getDogs(currentUserId);

    if (results.data) {
      // We will grab the first dog for now
      setDogData(results.data[0]);
    }
  };
  fetchDogs();

  const handleBooking = async function () {
    setLoadingMessage('Booking');

    const results = await bookingAPI.addBooking(
      startDateAndTime,
      currentUserId,
      dogData.id
    );

    if (results.error) {
      setErrorMessage(
        'There was an issue booking this time. Please try again.'
      );
    }

    if (results.data) {
      router.refresh();
    }
    setLoadingMessage('');
  };

  const handleCanceling = async function () {
    setLoadingMessage('Canceling');

    const results = await bookingAPI.deleteBooking(startDateAndTime);

    if (results.error) {
      setErrorMessage(
        'There was an issue canceling this time. Please try again.'
      );
    } else {
      router.refresh();
    }

    setLoadingMessage('');
  };

  if (bookingData) {
    return (
      <div>
        <div>
          <time datetime={startDateAndTime}>{time}</time>
          {currentUserId ? (
            <button onClick={handleCanceling}>
              {loadingMessage ? loadingMessage : 'Cancel'}
            </button>
          ) : (
            'Booked'
          )}
        </div>
        {currentUserId && dogData && (
          <div>Your dog {dogData.name} is booked for a walk!</div>
        )}
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div>
      <div>
        <time datetime={startDateAndTime}>{time}</time>
        <button onClick={handleBooking}>
          {loadingMessage ? loadingMessage : 'Book'}
        </button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}
