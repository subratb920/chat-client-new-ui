import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from "@chakra-ui/react";
import './index.css';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomePage from './pages/homePage/homePage';
import ChatPage from './pages/chatPage/chatPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} StrictMode >
      <Route path="" element={<HomePage />} />
      <Route path="chats" element={<ChatPage />} />
    </Route>
  )
)
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
