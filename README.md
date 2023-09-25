# walkthedog

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

```
create table users (
  userId uuid NOT NULL,
  fullName text NOT NULL,
  address text NOT NULL,
  email text NOT NULL
)

create table dogs (
  dogId uuid NOT NULL,
  name text NOT NULL,
  breed text NOT NULL,
  avatarUri text NOT NULL,
  ownerId uuid NOT NULL
)

create table bookings (
  bookingId uuid NOT NULL,
  startTime timestamp NOT NULL, --startTime format: 'YYYY-MM-DD HH:MI:SS'
  ownerId uuid NOT NULL,
  dogId uuid NOT NULL
)
```

## API Layer

One of the reasons of using Supabase is because they give its users a set of methods to access and modify table data. More information about it can be viewed here: https://supabase.com/docs/guides/api/creating-routes?language=javascript#rest-api

Below is an example of an API layer that enables users to book time and edit their information such as their profile and what dogs they own.

I will utilize the built in methods such as: `select()`, `insert()`, `update()`, and `delete()`.

Remember to create a .env file with the following keys:

```
  NEXT_PUBLIC_SUPABASE_URL=<url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
```

Documentation on how to obtain these keys can be found here: https://supabase.com/docs/guides/api/creating-routes#api-url-and-keys

How the layer looks:

```
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const BookingsAPI = {
  /* startTime format: 'YYYY-MM-DD HH:MI:SS' */

  getBookings: async function(startTime) {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select()
        .eq('date(startTime)', startTime) /* Using date() will allow you to retrieve bookings solely by the date and not time */

      return bookings
    } catch(error) {
      console.log('error', error)
    }
  },
  getBooking: async function(startTime) {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select()
        .eq('startTime', startTime) /* Retrieve a booking by the date and time */

      return bookings
    } catch(error) {
      console.log('error', error)
    }
  },
  addBooking: async function(startTime, userId, dogId) {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .insert({ startTime, userId, dogId })
        .select()

      return bookings
    } catch (error) {
      console.log('error', error)
    }
  },
  deleteBooking: async function(startTime) {
    try {
      await supabase.from('bookings').delete().eq('startTime', startTime)
    } catch (error) {
      console.log('error', error)
    }
  },
}

export const UsersAPI = {
  update(),
}

export const DogsAPI = {
  insert(),
  update(),
  delete(),
}
```
