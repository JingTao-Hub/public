// import globalConfig from 'global.config';
import * as React from 'react';
// import IframeResizer from 'iframe-resizer-react';
import { base64 } from "../../../utils/crypto";
import { LayoutSpin } from '../default';
import './style.less';
export class LayoutExternal extends React.Component<any, any> {
    ref = React.createRef<any>()
    state = {
        loding: true
    }
    /**
     * 发送消息
     */
    sendPostMessage() {
        return {
            type: "Portal_Token",
            // token: globalConfig.token.get(),
        }
    }
    componentDidMount() {
    }
    UNSAFE_componentWillMount() {
    }
    onLoad(e) {
        // 发送消息
        // e.target.contentWindow.postMessage(this.sendPostMessage(), decodeURIComponent(this.props.match.params.url));
        // console.log(decodeURIComponent(this.props.match.params.url), this.ref.current.contentWindow)
        this.setState({ loding: false })
    }
    render() {
        const src = base64.decrypt(this.props.match.params.url)//decodeURIComponent(this.props.match.params.url)
        console.warn("TCL: 解码地址", src)
        return (
            <div className={"app-external-iframe "}>
                <iframe
                    ref={this.ref}
                    key={src}
                    src={src}
                    onLoad={this.onLoad.bind(this)}
                >
                </iframe>
                {/* <IframeResizer
                    forwardRef={this.ref}
                    key={src}
                    src={src}
                    onLoad={this.onLoad.bind(this)} /> */}
                {this.state.loding ? <div className="app-external-iframe-Skeleton">
                    <LayoutSpin />
                </div> : null}
            </div>
        );
    }
}
export default LayoutExternal