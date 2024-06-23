# Disclaimer

This project was created solely for learning and practice purposes related to specific technologies. It is not intended for commercial use or to infringe upon any trademarks or copyrights.

---------------------------------------------------------




## ChatFusion

Welcome to the **ChatFusion** project inspired by discord! This repository contains the source code for a full-stack, real-time chat application inspired by Discord. This project showcases the use of modern web development technologies and tools to build a scalable and efficient application.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## Features
- **General**
  - User Authentication
    - Secure authentication and user management using Clerk.
    - Handle user profiles and preferences.
 
  - Responsive Design
    - Implement responsive design using Tailwind CSS and ShadCN/UI.

  - Messages
    - Send text or image, edit and delete messages.
    - React with standard emoji to each message
    - Allow users to create threads in channels from message for focused discussions.
    - Pin or Delete important messages in channels or direct message.
   

- **Servers**
  - Server Management
    - Create, update, join, leave, and delete servers.
    - Manage server settings and configurations.
  - Role Management
    - Create, update, and delete roles within a server.
    - Assign roles to server members.
    - Define permissions for each role.
  - Channel Management
    - Create(text and audio), update, and delete (coming soon) channels within a server.
  - Threads Management
    - Create, update(coming soon), and delete(coming soon) threads within channels.
  - Server profile 
    - View or edit server profile.
  - Voice Channels
    - Create and join voice channels for real-time voice communication (coming soon).

- **Friends**
  - Send, view and accept friend request.




## Tech Stack

### Frontend
- **Next.js 14**: A React framework for server-rendered applications.
- **SWR**: React Hooks for data fetching.
- **TypeScript**: Strongly typed JavaScript.
- **TailwindCSS**: Utility-first CSS framework.
- **ShadCN/UI**: A design system built on TailwindCSS.
- **Clerk**: Authentication and user management.
- **Zustand**: Small-Fast state management

### Backend
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Socket.io**: For real-time, bidirectional communication between web clients and servers.
- **PostgreSQL**: A powerful, open-source relational database system.
- **Cloudinary**: Cloud-based image and video management services.




