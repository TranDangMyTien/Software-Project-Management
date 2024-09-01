import React from "react";
import "./Profile.css"; // Bạn có thể thêm CSS vào đây để điều chỉnh giao diện
import Header from "../layout/Header";

function Profile() {
    return (
        <>
            <div className="home">
                <Header />
                <div className="container_van">
                    <h1 className="h1_van">Thông tin cá nhân</h1>
                    <form>
                        <div className="form-group_van">
                            <label className="label-van">Số điện thoại:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="********"
                                readOnly
                            />
                        </div>
                        <div className="form-group_van">
                            <label className="label-van">Ngày sinh:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="**/**/****"
                                readOnly
                            />
                        </div>
                        <div className="form-group_van">
                            <label className="label-van">Giới tính:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="********"
                                readOnly
                            />
                        </div>
                        <div className="form-group_van">
                            <label className="label-van">Số điện thoại:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="********"
                                readOnly
                            />
                        </div>
                        <div className="form-group_van">
                            <label className="label-van">Ngày hết hạn:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="**/**/****"
                                readOnly
                            />
                        </div>
                        <div className="form-group_van">
                            <label className="label-van">Số căn hộ:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="********"
                                readOnly
                            />
                        </div>
                        <div className="form-group_van">
                            <label className="label-van">CMND/CCCD:</label>
                            <input
                                type="text"
                                className="input_van"
                                value="********"
                                readOnly
                            />
                        </div>
                        <button type="button" className="btn-logout">
                            Đăng xuất
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
