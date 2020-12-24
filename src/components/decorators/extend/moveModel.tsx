import ReactDOM from "react-dom";
import Hammer from 'hammerjs';
import React, { useState } from "react";
import { Modal } from 'antd';
import './style.scss';
import lodash from "lodash";
class MoveModal extends React.Component<{ render: () => JSX.Element }> {
    state = {
        style: { left: 0, top: 50 },
    }
    UNSAFE_componentWillReceiveProps(){
        this.setState( {
            style: { left: 0, top: 50 },
        })
    }
    render() {
        const node = this.props.render()
        return React.cloneElement(node, {
            // mask: lodash.get(node.props, 'mask', false),
            style: { ...node.props.style, ...this.state.style },
            wrapClassName: 'demo-model-move ' + node.props.wrapClassName,
            title: <DndTitle styleState={this.state.style} onUpdate={style => {
                this.setState({ style })
            }}>
                {node.props.title}
            </DndTitle>
        })
    }
}

/**
 *扩展 Model 可移动
 *
 * @export
 * @param {JSX.Element} node
 * @param {*} [options]
 * @returns {React.ReactNode}
 */
export function DemoMoveModel(node: JSX.Element, options?): React.ReactNode {
    try {
        if (node.type === Modal) {
            return <MoveModal render={() => node} />
        }
        throw 'Node is Not Modal '
    } catch (error) {
        console.error("TCL: error", error)
        return node
    }
}

class DndTitle extends React.Component<{ styleState: { left: number, top: number }, onUpdate?: (style: any) => void }, any> {
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
            <div className="demo-model-move-title" ref={this.div}>
                {this.props.children}
            </div>
        );
    }
}