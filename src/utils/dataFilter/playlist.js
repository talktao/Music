import { formatSE } from "@/utils/time/formatTime.js";
export const formatPlayListDetail = (data) => {
    try {
        let nowId = 0;
        if (localStorage.getItem("nowPlaying")) {
            nowId = JSON.parse(localStorage.getItem("nowPlaying")).id;
        }
        let backData = [];
        data.forEach((item, index) => {
            backData[index] = {
                id: item.id,
                coverImgUrl: item.al.picUrl,
                title: item.name,
                length: formatSE(Number(item.dt) / 1000),
                album: item.al.name,
                author: "",
                active: false
            };
            var tempAuthors = [];
            item.ar.forEach((item1, index1) => {
                tempAuthors.push(item1.name);
            });
            backData[index].author = tempAuthors.join("、");
            if (item.id == nowId) {
                backData[index].active = true;
            }
        });
        return backData
    } catch (err) {
        console.error(err)
    }
}