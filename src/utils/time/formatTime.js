//把秒转成mm:ss
export const formatSE = (time) => {
    if (time >= 600) {
        // console.log('time>600')
        if(time % 60 >= 10){
            return parseInt(time / 600).toString() +
                parseInt((time % 600) / 60).toString() +
                ":" +
                (time % 60).toString().substr(0, 2);
        }else{
            return parseInt(time / 600).toString() +
                parseInt((time % 600) / 60).toString() +
                ":0" +
                (time % 60).toString().substr(0, 1);
        }
    } else if (time < 600 && time >= 60) {
        // console.log('60<=time<600')
        if(time % 60 >= 10){
            return "0" +
                parseInt(time / 60).toString() +
                ":" +
                (time % 60).toString().substr(0, 2);
        }else{
            return "0" +
                parseInt(time / 60).toString() +
                ":0" +
                (time % 60).toString().substr(0, 1);
        }
    } else if (time < 60 && time >= 10) {
        // console.log('10<=time<60')
        return "00:" + time.toString().substr(0, 2);
    } else if (time < 10) {
        // console.log('time<60')
        return "00:0" + time.toString().substr(0, 1);
    }
}
//把mm:ss转成秒
export const getSconds = (time) => {
    let mySplit = time.split(':')
    if (mySplit.length == 2 && mySplit[0].length == 2 && mySplit[1].length == 2) {
        return Number(mySplit[0]) * 60 + Number(mySplit[1])
    } else {
        console.error('传入格式错误')
        return null
    }
}