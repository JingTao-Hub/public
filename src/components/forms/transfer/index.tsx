import { Transfer } from 'antd';
import { TransferProps } from 'antd/lib/transfer';
import * as React from 'react';
import { DesLoadingData, ILoadingDataProps } from '../../../components/decorators';
@DesLoadingData()
export class DemoTransfer extends React.Component<ILoadingDataProps & TransferProps & { value?: any }, any> {
    state = {
        spinning: false,
        dataSource: [],
    }
    render() {
        const { dataSource, ...props } = this.props;
        return (
            <Transfer
                render={item => item.title}
                {...props}
                dataSource={this.state.dataSource}
                targetKeys={props.value}
            />
        );
    }
}
export default DemoTransfer