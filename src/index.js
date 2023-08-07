import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import Lab from './Lab';
import Stats from './Stats';
import "./index.css"
import 'flowbite';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/lab",
    element: <Lab />,
  },
  {
    path: "/stats",
    element: <Stats />
  },
  {
    path: "*",
    element: <Home />
  }
]
);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
);


