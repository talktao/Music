import { getUserDetail } from "@/api/user";
export const saveUserDetail = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (localStorage.loginSuccessInfo) {
                const uid = JSON.parse(localStorage.loginSuccessInfo).account.id;
                const userDetail = await getUserDetail({ uid });
                localStorage.userDetail = JSON.stringify(userDetail.data);
                resolve(userDetail.data)
            }else{
                reject()
            }
        } catch (err) {
            reject(err)
            return
        }
    })
}