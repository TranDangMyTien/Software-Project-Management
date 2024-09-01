import axios from "axios"
const BASE_URL="http://192.168.1.7:8000/"
export const endpoints = {
    login: "o/token/",
    postAvatar: "User/upload_avatar/",
    getUser: "/User/",
    postInfoUser: "Info/create_passForgot/",
    changPass: "Info/reset_password/",
    carCard: "CarCard/update_card/",
    deleteCarCard: "CarCard/delete_card/",
    ListCarCardOfUser: "CarCard/get_card/",
    getPeople: "user_info_people/get_infopeople/",
    ListGoodssOfUser: "goods/get_goods/",
    createGoodss: "goods/create_goods/",
    changeStatusGoods: (id) => `goods/${id}/Update_items_tatus/`,
    getListSurvey: "surveys/status/",
    getQS: (id) => `/surveys/${id}/questions/`,
    postAs: "surveyresponses/",

};

export const authAPI = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default axios.create({
    baseURL: BASE_URL,
});