import React from "react";
import { Button } from "react-bootstrap";
import "./Home.css"; 
import { useNavigate } from "react-router";
import Header from "../layout/Header";

const Home = () => {
    const navigate = useNavigate();

    const handleTienIch = () => {
        navigate("/tienich");
    };

    const handleFeedback = () => {
        navigate("/feedback");
    };

    const handleBill = () => {
        navigate("/bill");
    };

    return (
        <>
            <div className="home">
                <Header />
                <div className="login-container-home">
                    <h1 className="homeTitle">
                        Chào mừng đến với Chung cư TNVV
                    </h1>
                    <div className="homeButtons">
                        <Button
                            className="homeButton btnl"
                            variant="primary"
                            onClick={() => handleTienIch()}
                        >
                            Tiện ích
                        </Button>
                        <Button className="homeButton btnc" variant="primary">
                            Dịch vụ
                        </Button>
                        <Button
                            className="homeButton btnl"
                            variant="primary"
                            onClick={() => handleBill()}
                        >
                            Hóa đơn
                        </Button>
                        <Button
                            className="homeButton btnc"
                            variant="primary"
                            onClick={() => handleFeedback()}
                        >
                            Phản ánh
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
