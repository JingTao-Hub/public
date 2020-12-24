/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2019-02-24 17:06:55
 * @modify date 2019-02-24 17:06:55
 * @desc [description]
 */
import lodash from "lodash";
import * as React from 'react';
import Exception from "../../../other/Exception";
import { message } from "antd";
const development = process.env.NODE_ENV === "development"
interface IPageAuthenticationOptions {
    /**
     * 页面状态
     */
    PageStore?: any;
    /**
     * 自定义 认证通道
     */
    onPassageway?: (props: any) => boolean;
}
/**
 * 认证装饰器
 * @param options 
 */
export function PageAuthentication(options: IPageAuthenticationOptions = {}) {
    options.onPassageway = options.onPassageway || onPassageway;
    return function <T extends { new(...args: any[]): React.Component<any, any> }>(constructor: T) {
        return class PageAuthentication extends constructor {
            state = {
                ...this['state'],
                __error: null,
                __errorInfo: null
            };
            componentDidCatch(error, info) {
                this.setState({
                    __error: error,
                    __errorInfo: info
                });
                development && message.error("页面组件错误，查看控制台信息  dev 环境提示")
            }
            render() {
                // 组件错误
                if (this.state.errorInfo) {
                    return (
                        <div>
                            <h2>组件出错~</h2>
                            <details >
                                <pre style={{ height: 300, background: "#f3f3f3" }}>
                                    <code>{lodash.toString(this.state.__error)}</code>
                                    <code>{lodash.get(this.state, '__errorInfo.componentStack')}</code>
                                </pre>
                            </details>
                        </div>
                    );
                }
                // 认证 页面 
                if (options.onPassageway(this.props)) {
                    return super.render()
                }
                return <Exception type="404" desc={<h3>无法匹配 <code>{this.props.location.pathname}</code></h3>} />
            }
        }
    }
}
/**
 * 认证 动作
 * @param options 
 */
export function PageAuthAction(options: IPageAuthenticationOptions = {}): boolean {
    return true
    // options.onPassageway = options.onPassageway || onPassageway;
    // return function <T extends { new(...args: any[]): React.Component<any, any> }>(constructor: T) {
    //     return class PageAuthentication extends constructor {
    //         render() {
    //             // 认证 页面 
    //             if (options.onPassageway(this.props)) {
    //                 return super.render();
    //             }
    //             return <Exception type="404" desc={<h3>无法匹配 <code>{this.props.location.pathname}</code></h3>} />
    //         }
    //     }
    // }
}
function onPassageway(props) {
    console.warn("TCL: 认证页面 " + props.location.pathname, props)
    return true;
}