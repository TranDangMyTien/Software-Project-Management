import React, { useState } from 'react';
import './RegisterParking.css';

const RegisterParking = ({ isAdmin }) => {
    const [area, setArea] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [requests, setRequests] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRequest = { area, vehicleType, status: 'Pending' };
        setRequests([...requests, newRequest]);
        setArea('');
        setVehicleType('');
    };

    const handleApprove = (index) => {
        const updatedRequests = [...requests];
        updatedRequests[index].status = 'Approved';
        setRequests(updatedRequests);
    };

    const handleReject = (index) => {
        const updatedRequests = [...requests];
        updatedRequests[index].status = 'Rejected';
        setRequests(updatedRequests);
    };

    return (
        <div className="register-parking">
            <h1 className="title">ĐĂNG KÝ THẺ GIỮ XE</h1>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Nhập khu đăng ký thẻ giữ xe"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="text"
                    placeholder="Loại xe"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="input-field"
                    required
                />
                <button type="submit" className="submit-button">
                    <i className="check-icon">✔️</i> Gửi xét duyệt
                </button>
            </form>

            {/* Render review section only if the user is an admin */}
            {isAdmin && (
                <div className="review-section">
                    <h2 className="review-title">Xét Duyệt Thẻ Giữ Xe</h2>
                    {requests.length > 0 ? (
                        <ul className="request-list">
                            {requests.map((request, index) => (
                                <li key={index} className="request-item">
                                    <p>Khu vực: {request.area}</p>
                                    <p>Loại xe: {request.vehicleType}</p>
                                    <p>Trạng thái: {request.status}</p>
                                    {request.status === 'Pending' && (
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleApprove(index)}
                                                className="approve-button"
                                            >
                                                Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleReject(index)}
                                                className="reject-button"
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có yêu cầu nào đang chờ xét duyệt.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default RegisterParking;
