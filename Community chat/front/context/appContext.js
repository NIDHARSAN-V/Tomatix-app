import React, { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server URL

const AppContext = createContext();

export { AppContext, socket };
