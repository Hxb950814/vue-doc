/* 时间操作 */
export function formatTime(time: string | Date, fmt: string) {
    const timeIn = new Date(time);
    const o:any = {
        'M+': timeIn.getMonth() + 1, // 月份
        'd+': timeIn.getDate(), // 日
        'h+': timeIn.getHours(), // 小时
        'm+': timeIn.getMinutes(), // 分
        's+': timeIn.getSeconds(), // 秒
        'q+': Math.floor((timeIn.getMonth() + 3) / 3), // 季度
        S: timeIn.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (timeIn.getFullYear() + '').substr(4 - RegExp.$1.length)); }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
    }

    return fmt;
}

/*
    获得今天的某个时间
    h：时
    m：分
    s：秒
* */
export function getTodayTimeStamp(h:number, m: number, s:number) {
    const now = new Date();
    return +new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${h}:${m}:${s}`);
}
