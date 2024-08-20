import React from 'react';
import './Footer.css'; // File CSS nếu bạn muốn thêm style riêng

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__section">
                    <h4>Chung Cư TNVV</h4>
                    <p>&copy; 2024 Chung Cư TNVV. All rights reserved.</p>
                </div>
                <div className="footer__section">
                    <h4>Thành Viên</h4>
                    <ul>
                        <li><a>Nguyễn Thị Hiền Vy</a></li>
                        <li><a>Nguyễn Thị Mỹ Vân</a></li>
                        <li><a>Nguyễn Hoàng Nhi</a></li>
                        <li><a>Trần Đặng Mỹ Tiên</a></li>
                    </ul>
                </div>
                <div className="footer__section">
                    <h4>Liên Hệ</h4>
                    <p>Trường Đại học Mở thành phố Hồ Chí Minh</p>
                    <p>Khoa Công Nghệ Thông Tin</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;