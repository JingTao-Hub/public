/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2019-06-21 11:00:19
 * @modify date 2019-06-21 11:00:19
 * @desc [description]
 */
import { FormItemProps } from 'antd/lib/form';
import Form, { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import * as React from 'react';
import './style.scss';
export interface IFromItemProps<V = any> extends GetFieldDecoratorOptions {
    /** Form.create() 创建 的 对象 */
    form: WrappedFormUtils<V>;
    /**
     *  getFieldDecorator(`field-${i}`,{})
     *  创建 `field-${i}`
     */
    field: string;
    /**  Form.Item label  */
    label?: React.ReactNode;
    /**
     *  getFieldDecorator()(<Input placeholder="placeholder" />)
     *  渲染的 <Input placeholder="placeholder" />
     */
    itemNode: React.ReactNode;
    /**
     * Form.Item  Props
     */
    formItemProps?: FormItemProps;
}
// @BindAll()
/**
 *   创建
 *   <Form.Item label={`Field ${i}`}>
 *       {getFieldDecorator(`field-${i}`, {
 *            rules: [
 *               {
 *                    required: true,
 *                    message: 'Input something!',
 *                },
 *            ],
 *        })(<Input placeholder="placeholder" />)}
 *    </Form.Item>
 */
export class FormItem extends React.Component<IFromItemProps, {}> {
    componentDidCatch(error, info) {
        const { form, field, itemNode, label, formItemProps, children, ...options } = this.props;
        console.error('组件错误', field)
        console.log(error)
        console.error('组件错误', field)
    }
    render() {
        const { form, field, itemNode, label, formItemProps, children, ...options } = this.props;
        console.log("TCL: FormItem -> render -> field", field)
        return (
            <>
                <Form.Item label={label || field} >
                    {form.getFieldDecorator(field, options)(itemNode)}
                </Form.Item>
            </>
        );
    }
}

export default FormItem