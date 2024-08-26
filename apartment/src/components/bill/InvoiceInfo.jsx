import React, { useState, useEffect, useContext } from 'react';
import { Linking, View, RefreshControl, ActivityIndicator, FlatList, Modal, Text, Button, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Badge, Appbar, Menu, Provider } from 'react-native-paper';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from '../utils/MyContext'; // Import MyUserContext
import styles from './InvoiceInfo.css'; // Import styles from CSS file

const getBills = async (token) => {
    try {
        const response = await axios.get('http://192.168.1.11:8000/Bill/get_bill/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

const InvoiceInfo = () => {
    const user = useContext(MyUserContext);
    const token = user?.token; // Safe access with optional chaining
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [visible, setVisible] = useState(false);

    const nav = useNavigation();

    useEffect(() => {
        if (token) {
            fetchBills();
        } else {
            setError('User token is missing.');
            setLoading(false);
        }
    }, [token]);

    const fetchBills = async () => {
        setLoading(true);
        const data = await getBills(token);
        if (data) {
            const unpaidBills = data.filter(bill => bill.status_bill === 'Unpaid');
            setBills(unpaidBills);
        } else {
            setError('Error fetching bills');
        }
        setLoading(false);
        setRefreshing(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchBills();
    };

    const handlePaymentPress = (bill) => {
        setSelectedBill(bill);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleMomoPayment = async () => {
        const payload = {
            id: selectedBill.id,
            total: selectedBill.money,
        };

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        try {
            const inforPay = await axios.post(
                "https://phanhoangtrieu.pythonanywhere.com/momo/create/",
                query,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            const url = inforPay.data.payUrl;
            if (url) {
                Linking.openURL(url);
            }
        } catch (error) {
            console.error('Error fetching URL:', error);
        }

        closeModal();
    };

    const handleZaloPayPayment = async () => {
        const payload = {
            id: selectedBill.id,
            amount: selectedBill.money,
        };

        let esc = encodeURIComponent;
        let query = Object.keys(payload)
            .map((k) => esc(k) + "=" + esc(payload[k]))
            .join("&");

        try {
            const inforPay = await axios.post(
                "https://phanhoangtrieu.pythonanywhere.com/zalo/create/",
                query,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            const url = inforPay.data.order_url;
            if (url) {
                Linking.openURL(url);
            }
        } catch (error) {
            console.error('Error fetching URL:', error);
        }

        closeModal();
    };

    const handleBankPayment = () => {
        nav.navigate("BankPayScreen", { bill: selectedBill });
        closeModal();
    };

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const _handleSearch = () => console.log('Searching');
    const _handleMore = () => {
        openMenu();
    };

    const handlePaidBills = () => {
        nav.navigate("BillPaidScreen");
        closeMenu();
        console.log('Hóa đơn đã thanh toán');
    };

    const handleGoBack = () => {
        nav.goBack();
    };

    const getStatusStyle = (status_bill) => {
        return status_bill === 'Unpaid' ? styles.badgeUnpaid : styles.badgePaid;
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.statusContainer}>
                    <Badge style={getStatusStyle(item.status_bill)}>{item.status_bill}</Badge>
                </View>
                <Title style={styles.title}>{item.name_bill}</Title>
                <Paragraph style={styles.money}>Tổng phí: {item.money} VND</Paragraph>
                <Paragraph style={styles.paragraph}>Ghi chú: {item.decription}</Paragraph>
                <Paragraph style={styles.paragraph}>Loại phí: {item.type_bill}</Paragraph>
                <Paragraph style={styles.paragraph}>
                    Ngày tạo: {format(new Date(item.created_date), 'dd/MM/yyyy')}
                </Paragraph>
                <Button
                    mode="contained"
                    onPress={() => handlePaymentPress(item)}
                    style={styles.paymentButton}
                    contentStyle={{ height: 50 }}
                >
                    Thanh toán
                </Button>
            </Card.Content>
        </Card>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color="gold" size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <Provider>
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={handleGoBack} />
                    <Appbar.Content title="HÓA ĐƠN" />
                    <Appbar.Action icon="magnify" onPress={_handleSearch} />
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
                        }
                    >
                        <Menu.Item onPress={handlePaidBills} title="Hóa đơn đã thanh toán" />
                    </Menu>
                </Appbar.Header>
                <FlatList
                    data={bills}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                <Modal
                    visible={modalVisible}
                    onRequestClose={closeModal}
                    transparent
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.closeButtonText}>Chọn phương thức thanh toán</Text>
                            <TouchableOpacity
                                style={styles.paymentOptionButton}
                                onPress={handleMomoPayment}
                            >
                                <Text>Thanh toán bằng MoMo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.paymentOptionButton}
                                onPress={handleZaloPayPayment}
                            >
                                <Text>Thanh toán bằng ZaloPay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.paymentOptionButton}
                                onPress={handleBankPayment}
                            >
                                <Text>Thanh toán bằng Ngân hàng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </Provider>
    );
};

export default InvoiceInfo;
