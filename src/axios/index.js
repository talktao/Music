import Vue from 'vue'
import axios from 'axios'
//import qs from 'qs'
import store from '@/store'
Vue.prototype.$axios = axios
//Vue.prototype.$qs = qs
axios.defaults.baseURL = store.state.common.baseUrl;
axios.defaults.withCredentials = true; //让ajax携带cookie

//axios request 拦截器
axios.interceptors.request.use(
    config => {
        // if (store.state.sessionId != '') { // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        //     config.headers.sessionId = store.state.sessionId;
        // }
        // config.headers.withCredentials = true
        // config.headers.xhrFields = { withCredentials: true }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//axios response 拦截器
axios.interceptors.response.use(
    response => {
        // console.log(response)
        const data = response.data;
        //返回状态码处理
        switch (data.code) {
            case 200:
                return response
                break;
            case 100003:
                // Toast(data.message);
                break;
            case 600003:
                // Toast('请稍后刷新尝试');
                break;
            default:
                // Toast(data.message);
                return response
        }
    },
    error => {
        const { msg } = error.response.data
        Vue.prototype.$message.error(msg)
        //请求报错处理
        switch (error.response.status) {
            case 404:
                // router.push({ path: '/error/404' })
                break;
            case 509:
                console.log(509)
                break;
            default:
                return Promise.reject(error)
        }
    }
)

export default axios