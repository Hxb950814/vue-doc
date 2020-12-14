/* 校验函数 */

/* 是否是整数数字（前面可以包含0） */
export function isInteger(value: string | number): boolean {
    // eslint-disable-next-line
    return /^[0-9]+$/.test(String(value));
}

export function isMobile(value: string): boolean {
    // eslint-disable-next-line
    return /^[1][2,3,4,5,6,7,8,9,0][0-9]{9}$/.test(value);
}

/* 是否是身份证号 */
export function isIdNumber(value: string): boolean {
    // eslint-disable-next-line
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}

/* 是否是邮箱 */
export function isEmail(value: string): boolean {
    // eslint-disable-next-line
    return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value);
}

/* 是否是URL */
export function isURL(value: string): boolean {
    // eslint-disable-next-line
    return /^http(s)?:\/\//.test(value);
}
