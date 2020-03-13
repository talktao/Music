import service from '@/axios'

//电台的订阅列表
export const getSublist = data => {
    return service({
        url: '/dj/sublist',
        method: 'get',
        data
    })
}