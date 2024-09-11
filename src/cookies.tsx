import { Word } from "./App";

export const setCookie = (name: string, value: Word) => {
    const values = Object.entries(value).toString();
    const words = getAllWords();
    if (!words.includes(name)) {
        document.cookie = `${name}=${values}`;
    } else {
        return 'This word already added.'
    }
}

export const getCookie = (name: string) => {
    const value = !document.cookie.split(";").find(c => c.includes(name));
    return value;
}

export const getAllWords = () => {
    const cookieArr = document.cookie.split(';');
    const wordsList = cookieArr.map(cookie => {
        const indx = cookie.indexOf('=');
        return cookie.substring(0,indx);
    })
    return wordsList;
}