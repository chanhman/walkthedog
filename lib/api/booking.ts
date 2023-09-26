import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const bookingAPI = {
  /* startTime format: 'YYYY-MM-DD HH:MI:SS' */

  getBookings: async function (startTime: Date) {
    const { data, error } = await supabase
      .from('bookings')
      .select()
      .eq(
        'date(startTime)',
        startTime
      ); /* Using date() will allow you to retrieve bookings solely by the date and not time */

    if (error) {
      return error;
    }

    return data;
  },
  getBooking: async function (startTime: Date) {
    const { data, error } = await supabase
      .from('bookings')
      .select()
      .eq('startTime', startTime); /* Retrieve a booking by the date and time */

    if (error) {
      return error;
    }
    return data;
  },
  addBooking: async function (startTime: Date, userId: number, dogId: number) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({ startTime, userId, dogId })
      .select();

    if (error) {
      return error;
    }
    return data;
  },
  deleteBooking: async function (startTime: Date) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('startTime', startTime);

    if (error) {
      return;
    }
  },
};
