import React, { useState } from 'react';
import './Feedback.css';


function Feedback() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subject:', subject);
    console.log('Content:', content);
    console.log('Image:', image);
    // Xử lý gửi dữ liệu ở đây
  };

  return (
    <div className='home'>
    <div className="container_nhi">
      <h1 className='h1_nhi'>PHẢN ÁNH</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group_nhi">
          <label className='label_nhi'>Chủ đề</label>
          <input
            type="text"
            className='input_nhi'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Nhập chủ đề"
          />
        </div>
        <div className="form-group_nhi">
          <label className='label_nhi'>Nội dung</label>
          <textarea
            value={content}
            className='textarea_nhi'
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung"
          ></textarea>
        </div>
        <div className="form-group_nhi">
          <label className='label_nhi'>Chọn hình ảnh</label>
          <input
            type="file"
            className='file_nhi'
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="submit-button">Gửi phản ánh</button>
      </form>
    </div>
    </div>
  );
}

export default Feedback;