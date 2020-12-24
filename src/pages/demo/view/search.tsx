import * as React from 'react';
import { Table, Divider, Tag, Form, Row, Col, Button, Icon, Input, Alert } from 'antd';
import { DesForm } from 'components/decorators';
import { Collapse, ItemLayout } from 'components/container';

export interface IAppProps {
    form?: any
}
@DesForm
export default class App extends React.Component<IAppProps, any> {
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < 10; i++) {
            children.push(
                <Form.Item label={`Field ${i}`}>
                    {getFieldDecorator(`field-${i}`, {
                        rules: [
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ],
                    })(<Input placeholder="placeholder" />)}
                </Form.Item>
            );
        }
        return children;
    }
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };
    handleReset = () => {
        this.props.form.resetFields();
    };
    render() {
        return (
            <>
                <Form labelCol={{ span: 8 }} onSubmit={this.handleSearch}>
                    <Alert message="伸缩列" type="success" />
                    <Collapse column={this.getFields()}>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            Clear
                        </Button>
                    </Collapse>
                </Form>
                <Form labelCol={{ span: 6 }} onSubmit={this.handleSearch}>
                    <Alert message="伸缩列" type="success" />
                    <Collapse column={this.getFields()} rowSpan={1} columnSpan={4}>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                    </Collapse>
                </Form>

                <Form labelCol={{ span: 6 }} onSubmit={this.handleSearch}>
                    <Alert message="布局列" type="success" />
                    <ItemLayout column={this.getFields()} columnSpan={4}>
                    </ItemLayout>
                    <Button type="primary" htmlType="submit">
                        Search
                        </Button>
                </Form>
                <Form labelCol={{ span: 6 }} onSubmit={this.handleSearch}>
                    <Alert message="布局列" type="success" />
                    <ItemLayout column={this.getFields()} columnSpan={2}>
                    </ItemLayout>
                    <Button type="primary" htmlType="submit">
                        Search
                        </Button>
                </Form>
            </>
        );
    }
}