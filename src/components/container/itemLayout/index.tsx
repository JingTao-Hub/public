/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2019-06-21 11:00:19
 * @modify date 2019-06-21 11:00:19
 * @desc [description]
 */
import { Col, Row } from 'antd';
import { BindAll } from 'lodash-decorators';
import { observer } from 'mobx-react';
import * as React from 'react';
import './style.scss';
export interface IItemLayoutProps {
    /** 列数  默认 3*/
    columnSpan?: number;
    className?: string;
    /** 列 */
    column: React.ReactNodeArray;
}
@BindAll()
// @observer
export class ItemLayout extends React.Component<IItemLayoutProps, {}> {
    renderColumn() {
        const { columnSpan = 4 } = this.props;
        const column = [...this.props.column];
        let span = 24 / columnSpan;
        return column.filter(Boolean).map((node: any, index) => {
            if (node.type === Col) {
                return <React.Fragment key={index}>
                    {node}
                </React.Fragment>
            }
            return <Col xl={span} lg={8} sm={12} xs={24} key={index}>
                {node}
            </Col>
        })
    }
    render() {
        return (
            <Row className={`demo-item-layout ${this.props.className}`} type="flex" gutter={60} align="top" >
                {this.renderColumn()}
                {this.props.children}
            </Row>
        );
    }
}

export default ItemLayout