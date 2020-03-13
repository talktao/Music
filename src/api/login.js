import service from '@/axios'

//获取登录状态
export const getLoginStatus = data => {
    return service({
        url: '/login/status?timestamp='+new Date().getTime(),
        method: 'get'
    })
}

//刷新登录状态
export const refreshLogin = data => {
    return service({
        url: '/login/refresh?timestamp='+new Date().getTime(),
        method: 'get',
        data
    })
}

//手机号登录
//可选参数countrycode
export const loginByPhoneNumber = data => {
    return service({
        url: '/login/cellphone?timestamp='+new Date().getTime(),
        method: 'post',
        data
    })
}

//退出登录
export const logout = data => {
    return service({
        url: '/logout?timestamp='+new Date().getTime(),
        method: 'post',
        data
    })
}