import * as React from 'react';
import code from './code';
import './style.scss'
export default class IApp extends React.Component<{
    onSuccess?: () => void;
    [key: string]: any;
}, any> {
    element = React.createRef<HTMLDivElement>()
    componentDidMount() {
        new code({
            el: this.element.current,
            onSuccess: () => {
                this.props.onSuccess && this.props.onSuccess();
                this.props.onChange && this.props.onChange(true);
            },
            onFail: () => {
                this.props.onChange && this.props.onChange(undefined);
            },
            onRefresh: () => {
                this.props.onChange && this.props.onChange(undefined);
            },
        }).init()
    }
    render() {
        return (
            <div className='img-code'>
                <div ref={this.element}></div>
            </div>
        );
    }
}
