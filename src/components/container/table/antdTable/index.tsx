/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2019-06-26 16:55:28
 * @modify date 2019-06-26 16:55:28
 * @desc [description]
 */
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import * as React from 'react';
import { Action, IActionProps } from '../action';
export class AntdTable extends React.Component<TableProps<any> & IActionProps, any> {
    /**
     * 全屏 容器
     */
    refFullscreen = React.createRef<HTMLDivElement>();
    render() {
        let {
            actions,
            dropdown,
            ...props
        } = this.props;
        return (
            <div className='demo-collapse-refFullscreen' ref={this.refFullscreen}>
                <Action actions={actions} dropdown={dropdown} fullscreenBody={() => this.refFullscreen} />
                <Table {...props} />
            </div>
        );
    }
}
export default AntdTable