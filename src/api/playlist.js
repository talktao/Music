import service from '@/axios'
 
//获取歌单详情
export const getPlaylistDetail = data => {
    return service({
        url: '/playlist/detail',
        method: 'get',
        params: data
    })
}