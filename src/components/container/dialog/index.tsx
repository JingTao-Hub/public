import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { ModalProps } from 'antd/lib/modal';
import Hammer from 'hammerjs';
import { BindAll, Debounce } from 'lodash-decorators';
import lodash from 'lodash';
import * as React from 'react';
import { Help } from '../../../utils/helps';
import './style.scss';
export interface IDialogProps extends ModalProps {
    /** 按钮名称 */
    buttonText?: string;
    buttonProps?: ButtonProps;
    onOk?: (e: React.MouseEvent<any>, onClose?: () => void) => void;
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
    onCancel?: (e: React.MouseEvent<any>, onClose?: () => void) => void;
}
@BindAll()
export class Dialog extends React.Component<IDialogProps, any> {
    state = {
        style: {},
        //显示
        visible: false,
        //初始化装载  按钮 第一次 点击 显示 为 已装载 优化性能
        load: false,
    }
    onCancel(MouseEvent) {
        const { onCancel, onOk } = this.props;
        if (lodash.isFunction(onCancel)) {
            return onCancel(MouseEvent, () => {
                this.onVisible(false);
            })
        }
        this.onVisible(false);
    }
    onOk(MouseEvent) {
        const { onCancel, onOk } = this.props;
        if (lodash.isFunction(onOk)) {
            return onOk(MouseEvent, () => {
                this.onVisible(false);
            })
        }
    }
    key = Help.GUID();
    @Debounce(100)
    onVisible(visible = !this.state.visible) {
        this.setState(state => {
            state.visible = visible;
            if (!state.load) {
                state.load = true;
            }
            return { ...state }
        })
    }
    render() {
        const { buttonText='按钮', buttonProps, ...props } = this.props;
        return (
            <React.Fragment key={this.key}>
                <Button
                    {...buttonProps}
                    onClick={this.onVisible.bind(this, true)}>
                    {buttonText}
                </Button>
                <Modal
                    maskClosable={false}
                    destroyOnClose
                    {...props}
                    visible={lodash.get(props, 'visible', this.state.visible)}
                    style={{ ...this.state.style, ...props.style }}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    title={
                        <DndTitle styleState={this.state.style as any} onUpdate={style => this.setState({ style })}>
                            {this.props.title}
                        </DndTitle>
                    }
                    wrapClassName="demo-dialog"
                >
                    {this.props.children}
                </Modal>
            </React.Fragment>
        );
    }
}
/**
 * 拖拽标题
 */
 class DndTitle extends React.Component<{ styleState: { left: number, top: number }, onUpdate?: (style: React.CSSProperties) => void }, any> {
    deltaX = 0;
    deltaY = 0;
    panstart = false;
    div = React.createRef<any>();
    onUpdate(x, y) {
        this.props.onUpdate({
            // transform: `translate(${x}px,${y}px)`
            left: x,
            top: y
        })
    }
    hammer;
    componentDidMount() {
        const hammer = this.hammer = new Hammer(this.div.current)
        hammer.on('panstart', (event) => {
            if (this.props.styleState.left && this.props.styleState.top) {
                this.deltaX = this.props.styleState.left;
                this.deltaY = this.props.styleState.top;
            }
            this.panstart = true;
        });
        hammer.on('panmove', (event) => {
            this.onUpdate(event.deltaX + this.deltaX, event.deltaY + this.deltaY)
        });
        hammer.on('panend', (event) => {
            this.panstart = false
        });
    }
    componentWillUnmount() {
        this.hammer && this.hammer.destroy()
    }
    shouldComponentUpdate() {
        return !this.panstart
    }
    render() {
        return (
            <div className="demo-dialog-dnd-title" ref={this.div}>
                {this.props.children}
            </div>
        );
    }
}
export default Dialog;