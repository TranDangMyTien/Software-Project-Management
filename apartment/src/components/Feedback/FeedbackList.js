import React, { useState } from 'react';
import './FeedbackList.css';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const FeedbackList = () => {
  const navigate = useNavigate();
  const feedbacks = [
    { id: 1, title: 'Tình trạng đường sá', content: 'Đường xuống cấp trầm trọng' },
    { id: 2, title: 'Vệ sinh môi trường', content: 'Rác thải không được thu gom' },
    { id: 3, title: 'Điện nước không ổn định', content: 'Mất điện liên tục' },
    { id: 4, title: 'Giao thông', content: 'Kẹt xe giờ cao điểm' },
    { id: 5, title: 'An ninh khu vực', content: 'Cần tăng cường an ninh' },
    { id: 6, title: 'Giá cả sinh hoạt', content: 'Giá cả tăng cao' },
    { id: 7, title: 'Hệ thống thoát nước', content: 'Ngập úng sau mưa' },
    { id: 8, title: 'Tiếng ồn', content: 'Ô nhiễm tiếng ồn từ công trường' },
    // Add more feedback items as needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;  // Số phản ánh hiển thị trên mỗi trang

  // Tính toán các phản ánh hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = feedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // Tổng số trang
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  // Hàm chuyển trang
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFeedback= () => {
    navigate('/create_feedback');
  }

  return (
    <div className="feedback-fullscreen">
        
      <h1 className="feedback-title">PHẢN ÁNH ĐÃ GỬI</h1>
      
      <div className='feadback-create'>
      <p className="feedback-subtitle">Danh sách các phản ánh đã gửi</p>
      <Button className='button-feedback' onClick={() => handleFeedback()}>Tạo Phản Ánh</Button>
      </div>
      <div className="feedback-container">
        {currentItems.map(feedback => (
          <div className="feedback-item" key={feedback.id}>
            <div>
            <img className="feedback-image" src='https://res.cloudinary.com/dr9h3ttpy/image/upload/v1724670931/syxhtr1dbx0v6bdaanwb.jpg'>
            </img>
            </div>
            <div className="feedback-content">
              <h3>{feedback.title}</h3>
              <p>{feedback.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>{`Trang ${currentPage} / ${totalPages}`}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default FeedbackList;