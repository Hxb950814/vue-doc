
/* 获得今天的某个时间 */
export function getTodayTimeStamp(h:number, m: number, s:number) {
    const now = new Date();
    return +new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${h}:${m}:${s}`);
}
