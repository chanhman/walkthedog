# Walk the Dog

This is an app that allows me to keep track of who has made an appointment to walk their dogs.

## Stack

> Describe the stack you’d use to build this app and why you’d choose these technologies over others

Considering the size of my company and the dual roles of developer and dog walker, I have opted to maintain a minimal tech stack. The selection of tools has been made based on the availability of resources, with the aim of tapping into a large developer community and accessing robust tools. Additionally, I prioritize a positive developer experience, so tools with excellent documentation were taken into account.

### Frontend

- Next.js (https://nextjs.org/): versatile setup configurations and its ability to run on both the client and server sides, built-in support for TypeScript, various styling methods like Tailwind, and integrated routing, reducing the need for extensive configuration. For instance, if I were to use React or Create React App alone, I would have to install and configure those tools separately.
- TypeScript (https://www.typescriptlang.org/): For typing and intellisense, creates documentation of what components accept.
- Tailwind (https://tailwindui.com/): Initially keeping the CSS simple and making the initial prototyping fast

### Backend

Supabase (https://supabase.com/): minimal configuration, particularly in areas such as database management, storage, and user authentication. While alternatives like Firebase are available, opting for a tool that utilizes Postgres opens up opportunities for accessing additional resources and allows for easy service switching.

### Miscellaneous:

As the application expands, I plan to gradually introduce other tools to enhance the developer experience. For example, I intend to incorporate React Query (https://tanstack.com/) to improve code quality and state management and implement various types of tests, including unit tests (https://jestjs.io/).

## Schema

> Detail the database schema you would use to represent all of the data displayed in the wireframes (hint: keep it simple!)

A basic example of how the schema would look like:

```sql
create table users (
  id bigint generated by default as identity primary key,
  fullName text not null,
  address text not null
);

create table dogs (
  id bigint generated by default as identity primary key,
  name text not null,
  breed text,
  avatarUri text,
  userId bigint not null
);

create table bookings (
  id bigint generated by default as identity primary key,
  startTime timestamp without time zone not null,
  userId bigint not null references users,
  dogId bigint not null references dogs
);
```

## API Layer

> What does the API layer between the front and back end look like? Which routes are needed to display all the data in the wireframes and handle all potential actions?

I considered using Next.js's API routes to query data like so:

```javascript
// /api/bookings/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient < Database > { cookies };
  const { data } = await supabase.from('bookings').select();
  return NextResponse.json(data);
}
```

This felt like adding an extra layer that was not needed. One of the reasons for using Supabase is that it provides its users with a set of methods to access and modify table data. More information about it can be viewed here: https://supabase.com/docs/guides/api/creating-routes?language=javascript#rest-api

Below is an example of a few API layers that enable users to book time and edit their information, such as their profile and the dogs they own.

I will utilize the built-in methods such as: `select()`, `insert()`, `update()`, and `delete()`.

### Layers

- [Booking](lib/api/booking.ts)
- [Dogs](lib/api/dogs.ts)
- [Users](lib/api/users.ts)

## Booking component and submission

> Write a React or React Native component for a row in the calendar that handles the various states it can be in (available, booked with someone else’s dog, booked with your dog)

> Write the server-side function that runs when a user presses “book” (pseudocode is fine)

The component that allows you to book time can be viewed below. Given the time, I chose to follow Supabase's convention and utilized their methods to interact with the database. (https://supabase.com/docs/guides/api/creating-routes?language=javascript#using-the-api).

- [Component](app/components/Hour.tsx)

### Todo:

- [ ] Create separate components to handle buttons, error messages, containers
- [ ] Use Next.js's server components (?): https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#server-only-forms
