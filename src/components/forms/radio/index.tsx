import { Col, Radio, Row } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';
import * as React from 'react';
import { DesLoadingData, ILoadingDataProps } from '../../../components/decorators';
@DesLoadingData()
export class DemoRadio extends React.Component<ILoadingDataProps & RadioGroupProps, any> {
    state = {
        spinning: false,
        dataSource: [],
    }
    render() {
        const { dataSource, ...props } = this.props;
        return (
            <Radio.Group {...props} >
                {this.renderItem(this.state.dataSource)}
            </Radio.Group>
        );
    }
    renderItem(dataSource) {
        if (this.props.renderItem) {
            return this.props.renderItem(dataSource)
        }
        return <Row type="flex" align="middle">
            {dataSource.map(data => {
                return <Col key={data.value}>
                    <Radio value={data.value}>{data.title}</Radio>
                </Col>
            })}
        </Row>
    }
}
export default DemoRadio