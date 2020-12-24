
import { Drawer, Form, Icon, Select, Popconfirm, Popover, Switch } from 'antd';
import { BindAll } from 'lodash-decorators';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { DesForm } from '../../../../components/decorators';
import Store from '../store';

@observer
@DesForm
@BindAll()
export default class SetUp extends React.Component<any, any> {
    state = {
        visible: false
    }
    handleSubmit() {

    }
    onClose() {
        this.setState({ visible: false })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <>
                <Popover
                    title="Switch menu position"
                    placement="bottom"
                    content={
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item
                                label="position"
                            >
                                <Switch checkedChildren="left" unCheckedChildren="top" defaultChecked={Store.menuMode === "inline"} onChange={event => {
                                    runInAction(() => {
                                        Store.menuMode = event ? "inline" : "horizontal"
                                    });
                                }} />
                            </Form.Item>
                        </Form>
                    }
                >
                    <a href="javascript:void(0)" onClick={() => { this.setState({ visible: true }) }}>
                        <Icon type="setting" theme="outlined" />
                    </a>
                </Popover>

                {/* <Drawer
                    title="全局设置"
                    placement="right"
                    width={350}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="菜单位置"
                        >
                            {getFieldDecorator('menuMode', {
                                rules: [],
                                initialValue: Store.menuMode
                                // "horizontal" | "inline"
                            })(
                                <Select style={{ width: '100%' }} onChange={(event: any) => {
                                    runInAction(() => {
                                        Store.menuMode = event
                                    });
                                    Store.onCollapsed(true);
                                    // dispatchEvent(new CustomEvent('resize'));
                                }}>
                                    <Select.Option value="horizontal">上</Select.Option>
                                    <Select.Option value="inline">左</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Drawer> */}
            </>
        );
    }
}
