import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//#################################routen
import Root from './routes/root';
import LoginGoogle from './routes/logingoogle';
import AccountErstellung from './routes/newacc';
import NewsFeed from './routes/newsfeed';
import Profil from './routes/profilepage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/newacc",
    element: <AccountErstellung />,
  },
  {
    path: "/newsfeed",
    element: <NewsFeed />,
  },
  {
    path: "/login/google",
    element: <LoginGoogle />,
  },{
    path: "/Profil/:userId",
    element: <Profil />,
  },
   
]);

const container = document.getElementById('root');
const root = createRoot(container); // Erstellt Root

root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
