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

  const getCurrentUserId = async function () {
    const supabase = createServerComponentClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setCurrentUserId(user.id);
    }
  };
  getCurrentUserId();

  const startDateAndTime = new Date(`${date}T${time}`);
  const getBooking = async function () {
    const results = await bookingAPI.getBooking(startDateAndTime);

    if (results.data) {
      setBookingData(results.data);
    }
  };
  getBooking();

  const getDogs = async function () {
    const results = await dogsAPI.getDogs(currentUserId);

    if (results.data) {
      // We will grab the first dog for now
      setDogData(results.data[0]);
    }
  };
  getDogs();

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
      <div className="bg-white px-6 pt-10 pb-8 shadow-xl sm:rounded-lg sm:px-10">
        <div className="flex items-center justify-between">
          <time datetime={startDateAndTime}>{time}</time>
          {currentUserId ? (
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={handleCanceling}
            >
              {loadingMessage ? loadingMessage : 'Cancel'}
            </button>
          ) : (
            'Booked'
          )}
        </div>
        {currentUserId && dogData && (
          <div className="pt-2 text-base font-semibold leading-7">
            Your dog {dogData.name} is booked for a walk!
          </div>
        )}
        {errorMessage && (
          <div className="pt-2 text-base text-red-700 font-semibold leading-7">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white px-6 pt-10 pb-8 shadow-xl sm:rounded-lg sm:px-10">
      <div className="flex items-center justify-between">
        <time datetime={startDateAndTime}>{time}</time>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBooking}
        >
          {loadingMessage ? loadingMessage : 'Book'}
        </button>
      </div>
      {errorMessage && (
        <div className="pt-2 text-base text-red-700 font-semibold leading-7">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
