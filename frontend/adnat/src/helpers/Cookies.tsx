export default class Cookies {

    static getCookieValue (name: string) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
    }

    static deleteCookie (name: string) {
        document.cookie = `${name}=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    }
};