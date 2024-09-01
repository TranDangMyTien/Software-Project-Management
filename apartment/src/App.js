import React, { useState, useReducer, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import cookie from "react-cookies";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import Header  from "./components/layout/Header";
import { MyDispatchContext, MyUserContext } from "./components/utils/MyContext";
import {MyUserReducer} from "./components/utils/Reducers";
import Home from "./components/Home/Home";
import RegisterParking from "./components/car/RegisterParking";
import Cabinet from "./components/cabinet/Cabinet";
import Bill from './components/bill/Bill';
import InvoiceInfo from './components/bill/InvoiceInfo';
import Feedback from './components/Feedback/Feedback';
import FeedbackList from './components/Feedback/FeedbackList';
import { Container } from 'react-bootstrap';
import Login from "./components/Login/Login";
import VehicleInfo from './components/car/Car';
import Profile from './components/Login/Profile';
import Goods from './components/Good/Good';
import TienIch from './components/Home/tienich';

function App() {
  // const [user, dispatch] = useReducer(
  //   MyUserReducer,
  //   cookie.load("user") || null
  // );
  return (
    <BrowserRouter>
      {/* <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register-parking" element={<RegisterParking />} />
            <Route path="/cabinet" element={<Cabinet />} />
            <Route path='/bill' element={<Bill/>} />
            <Route path="/invoice" element={<InvoiceInfo/>} />
            <Route path="/feedback" element={<FeedbackList />} />
            <Route path="/create_feedback" element={<Feedback />} />
          </Routes>
          <Footer />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider> */}
      <Header />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/bill' element={<Bill />} />
          <Route path="/invoice" element={<InvoiceInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-parking" element={<RegisterParking />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/good" element={<Goods />} />
          <Route path="/tienich" element={<TienIch />} />
          <Route path="/feedback" element={<FeedbackList />} />
          <Route path="/create_feedback" element={<Feedback />} />
          <Route path="/car" element={<VehicleInfo />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>

  );

  // Khởi tạo trạng thái người dùng và dispatcher với useReducer
  const [user, dispatcher] = useReducer(MyUserReducer, null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
      const checkLoginStatus = async () => {
          try {
              // Lấy token từ localStorage (hoặc AsyncStorage nếu bạn đang sử dụng React Native)
              const token = localStorage.getItem("access_token");
              setUserToken(token);
          } catch (e) {
              console.error(e);
          } finally {
              setIsLoading(false);
          }
      };

      checkLoginStatus();
  }, []);

  // Hiển thị loading indicator trong khi kiểm tra trạng thái đăng nhập
  if (isLoading) {
      return (
          <div className="loading-container">
              <p>Loading...</p>
          </div>
      );
  }

  return (
      <BrowserRouter>
          <MyUserContext.Provider value={user}>
              <MyDispatchContext.Provider value={dispatcher}>
                  <Container>
                      <Routes>
                          <Route
                              path="/"
                              element={<Navigate to="/login" />}
                          />
                          <Route path="/login" element={<Login />} />
                          <Route path="/home" element={<Home />} />
                          <Route path="/bill" element={<Bill />} />
                          <Route path="/invoice" element={<InvoiceInfo />} />

                          <Route
                              path="/register-parking"
                              element={<RegisterParking />}
                          />
                          <Route path="/cabinet" element={<Cabinet />} />
                          <Route path="/good" element={<Goods />} />
                          <Route path="/tienich" element={<TienIch />} />
                          <Route
                              path="/feedback"
                              element={<FeedbackList />}
                          />
                          <Route
                              path="/create_feedback"
                              element={<Feedback />}
                          />
                          <Route path="/car" element={<VehicleInfo />} />
                          <Route path="/profile" element={<Profile />} />
                      </Routes>
                  </Container>
                  <Footer />
              </MyDispatchContext.Provider>
          </MyUserContext.Provider>
      </BrowserRouter>
  );


}



export default App;
