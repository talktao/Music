import service from '@/axios'

//获取每日推荐歌单
export const getRecommendResource = data => {
    return service({
        url: '/recommend/resource',
        method: 'get',
        data
    })
}

//获取每日推荐歌曲
export const getRecommendSongs = data => {
    return service({
        url: '/recommend/songs',
        method: 'get',
        data
    })
}