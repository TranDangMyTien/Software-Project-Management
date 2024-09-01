import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Login from "../Login/Login";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Mặc định là chưa đăng nhập
    const navigate = useNavigate(); // Khởi tạo useNavigate

    // const handleAuthToggle = () => {
    //     setIsLoggedIn(!isLoggedIn);

    //     navigate("/logout");
    // };

    return (
        <header className="header">
            <div className="header__logo">
                <img
                    src="https://res.cloudinary.com/dr9h3ttpy/image/upload/v1724141015/aaaa.png"
                    alt="Logo"
                    className="logo-image"
                />
                <h1>Chung Cư TNVV</h1>
            </div>
            <nav className="header__nav">
                <ul>
                    <li>
                        <Link to="/home">Trang Chủ</Link>
                    </li>
                    <li>
                        <Link to="/profile">Hồ Sơ</Link>
                    </li>
                    <li>
                        <Link to="/login">Đăng xuất</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
