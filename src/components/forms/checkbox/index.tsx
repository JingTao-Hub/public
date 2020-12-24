import { Checkbox, Col, Row } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import * as React from 'react';
import { DesLoadingData, ILoadingDataProps } from '../../../components/decorators';
@DesLoadingData()
export class DemoCheckbox extends React.Component<ILoadingDataProps & CheckboxGroupProps, any> {
    state = {
        spinning: false,
        dataSource: [],
    }
    render() {
        const { dataSource, ...props } = this.props;
        return (
            <Checkbox.Group style={{ width: '100%' }} {...props}>
                {this.renderItem(this.state.dataSource)}
            </Checkbox.Group>
        );
    }
    renderItem(dataSource) {
        if (this.props.renderItem) {
            return this.props.renderItem(dataSource)
        }
        return <Row type="flex" align="middle">
            {dataSource.map(data => {
                return <Col key={data.value}>
                    <Checkbox value={data.value}>{data.title}</Checkbox>
                </Col>
            })}
        </Row>
    }
}
export default DemoCheckbox