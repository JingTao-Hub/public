/**
* 正则列表
* https://www.cnblogs.com/zxin/archive/2013/01/26/2877765.html
*/
export const Regulars = {
    /** 手机号 */
    mobilePhone: /0?(13|14|15|17|18|19)[0-9]{9}/,
    /** 电话 */
    telephone: /[0-9-()（）]{7,18}/,
    /** 邮箱 */
    email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
    /** 身份证 */
    cardID: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    /** 网址 url */
    url: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
    /** HTML */
    isHtml: /<(S*?)[^>]*>.*?|<.*? \/>/,
    /** 数字 */
    number: {
        /** 数字  */
        ordinary: /^[0-9]*$/,
        /** 正数 */
        just: /[1-9]\d*/,
        /** 负数 */
        negative: /-[1-9]\d*/
    }
}
export default Regulars