import service from '@/axios'
 
export const getBanner = data => {
    return service({
        url: '/banner',
        method: 'get',
        data
    })
}