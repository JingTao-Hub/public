import * as React from 'react';
import { Dialog } from 'components/container';
import { DesForm } from 'components/decorators';
import { Form, Input, Icon, Select } from 'antd';

export interface IAppProps {
}

export default class App extends React.Component<IAppProps, any> {
    public render() {
        return (
            <div>
                <Dialog
                    title="测试弹框"
                    buttonText="测试按钮"
                    onOk={(e, onClose) => {
                        console.log("TCL: App -> render -> e", e)
                        onClose()
                    }}
                >
                    <div>
                        哈哈哈哈哈哈哈
                     </div>
                </Dialog>
                <Dialog
                    title="测试弹框"
                    buttonText="测试按钮"
                    buttonProps={{
                        type: "link"
                    }}
                    onOk={(e, onClose) => {
                        console.log("TCL: App -> render -> e", e)
                        setTimeout(() => {
                            onClose()
                        }, 1000)
                    }}
                >
                </Dialog>
                <TestFrom />
            </div>
        );
    }
}
@DesForm
class TestFrom extends React.Component<any, any> {
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };
    handleReset = () => {
        this.props.form.resetFields();
    };
    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Dialog
                title="测试弹框"
                buttonText="Form"
                buttonProps={{
                    type: "link"
                }}
                onOk={(e, onClose) => {
                    this.handleSearch(e)
                }}
            >
                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} >
                    <Form.Item label="Note">
                        {getFieldDecorator('note', {
                            rules: [{ required: true, message: 'Please input your note!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Gender">
                        {getFieldDecorator('gender', {
                            rules: [{ required: true, message: 'Please select your gender!' }],
                        })(
                            <Select
                                placeholder="Select a option and change input text above"
                            >
                                <Select.Option value="male">male</Select.Option>
                                <Select.Option value="female">female</Select.Option>
                            </Select>,
                        )}
                    </Form.Item>
                </Form>
            </Dialog>
        );
    }
}
