import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import lodash from 'lodash';
import * as React from 'react';
import { DesLoadingData, ILoadingDataProps } from '../../../components/decorators';
@DesLoadingData()
export class DemoSelect extends React.Component<ILoadingDataProps & SelectProps<any>, any> {
	// constructor(props) {
	//     super(props)
	//     console.log('constructor')
	// }
	state = {
		spinning: false,
		dataSource: []
	};
	render() {
		const { dataSource, ...props } = this.props;
		return (
			<Select
				placeholder="Please choose"
				showSearch
				filterOption={(input, option: any) => {
					return lodash.includes(lodash.toLower(option.props.children), lodash.toLower(input));
				}}
				{...props}
			>
				{this.renderItem(this.state.dataSource)}
			</Select>
		);
	}
	renderItem(dataSource) {
		if (this.props.renderItem) {
			return this.props.renderItem(dataSource);
		}
		return dataSource.map((x) => {
			return (
				<Select.Option key={x.key} value={x.key}>
					{x.title}
				</Select.Option>
			);
		});
	}
}
export default DemoSelect;
