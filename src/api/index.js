import axios from 'axios'

//axios.defaults.timeoutErrorMessage = '系統超時異常，請按重新整理'
export const instance = axios.create({
    baseURL: "https://localhost:5000/api",
    timeout: 60 * 5 * 1000,
    timeoutErrorMessage: '系統超時異常，請按重新整理'
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

// 返回狀態判斷(添加回應攔截器)
instance.interceptors.response.use(res => {
    // 對回應資料做些事
    return res
}, error => {
    if (error.toString().indexOf('timeout') > -1) {
        alert("系統異常，請按重新整理")
    }
    if (error.response) {
        switch (error.response.status) {
            case 400:
                break
            case 401:
                break
            case 403:
                break
            case 404:
                break
            case 500:
                break
            default:
        }
    }
    // axios 配置裡必須要 return Promise.reject(error.response.data) 才能拿到錯誤欄位
    return Promise.reject(error.response.data)
})
export default instance