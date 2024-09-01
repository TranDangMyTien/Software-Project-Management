import React, { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom"; // Sửa đổi để sử dụng useNavigate từ react-router-dom
import APIs, { authAPI, endpoints } from "../utils/APIs";
import { MyDispatchContext } from "../utils/MyContext";
import axios from "axios";
import Home from "../Home/Home";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Đảo ngược trạng thái của mật khẩu (hiển thị hoặc ẩn đi)
    };

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatcher = useContext(MyDispatchContext);
    const navigate = useNavigate(); // Sử dụng useNavigate

    const [loading, setLoading] = useState(false);

    const login = async (event) => {
        event.preventDefault(); // Ngăn form tự động gửi yêu cầu

        setLoading(true);
        setErrorMessage(false);
        const payload = {
            username,
            password,
            client_id: "183RXU5hBv3MZjfsfBmTZbfgIPM3OCu5lCYuNgBH",
            client_secret: "MSUr1Q4trFAWEacXHlC2cZg8F56z1rISJTyuscNyNjHpzrr12zrwrcd4QFhVwLSXeKC8URbeEYw8k97s5qe41bHOVy5jdm66SdoiRW8YNXKmlLdluvOUZGM6nDWLcC7F",
            grant_type: "password",
        };

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        try {
            let res = await APIs.post(
                endpoints["login"],
                {
                    username,
                    password,
                    client_id: "183RXU5hBv3MZjfsfBmTZbfgIPM3OCu5lCYuNgBH",
                    client_secret: "MSUr1Q4trFAWEacXHlC2cZg8F56z1rISJTyuscNyNjHpzrr12zrwrcd4QFhVwLSXeKC8URbeEYw8k97s5qe41bHOVy5jdm66SdoiRW8YNXKmlLdluvOUZGM6nDWLcC7F",
                    grant_type: "password",
                }
            );

            localStorage.setItem("access_token", res.data.access_token);

            setTimeout(async () => {
                let token = localStorage.getItem("access_token");
                let user = await authAPI(token).get(endpoints["getUser"]);
                localStorage.setItem("user", JSON.stringify(user.data));
                dispatcher({
                    type: "login",
                    payload: { ...user.data, token },
                });
                console.log("Tới đây: ", user.data);

                navigate("/home");
            }, 100);
        } catch (error) {
            setErrorMessage(true);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <div className="login-container">
                <h1 className="nhi">Đăng nhập</h1>
                <p className="nhi1">Chào mừng bạn đến với chung cư TNVV</p>
                <form className="login-form" onSubmit={login}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <span className="input-icon">👤</span>
                    </div>
                    <div className="input-group">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="input-icon"
                            onClick={handleTogglePasswordVisibility}
                        >
                            {isPasswordVisible ? "🙈" : "👀"}
                        </span>
                    </div>
                    <a className="forgot-password" href="/forgot-password">
                        Quên mật khẩu?
                    </a>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                        onClick={login}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                    {errorMessage && (
                        <p className="error-message" style={{ color: "red" }}>
                            Đăng nhập thất bại. Vui lòng thử lại.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
