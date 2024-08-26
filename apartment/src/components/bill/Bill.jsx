import React, { useEffect, useState } from "react";
import { Button, Card, Container, Navbar, Nav, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyUserContext } from "../utils/MyContext";
import { format } from "date-fns";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Bill.css';

const Bill = () => {
    const user = React.useContext(MyUserContext);
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getBills = async (token) => {
        if (!token) {
            console.error("Token is missing");
            return;
        }
        try {
            const response = await axios.get(
                "http://192.168.1.11:8000/Bill/get_bill/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBills(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching bills:", error);
            alert("Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchBills = async () => {
        setLoading(true);
        if (user && user.token) {
            const data = await getBills(user.token);
            if (data) {
                const paidBills = data.filter(
                    (bill) => bill.status_bill === "paid"
                );
                console.log("paidBills: ", paidBills);
                setBills(paidBills);
            }
        } else {
            console.error("User or token is missing");
            alert("Vui lòng đăng nhập lại.");
            navigate('/login');  // Redirect to login page
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchBills();
    }, [user]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const SeeDetails = (selectedBill) => {
        navigate("/invoice", { state: { bill: selectedBill } });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchBills();
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="container">
            <Navbar bg="primary" variant="dark" className="headers">
                <Container>
                    <Button variant="outline-light" onClick={handleGoBack} className="backButton">
                        Back
                    </Button>
                    <Navbar.Brand className="headerTitle">HÓA ĐƠN ĐÃ THANH TOÁN</Navbar.Brand>
                </Container>
            </Navbar>
            <div
                className="scrollView"
                style={{ padding: '20px' }}
                onScroll={onRefresh}
            >
                {bills.map((bill) => (
                    <Card key={bill.id} className="card mb-3">
                        <Card.Body>
                            <Card.Title className="title">{bill.name_bill}</Card.Title>
                            <Card.Text className="money">
                                Tổng phí: {bill.money} VND
                            </Card.Text>
                            <Card.Text className="paragraph">
                                Loại phí: {bill.type_bill}
                            </Card.Text>
                            <Card.Text className="paragraph">
                                Ngày thanh toán: {format(new Date(bill.updated_date), "dd/MM/yyyy")}
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => SeeDetails(bill)}
                                className="paymentButton"
                            >
                                Xem chi tiết
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
};

export default Bill;