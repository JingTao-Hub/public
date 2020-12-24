/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2018-09-12 18:52:37
 * @modify date 2018-09-12 18:52:37
 * @desc [description]
*/
import lodash from 'lodash';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Observable, of, TimeoutError } from "rxjs";
import { ajax, AjaxError, AjaxResponse, AjaxRequest } from "rxjs/ajax";
import { catchError, filter, map, timeout } from "rxjs/operators";
import { notification } from 'antd';
const development = process.env.NODE_ENV === "development"
/** 缓存 Request 请求 */
const CacheRequest = new Map<string, Promise<any>>();
/** 缓存数据 */
const Cache = new Map<string, any>();
export class Request {
    /**
     * 
     * @param target 
     */
    constructor(
        public target = "/"
    ) { }
    /**
     * 请求超时设置 默认 60 秒
     */
    static timeout = 60000;
    /**
     * ajax Observable 管道
     * @param Observable 
     */
    protected AjaxObservable(Obs: Observable<AjaxResponse>) {
        return new Observable<any>(sub => {
            // 加载进度条
            Request.NProgress();
            Obs.pipe(
                // 超时时间
                timeout(Request.timeout),
                // 错误处理
                catchError((err) => of(err)),
                // 过滤请求
                filter((ajax) => {
                    Request.NProgress("done");
                    try {
                        // 数据 Response                        
                        if (ajax instanceof AjaxResponse) {
                            // 无 响应 数据
                            if (lodash.isNil(ajax.response)) {
                                // console.warn('响应体为 NULL', ajax)
                                throw ajax
                            }
                            if (!lodash.eq(200, lodash.get(ajax, 'response.code', 0))) {
                                console.warn('响应 code 不为 200', ajax)
                                throw ajax
                            }
                        }
                        // 错误
                        if (ajax instanceof AjaxError || ajax instanceof TimeoutError) {
                            console.warn(ajax.message, ajax)
                            throw ajax
                        }
                        return true
                    } catch (error) {
                        const url = lodash.get(error, 'request.url', '')
                        notification.error({
                            top: 61,
                            description: `${lodash.get(error, 'response.msg', lodash.get(error, 'message', '响应体为 NULL'))}`,
                            // description: `status ${lodash.get(error, 'response.code', lodash.get(error, 'status', ''))} ${lodash.get(error, 'response.msg', lodash.get(error, 'message', '响应体为 NULL'))}`,
                            message: development && `dev 显示 Url：${url} `,
                            key: url,
                        })
                        sub.error(error);
                        return false
                    }
                }),
                // 数据过滤
                map(this.responseMap.bind(this))
            ).subscribe(obs => {
                sub.next(obs)
                sub.complete()
            })
        })
    }
    /**
     * 请求 map 转换
     * @param res 
     */
    responseMap(res: AjaxResponse) {
        switch (res.status) {
            case 200:
                return lodash.get(res, 'response.data');
            default:
                return undefined
                break;
        }
    }
    static Headers: any = {
        'credentials': 'include',
        'accept': "*/*",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "token": null
    }
    /**
     * 返回请求头
     */
    getHeaders() {
        return Request.Headers
    }
    /**
     * url 参数 注入
     * @param url 
     * @param body 
     */
    static parameterTemplate(url, body) {
        try {
            if (lodash.isObject(body) && /{([\s\S]+?)}/g.test(url)) {
                url = lodash.template(url, { interpolate: /{([\s\S]+?)}/g })(body);
            }
        } catch (error) { }
        return url
    }
    /**
     *  请求数据 缓存数据
     * @param params 
     */
    async cache(urlOrRequest: string | AjaxRequest) {
        const key = lodash.isString(urlOrRequest) ? urlOrRequest : `${urlOrRequest.url}_${JSON.stringify(urlOrRequest.body)}`;
        if (Cache.has(key)) {
            return Cache.get(key);
        }
        let ajaxObservable: Promise<any>;
        // 读缓存
        if (CacheRequest.has(key)) {
            ajaxObservable = CacheRequest.get(key);
        } else {
            // 设缓存
            ajaxObservable = this.ajax(urlOrRequest).toPromise();
            CacheRequest.set(key, ajaxObservable);
        }
        const data = await ajaxObservable;
        Cache.set(key, data);
        return data;
    }
    /**
     * ajax
     * @param urlOrRequest 
     */
    ajax(urlOrRequest: string | AjaxRequest) {
        if (lodash.isString(urlOrRequest)) {
            const ajaxRequest: AjaxRequest = {
                url: urlOrRequest,
                headers: this.getHeaders()
            }
            urlOrRequest = ajaxRequest;
        } else {
            const url = Request.parameterTemplate(urlOrRequest.url, urlOrRequest.body);
            urlOrRequest.headers = { ...this.getHeaders(), ...urlOrRequest.headers };
            // GET, POST, PUT, PATCH, DELETE
            switch (lodash.toUpper(urlOrRequest.method)) {
                case 'POST':
                case 'PUT':
                    urlOrRequest.body = Request.formatBody(urlOrRequest.body, "body", urlOrRequest.headers);
                    urlOrRequest.url = Request.compatibleUrl(this.target, url);
                    break;
                default:
                    urlOrRequest.url = Request.compatibleUrl(this.target, url, Request.formatBody(urlOrRequest.body));
                    break;
            }
        }
        return this.AjaxObservable(ajax(urlOrRequest))
    }
    /**
     * url 兼容处理 
     * @param address 前缀
     * @param url url
     * @param endStr 结尾，参数等
     */
    static compatibleUrl(address: string, url: string, endStr?: string) {
        endStr = endStr || ''
        if (/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(url)) {
            return `${url}${endStr}`;
        }
        else {
            // address  / 结尾  url / 开头
            const isAddressWith = lodash.endsWith(address, "/")
            const isUrlWith = lodash.startsWith(url, "/")
            // debugger
            if (isAddressWith) {
                if (isUrlWith) {
                    url = lodash.trimStart(url, "/")
                }
            } else {
                if (isUrlWith) {

                } else {
                    url = "/" + url;
                }
            }
        }
        return `${address}${url}${endStr}`
    }
    /**
     * 格式化 参数
     * @param body  参数 
     * @param type  参数传递类型
     * @param headers 请求头 type = body 使用
     */
    static formatBody(
        body?: { [key: string]: any } | any[] | string,
        type: "url" | "body" = "url",
        headers: Object = {}
    ): any {

        if (type === "url") {
            let param = "";
            if (typeof body != 'string') {
                let parlist: any[] = [];
                lodash.forEach(body, (value, key) => {
                    if (!lodash.isNil(value) && value != "") {
                        parlist.push(`${key}=${value}`);
                    }
                });
                if (parlist.length) {
                    param = "?" + parlist.join("&");
                }
            } else {
                param = body;
            }
            return param;
        } else {
            // 处理 Content-Type body 类型 
            switch (headers["Content-Type"]) {
                case 'application/json;charset=UTF-8':
                    body = JSON.stringify(body)
                    break;
                case 'application/json':
                    if (lodash.isArray(body)) {
                        body = [...body]
                    }
                    if (lodash.isPlainObject(body)) {
                        body = { ...body as any }
                    }
                    break;
                case 'application/x-www-form-urlencoded':

                    break;
                case 'form-data':
                case 'multipart/form-data':
                    delete headers["Content-Type"];
                    const formData = new FormData();
                    if (lodash.isObject(body)) {
                        lodash.mapKeys(body, (value: any, key) => {
                            formData.append(key, value)
                        })
                    }
                    body = formData;
                    break;
                case null:
                    delete headers["Content-Type"];
                    break;
                default:
                    break;
            }
            return body;
        }
    }
    /** 日志 */
    // protected log(url, body, headers) {

    // }
    /**
     *  加载进度条
     * @param type 
     */
    static NProgress(type: 'start' | 'done' = 'start') {
        if (type == "start") {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }
}
export default new Request();
