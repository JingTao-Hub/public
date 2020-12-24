/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2019-06-21 11:00:19
 * @modify date 2019-06-21 11:00:19
 * @desc [description]
 */
import { Col, Icon, Row } from 'antd';
import { BindAll } from 'lodash-decorators';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import lodash from 'lodash';
import { IItemLayoutProps, ItemLayout } from '../itemLayout';

import './style.scss';
export interface ICollapseProps extends IItemLayoutProps {
    /** 显示 行 数 默认 2 */
    rowSpan?: number;
    // 展开状态
    expand?: boolean;
}
@BindAll()
@observer
export class Collapse extends React.Component<ICollapseProps, {}> {
    // 扩大展开状态
    @observable expand = true;
    @action
    onToggle() {
        this.expand = !this.expand;
        lodash.delay(() => {
            dispatchEvent(new CustomEvent('resize'));
        }, 100);
    }
    @action
    componentDidMount() {
        // this.onToggle();
        this.expand = lodash.get(this.props, 'expand', false);
    }
    renderColumn() {
        const { columnSpan = 4, rowSpan = 2 } = this.props;
        const column = [...this.props.column];
        let row = rowSpan * columnSpan;
        if (!this.expand) {
            column.length = row;
        }
        return column.filter(Boolean)
    }
    render() {
        const { columnSpan = 4 } = this.props;
        const column = this.renderColumn();
        const length = column.length;
        // 需要折叠
        const isExpand = length > columnSpan;
        const isCollapse = this.props.column.length > columnSpan;
        let span = 24;
        if (!isExpand && length !== columnSpan) {
            span = 24 / columnSpan;
            span *= columnSpan - length;
        }
        return (
            <ItemLayout
                className='demo-collapse'
                columnSpan={this.props.columnSpan}
                column={column}
            >
                <Col xl={span} lg={24} sm={24} xs={24} className='demo-collapse-btns'>
                    {this.props.children}
                    {isCollapse && <a className='demo-collapse-btn-expand' onClick={this.onToggle}>
                        Collapse <Icon type={this.expand ? 'up' : 'down'} />
                    </a>}
                </Col>
            </ItemLayout>
        );
    }
}

export default Collapse