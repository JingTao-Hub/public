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
interface IFromItemProps<V = any> extends GetFieldDecoratorOptions {
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
export interface IFromItemsProps<V = any> extends GetFieldDecoratorOptions {
    /** Form.create() 创建 的 对象 */
    form: WrappedFormUtils<V>;
    formItems: IFromItemProps[];
}

export class FormItems extends React.Component<IFromItemsProps, {}> {
    static getFieldDecorator(props: IFromItemsProps) {
        const { form, formItems } = props
        return formItems.map(item => {
            const { field, itemNode, label, formItemProps, ...options } = item;
            console.log("TCL: FormItems -> getFieldDecorator -> item", item)
            return <Form.Item key={field} label={label || field} >
                {form.getFieldDecorator(field, options)(itemNode)}
            </Form.Item>
        })
    }
    render() {
        return FormItems.getFieldDecorator(this.props);
    }
}

export default FormItems