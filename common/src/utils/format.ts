import {formatTime} from './time';

export { formatTime };

export function formatPhone(phone: string, formatType = 1) {
    return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
}
