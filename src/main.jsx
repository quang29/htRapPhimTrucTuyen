import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";


/**Set up axious */
// axios.defaults.baseURL = 'https://api.themoviedb.org/3'
// axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster position="top-right" reverseOrder={false} />
  </Provider>
  //  </React.StrictMode> 
)
