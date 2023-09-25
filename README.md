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

As the application expands, I plan to gradually introduce other tools to enhance the developer experience. For example, I intend to incorporate MUI for faster design development, employ React Query to improve code quality and state management, and implement various types of tests, including unit tests.
