/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2018-09-12 18:53:42
 * @modify date 2019-07-24 18:29:25
 * @desc [description]
*/
import React from 'react';
import './style.scss';
import { BraftEditorProps } from 'braft-editor';
const Editor = React.lazy(() => import('./editer'));
const ControlledEdit = React.lazy(() => import('./controlledEdit'));
interface IAppProps extends BraftEditorProps {
  /**
   * 停用
   */
  display?: boolean;
  /**
   * 禁用
   */
  disabled?: boolean;
  onChange?: any;
  /**
   * 代码编辑器模式
   */
  CodeMirror?: boolean;
  /**
   * 编码
   */
  escape?: boolean;
  [key: string]: any;
}
/**
 * https://github.com/margox/braft-editor
 * 富文本编辑
 */
export class DemoEditor extends React.Component<IAppProps, any> {
  render() {
    return <React.Suspense fallback={<div></div>}>
      <div>
        {this.props.CodeMirror ? <ControlledEdit {...this.props} /> : <Editor {...this.props} />}
      </div>
    </React.Suspense>
  }
}
export default DemoEditor