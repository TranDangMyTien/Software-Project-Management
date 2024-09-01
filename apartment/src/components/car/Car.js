import React, { useState } from 'react';
import './Car.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Header from '../layout/Header';

function VehicleInfo() {
    const navigate = useNavigate();

    const handleRegister= () => {
        navigate('/register-parking');
    }

    return (
        <div className='home'>
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: "#555" }}>DANH SÁCH THẺ XE ĐANG SỬ DỤNG</h1>
        <Button style={{marginBottom: "10px" }} onClick={() => handleRegister()}>Đăng Ký Thẻ Xe</Button>
        <div style={{ marginBottom: '20px' }}>
            <Card />
            <Card />
        </div>
        </div>
        </div>
    );
    
}
const Card = () => {
    return (
        <>
            <Header/>
            <div style={cardStyle}>
                <div style={iconStyle}>icon</div>
                <div style={infoStyle}>
                    <p>
                        <strong>Cư dân:</strong>{" "}
                        <span style={infoSpanStyle}>[Thông tin cư dân]</span>
                    </p>
                    <p>
                        <strong>Khu vực giữ xe:</strong>{" "}
                        <span style={infoSpanStyle}>[Thông tin khu vực]</span>
                    </p>
                    <p>
                        <strong>Loại xe:</strong>{" "}
                        <span style={infoSpanStyle}>[Thông tin loại xe]</span>
                    </p>
                    <p>
                        <strong>Ngày tạo:</strong>{" "}
                        <span style={infoSpanStyle}>[Thông tin ngày tạo]</span>
                    </p>
                </div>
            </div>
        </>
    );
};
const cardStyle = {
    display: 'flex',
    backgroundColor: '#003366',
    color: 'white',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px'
};

const iconStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: 'white',
    color: '#003366',
    textAlign: 'center',
    lineHeight: '60px',
    fontWeight: 'bold',
    marginRight: '20px',
    borderRadius: '8px'
};

const infoStyle = {
    flexGrow: 1
};

const infoSpanStyle = {
    display: 'inline-block',
    backgroundColor: '#555',
    width: '150px',
    height: '20px',
    marginLeft: '10px',
    borderRadius: '4px'
};
  
export default VehicleInfo;