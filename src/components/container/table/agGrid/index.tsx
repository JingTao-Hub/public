/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2019-06-26 16:55:28
 * @modify date 2019-06-26 16:55:28
 * @desc [description]
 */
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { PaginationProps } from 'antd/lib/pagination';
import * as React from 'react';
import { Action, IActionProps } from '../action';
import { AgGridReactProps } from 'ag-grid-react/lib/agGridReact';
const Table = React.lazy(() => import('./grid'));
// 设置企业 key
type onUpdateHeight = (height: number) => number;
interface ITableProps extends AgGridReactProps {
    /**
     * 容器样式
     */
    style?: React.CSSProperties;
    /**
     * 主题 
     */
    theme?: 'ag-theme-balham' | 'ag-theme-material';
    /**
     * 样式
     */
    className?: string;
    /**
     * 分页
     */
    paginationProps?: PaginationProps | boolean;
    /**
     * 加载中
     */
    loading?: boolean;
    /**
     * 选择
     */
    checkboxSelection?: boolean;
    /**
     * 高度 更改 事件
     */
    onUpdateHeight?: onUpdateHeight | boolean;
    rowAction?: React.ReactNode;
    rowActionProps?: ColGroupDef | ColDef;
    [key: string]: any;
}
export type IAgGridProps = ITableProps & IActionProps;
export class AgGrid extends React.Component<IAgGridProps, any> {
    /**
     * 全屏 容器
     */
    refFullscreen = React.createRef<HTMLDivElement>();
    render() {
        let {
            actions,
            dropdown,
            actionsHide,
            actionsRight,
            ...props
        } = this.props;
        return (
            <React.Suspense fallback={<div></div>}>
                <div className='demo-collapse-refFullscreen' ref={this.refFullscreen}>
                    <Action
                        actions={actions}
                        actionsRight={actionsRight}
                        actionsHide={actionsHide}
                        dropdown={dropdown}
                        fullscreenBody={() => this.refFullscreen} />
                    <Table {...props} />
                </div>
            </React.Suspense>
        );
    }
}

export default AgGrid