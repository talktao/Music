import service from '@/axios'

//获取用户信息
export const getUserDetail = data => {
    return service({
        url: '/user/detail',
        method: 'get',
        params: data
    })
}

//获取用户歌单
export const getPlaylist = data => {
    return service({
        url: '/user/playlist?uid='+data.uid,
        method: 'get'
    })
}

//获取收藏、歌单等数量
export const getSubcount = data => {
    return service({
        url: '/user/subcount',
        method: 'get',
        data
    })
}