export const Help = {
    GUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
     /**
     * 获取URL中的参数
     * @param 参数名 
     * @param URL查询部分
     */
    getQueryString(name,search=window.location.search)
    {
        if(!search)return null;
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    },
    /**
     * 获取跳转登录后的参数
     * @param 参数名 
     */
    ParamByJump(name){
        const params=this.getQueryString('params');
        if(params)return this.getQueryString(name,'?'+params.replace(/--/g,'=').replace(/__/g,'&'));
        else return this.getQueryString(name);
    }
}