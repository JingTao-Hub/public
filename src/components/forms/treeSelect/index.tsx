import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select';
import lodash from 'lodash';
import * as React from 'react';
import { DesLoadingData, ILoadingDataProps } from '../../../components/decorators';
import './style.scss';
@DesLoadingData(
    { title: 'title' }
)
export class DemoTreeSelect extends React.Component<ILoadingDataProps & TreeSelectProps<any>, any> {
    state = {
        spinning: false,
        dataSource: [],
    }
    render() {
        const config = {};
        const { dataSource, ...selectProps } = this.props;
        return (
            <TreeSelect
                placeholder="Please choose"
                showSearch
                filterTreeNode={(input, option: any) => {
                    return lodash.includes(lodash.toLower(option.props.title), lodash.toLower(input))
                }}
                treeData={this.state.dataSource}
                {...selectProps}
                {...config}
            >
                {this.props.children}
            </TreeSelect>
        );
    }
}
export default DemoTreeSelect