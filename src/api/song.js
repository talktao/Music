import service from '@/axios'
 
//获取歌单详情
export const getMusicUrlById = data => {
    return service({
        url: '/song/url?timestamp='+new Date().getTime(),
        method: 'get',
        params: data
    })
}