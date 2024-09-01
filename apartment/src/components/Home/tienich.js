import React from "react";
import "./tienich.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import Header from "../layout/Header";

const TienIch = () => {
    const navigate = useNavigate();

    const handleGood = () => {
        navigate("/cabinet");
    };
    const handleCar = () => {
        navigate("/car");
    };
    return (
        <>
            <Header />
            <div className="home_utilities">
                <div className="login-container-home">
                    <h1 className="homeTitle">Tiện Ích</h1>
                    <div className="utilities">
                        <Button
                            className="utility-item btnl"
                            onClick={() => handleCar()}
                        >
                            Xem danh sách thẻ xe đã đăng kí
                        </Button>
                        <Button
                            className="utility-item btnc"
                            onClick={() => handleGood()}
                        >
                            Tủ đồ điện tử
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default TienIch;
