import React, { useState, useReducer } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import cookie from "react-cookies";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import { MyDispatchContext, MyUserContext } from "./components/utils/MyContext";
import MyUserReducer from "./components/Myreducer/MyUserReducer";
import Home from "./components/home/Home";
import RegisterParking from "./components/car/RegisterParking";


function App() {
  const [user, dispatch] = useReducer(
    MyUserReducer,
    cookie.load("user") || null
  );
  return (
    <BrowserRouter>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register-parking" element={<RegisterParking />} />

          </Routes>
          <Footer />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </BrowserRouter>

  );
}

export default App;
