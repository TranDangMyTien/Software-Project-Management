import React, { useContext, useState } from "react";
import "./Good.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faScaleBalanced,
    faBreadSlice,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../layout/Header";
import { useNavigate } from "react-router";
import { MyUserContext } from "../utils/MyContext";
import APIs, { endpoints } from "../utils/APIs";
import Home from "../Home/Home";
import Swal from "sweetalert2";
import axios from "axios";

const Goods = () => {
    const [loading, setLoading] = React.useState(false);
    const [NameGoodss, setNameGoodss] = useState("");
    const [NoteGoodss, setNoteGoodss] = useState("");
    const [SizeGoodss, setSizeGoodss] = useState("");
    const nav = useNavigate();
    const user = useContext(MyUserContext);
    console.log("user: ",user);
    const send = async () => {
        if (NameGoodss && NoteGoodss && SizeGoodss) {
            setLoading(true);

            const payload = {
                name_goods: NameGoodss,
                note: NoteGoodss,
                size: SizeGoodss,
            };
            console.log("Dữ liệu đăng kí nhận hàng (payload): ", payload);
            let esc = encodeURIComponent;
            let query = Object.keys(payload)
                .map((k) => esc(k) + "=" + esc(payload[k]))
                .join("&");

            try {
                let res = await axios.post(
                    `http://127.0.0.1:8000/goods/create_goods/`,
                    query,
                    {
                        Authorization: `Bearer ${user.token}`,
                        withCredentials: true,
                        crossdomain: true,
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                );
                console.log("Tới đây");

                if (res.status === 201) {
                    Swal.fire(
                        "Đăng ký thành công",
                        "Gửi xét duyệt thành công",
                        "success"
                    ).then(() => {
                        nav("/home"); // Sử dụng nav('/') để điều hướng đúng
                    });
                }
            } catch (ex) {
                console.error(ex);
                Swal.fire("Lỗi", "Có lỗi xảy ra khi gửi yêu cầu", "error").then(
                    () => {
                        nav("/home"); // Điều hướng về trang chính sau khi thông báo lỗi
                    }
                );
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire("Thông báo", "Bạn chưa nhập đủ thông tin", "warning");
        }

        // } else {
        //     alert("Lỗi");
        //     nav.navigate(Home);
        // }
    };
    return (
        <>
            <div className="home">
                <Header />
                <div className="form-container">
                    <h1 className="vy">Nhập thông tin hàng hóa</h1>
                    <div className="container">
                        <form className="goods-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input_vy"
                                    placeholder="Nhập tên hàng"
                                    onChange={(e) =>
                                        setNameGoodss(e.target.value)
                                    }
                                />
                                <FontAwesomeIcon
                                    className="icon"
                                    icon={faBoxOpen}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input_vy"
                                    placeholder="Kích cỡ hàng hóa"
                                    onChange={(e) =>
                                        setSizeGoodss(e.target.value)
                                    }
                                />
                                <FontAwesomeIcon
                                    className="icon"
                                    icon={faScaleBalanced}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input_vy"
                                    placeholder="Lưu ý cho Ban quản lý"
                                    onChange={(e) =>
                                        setNoteGoodss(e.target.value)
                                    }
                                />
                                <FontAwesomeIcon
                                    className="icon"
                                    icon={faBreadSlice}
                                />
                            </div>
                            <button type="submit" onClick={send}>
                                Gửi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Goods;
