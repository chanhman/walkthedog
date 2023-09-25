# Walk the Dog

This is an app that allows me to keep track of who has made an appointment to walk their dogs.

## Stack

Considering the size of my company and the dual roles of developer and dog walker, I have opted to maintain a minimal tech stack. The selection of tools has been made based on the availability of resources, with the aim of tapping into a large developer community and accessing robust tools. Additionally, I prioritize a positive developer experience, so tools with excellent documentation were taken into account.

### Frontend

- Next.js (https://nextjs.org/): versatile setup configurations and its ability to run on both the client and server sides, built-in support for TypeScript, various styling methods like CSS Modules, and integrated routing, reducing the need for extensive configuration. For instance, if I were to use React or Create React App alone, I would have to install and configure those tools separately.
- TypeScript (https://www.typescriptlang.org/): For typing and intellisense, creates documentation of what components accepts.
- CSS Modules (https://github.com/css-modules/css-modules): Initially keeping the CSS simple, auto class name generation, no need to learn a specific way to write CSS (For example Tailwind). Other methods will be introduced as the application grows.

### Backend

Supabase (https://supabase.com/): minimal configuration, particularly in areas such as database management, storage, and user authentication. While alternatives like Firebase are available, opting for a tool that utilizes Postgres opens up opportunities for accessing additional resources and allows for easy service switching, avoiding vendor lock-in.

### Miscellaneous:

As the application expands, I plan to gradually introduce other tools to enhance the developer experience. For example, I intend to incorporate MUI (https://mui.com/) for faster design development, employ React Query (https://tanstack.com/) to improve code quality and state management, and implement various types of tests, including unit tests (https://jestjs.io/).

## Schema

A basic example of how the schema would look like:

```sql
create table users (
  fullName text NOT NULL,
  address text NOT NULL,
)

create table dogs (
  name text NOT NULL,
  breed text NOT NULL,
  avatarUri text NOT NULL,
  userId uuid NOT NULL
)

create table bookings (
  bookingId uuid NOT NULL,
  startTime timestamp NOT NULL, --startTime format: 'YYYY-MM-DD HH:MI:SS'
  userId uuid NOT NULL,
  dogId uuid NOT NULL
)
```

## API Layer

One of the reasons of using Supabase is because they give its users a set of methods to access and modify table data. More information about it can be viewed here: https://supabase.com/docs/guides/api/creating-routes?language=javascript#rest-api

Below is an example of an API layer that enables users to book time and edit their information such as their profile and what dogs they own.

I will utilize the built in methods such as: `select()`, `insert()`, `update()`, and `delete()`.

Remember to create a .env file with the following keys:

```env
  NEXT_PUBLIC_SUPABASE_URL=<url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
```

Documentation on how to obtain these keys can be found here: https://supabase.com/docs/guides/api/creating-routes#api-url-and-keys

The layer consists of an object that allows you to edit users, dogs, and bookings in a single area. Import `WalkTheDogAPI` in your component to edit the data.

```javascript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const BookingAPI = {
  /* startTime format: 'YYYY-MM-DD HH:MI:SS' */

  getBookings: async function (startTime) {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select()
        .eq(
          'date(startTime)',
          startTime
        ); /* Using date() will allow you to retrieve bookings solely by the date and not time */

      return bookings;
    } catch (error) {
      console.log('error', error);
    }
  },
  getBooking: async function (startTime) {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select()
        .eq(
          'startTime',
          startTime
        ); /* Retrieve a booking by the date and time */

      return bookings;
    } catch (error) {
      console.log('error', error);
    }
  },
  addBooking: async function (startTime, userId, dogId) {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .insert({ startTime, userId, dogId })
        .select();

      return bookings;
    } catch (error) {
      console.log('error', error);
    }
  },
  deleteBooking: async function (startTime) {
    try {
      await supabase.from('bookings').delete().eq('startTime', startTime);
    } catch (error) {
      console.log('error', error);
    }
  },
};

export const UsersAPI = {
  getUser: async function (userId) {
    try {
      await supabase.from('users').select().eq('userId', userId);
    } catch (error) {
      console.log('error', error);
    }
  },
  updateUser: async function (userId, fullName, address) {
    try {
      await supabase
        .from('users')
        .update({
          fullName,
          address,
        })
        .eq('userId', userId);
    } catch (error) {
      console.log('error', error);
    }
  },
};

export const DogsAPI = {
  getDogs: async function (userId) {
    try {
      const { data: dogs, error } = await supabase
        .from('dogs')
        .select()
        .eq('userId', userId);

      return dogs;
    } catch (error) {
      console.log('error', error);
    }
  },
  getDog: async function (dogId) {
    try {
      const { data: dogs, error } = await supabase
        .from('dogs')
        .select()
        .eq('dogId', dogId);

      return dogs;
    } catch (error) {
      console.log('error', error);
    }
  },
  addDog: async function (name, breed, avatarUri, userId) {
    try {
      const { data: dogs } = await supabase
        .from('dogs')
        .insert({
          name,
          breed,
          avatarUri,
          userId,
        })
        .select();

      return dogs;
    } catch (error) {
      console.log('error', error);
    }
  },
  deleteDog: async function (dog) {
    try {
      await supabase.from('dogs').delete().eq('dogId', dogId);
    } catch (error) {
      console.log('error', error);
    }
  },
};
```

## Booking component and submission

### Notes

- I will use a calendar plugin that will have a day view, incrementing time by the hour
- I will query all the rows in the Bookings table whose startTime contains the current date
- For each hour, I will render the Hour component, passing the hour, selected date, and if a row from the Bookings table exists, the booking data to the component
- When checking for bookingData, grab the dog id as well
- Use the dog id then get its information like the dog's name

```javascript
import { useState } from 'react';
import { BookingAPI, DogsAPI } from '@api/walkTheDogAPI'

const Hour = ({ date, time, bookingData, userId }) => {
  const hasBookingData = Object.keys(bookingData).length > 0;
  const startTime = new Date(`${date}T${time}`);

  const [booked, setBooked] = useState(hasBookingData);
  const [dogName, setDogName] = useState('');
  const [dogId, setDogId] = useState('');

  const handleBooking = () => {
    BookingAPI.addBooking(userId, startTime, dogId);
    setBooked(true)
  }

  const handleCanceling = () => {
    BookingAPI.deleteBooking(startTime);
    setBooked(false)
  }

  useEffect(() => {
    /* TODO: Work with a designer on how to select a dog if there are more than one. Grab the first dog for now. */
    const dogs = DogsAPI.getDogs(userId)

    if (dogs) {
      setDogName(dogs[0].name)
      setDogId(dogs[0].id)
    }
  }, [])

  if (booked) {
    return (
      <div>
        <div>
          <div>{time}</div>
          <button onClick={handleCanceling}>Cancel</button>
        </div>
        <div>
          Your dog {dogName} is booked for a walk!
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>{time}</div>
        <button onClick={handleBooking}>Book</button>
      </div>
    </div>;
  )
};
```
