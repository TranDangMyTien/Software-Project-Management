import React, { useState } from 'react';
import './Cabinet.css';

const Cabinet = () => {
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

    const orders = [
        {
            name: 'Order 1',
            size: 'Medium',
            receivedDate: '2024-08-01',
            status: 'Pending',
            imageUrl: 'image1.jpg',
        },
        {
            name: 'Order 2',
            size: 'Large',
            receivedDate: '2024-08-05',
            status: 'Ready for Pickup',
            imageUrl: 'image2.jpg',
        },
        // Add more orders if necessary
    ];

    const handlePrevious = () => {
        if (currentOrderIndex > 0) {
            setCurrentOrderIndex(currentOrderIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentOrderIndex < orders.length - 1) {
            setCurrentOrderIndex(currentOrderIndex + 1);
        }
    };

    return (
        <div className="cabinet-container">
            <h1 className="cabinet-title">THÔNG TIN TỦ ĐỒ ĐIỆN TỬ</h1>

            <div className="order-content">
                <div className="cabinet-card">
                    <button className="register-button">
                        <span className="plus-icon">+</span> Đăng ký nhận hàng
                    </button>
                </div>

                <div className="order-details">
                    <h2 className="order-title">{orders[currentOrderIndex].name}</h2>
                    <p><strong>Kích thước:</strong> {orders[currentOrderIndex].size}</p>
                    <p><strong>Ngày nhận:</strong> {orders[currentOrderIndex].receivedDate}</p>
                    <p><strong>Trạng thái:</strong> <span className={`status ${orders[currentOrderIndex].status === 'Ready for Pickup' ? 'ready' : 'pending'}`}>
                        {orders[currentOrderIndex].status}</span>
                    </p>
                    <div className="image-container">
                        <img src={orders[currentOrderIndex].imageUrl} alt="Order" className="order-image" />
                        <p>Hình ảnh</p>
                    </div>
                </div>
            </div>

            <div className="navigation-buttons">
                <button onClick={handlePrevious} disabled={currentOrderIndex === 0} className="nav-button">
                    &lt; Trước
                </button>
                <button onClick={handleNext} disabled={currentOrderIndex === orders.length - 1} className="nav-button">
                    Sau &gt;
                </button>
            </div>
        </div>
    );
};

export default Cabinet;
