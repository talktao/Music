import service from '@/axios'

export const dailySignin = data=>{
    return service({
        url: 'daily_signin',
        method: 'get',
        params: data
    })
}