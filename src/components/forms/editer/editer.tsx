/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2018-09-12 18:53:42
 * @modify date 2019-07-24 18:29:25
 * @desc [description]
*/
import { Button, Card, Modal } from 'antd';
import BraftEditor, { BraftEditorProps, EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import Table from 'braft-extensions/dist/table';
import 'braft-extensions/dist/table.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/theme/material.css';
import 'codemirror/theme/neat.css';
import { html_beautify } from 'js-beautify/js/lib/beautify-html';
// import Markdown from 'braft-extensions/dist/markdown'
import lodash from 'lodash';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { UnControlled as CodeMirror, Controlled } from 'react-codemirror2';
// import globalConfig from '../../../global.config';
import RequestFiles from '../../../utils/requestFiles';
import './style.scss';
BraftEditor.use(Table({
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['editor-id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['editor-id-2']  // 指定该模块对哪些BraftEditor无效
}));
// BraftEditor.use(Markdown({}));
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
export default class Editor extends React.Component<IAppProps, any> {
  static wtmType = "Editor";
  ref = React.createRef<BraftEditor>();
  // CodeMirrorEdit 容器
  CodeMirrorEdit = document.createElement('div');
  CodeMirrorEditEditorState = null;
  state = {
    editorState: BraftEditor.createEditorState(this.getValue(this.props.value)), // 设置编辑器初始内容
    EditHtml: false,
  }
  // console = globalConfig.development
  default: BraftEditorProps = {
    extendControls: [
      {
        key: 'CodeMirrorEdit',
        type: 'button',
        text: "HTML",
        title: "EditHTML",
        onClick: (event) => {
          // console.log("TCL: DemoEditor -> event", event)
          const { EditHtml } = this.state;
          this.setState({ EditHtml: !EditHtml }, () => {
            if (EditHtml) {
              console.log("TCL: DemoEditor -> this.CodeMirrorEditEditorState", this.CodeMirrorEditEditorState)
              this.onChange(BraftEditor.createEditorState(this.CodeMirrorEditEditorState))
            }
          });
        }
        // component: <CodeMirrorEdit body={this.CodeMirrorEdit} value={html_beautify(this.state.editorState.toHTML())} onChange={value => editorStateValue = value} />
        // text: '',
        // onClick: event => {
        //   //  html_beautify 格式化 html 字符
        //   let editorStateValue = html_beautify(this.state.editorState.toHTML());
        //   Modal.confirm({
        //     className: "demo-dialog",
        //     title: "Edit HTML",
        //     icon: null,
        //     okText: "Save",
        //     width: '80%',
        //     style: { minWidth: 800 },
        //     onOk: () => {
        //       this.onChange(BraftEditor.createEditorState(editorStateValue))
        //     },
        //     // content: ()
        //   })
        // }
      },
    ],
    media: {
      uploadFn: (params) => {
        console.log("TCL: WtmEditor -> params", params)
        RequestFiles.customRequest({
          action: RequestFiles.FileTarget,
          filename: "file",
          file: params.file,
          onProgress: (event) => {
            params.progress(event.percent)
          },
          onSuccess: (res) => {
            const url = RequestFiles.onFileDownload(res.Id);
            params.success({
              url: url,
              meta: {
                id: res.Id,
                title: res.Name,
                alt: res.Name,
                loop: true, // 指定音视频是否循环播放
                autoPlay: true, // 指定音视频是否自动播放
                controls: true, // 指定音视频是否显示控制栏
                poster: url, // 指定视频播放器的封面
              }
            })
          },
          onError: (err) => {
            params.error({
              msg: err.message
            })
          }
        });
      }
    }
  }
  componentDidMount() {
    // console.log("TCL: DemoEditor -> this.props.value", this.props.value)
    const { current } = this.ref;
    const containerNode: HTMLDivElement = current['containerNode'];
    if (containerNode) {
      const DraftEditor = containerNode.querySelector('.bf-content>.DraftEditor-root');
      DraftEditor.appendChild(this.CodeMirrorEdit);
    }
  }
  getValue(value) {
    // console.log("TCL: getValue -> value", value)
    return this.props.escape ? lodash.unescape(value) : value;
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (lodash.isEqual(this.changeValue, nextProps.value)) {
      return
    }
    this.changeValue = nextProps.value;
    this.setState({ editorState: BraftEditor.createEditorState(this.getValue(nextProps.value)) });
  }

  changeValue = '';
  onChange(editorState: EditorState) {
    if (lodash.isEqual(this.state.editorState.toRAW(), editorState.toRAW())) {
      return this.setState({ editorState });
    }
    this.setState({ editorState });
    // console.log("TCL: DemoEditor -> onChange -> editorState", editorState)
    let value = editorState.toHTML();
    value = lodash.eq(value, '<p></p>') ? '' : value;
    this.changeValue = this.props.escape ? lodash.escape(value) : value;
    this.props.onChange && this.props.onChange(this.changeValue, editorState)
  }
  render() {
    const { editorState } = this.state;
    const props = { ...this.default, ...this.props }
    delete props.value;
    delete props.onChange;
    // 禁用
    if (this.props.display) {
      props.controls = [];
      props.disabled = true;
    }
    return <Card className={`app-editor-card ${this.state.EditHtml ? 'app-editor-card-html' : ''}`}>
      <BraftEditor
        ref={this.ref}
        value={editorState}
        onChange={this.onChange.bind(this)}
        {...props}
      />
      {this.state.EditHtml && <CodeMirrorEdit body={this.CodeMirrorEdit}
        componentDidMount={(value) => {
          this.CodeMirrorEditEditorState = value;
        }}
        value={html_beautify(editorState.toHTML())}
        onChange={value => {
          this.CodeMirrorEditEditorState = value;
        }} />}
    </Card>
  }
}
@observer
export class CodeMirrorEdit extends React.Component<{ body: HTMLDivElement, value: any, onChange: any, componentDidMount: any }> {
  // editor 实例
  instance;
  // value
  value = this.props.value;
  ref = React.createRef<HTMLDivElement>();
  @observable
  isFullscreen = false;
  // 全屏
  @action
  onFullscreen() {
    this.isFullscreen = !this.isFullscreen
  }
  componentDidMount() {
    this.props.componentDidMount(this.props.value);
  }
  // 格式化
  onDiff() {
    this.instance && this.instance.setValue(html_beautify(BraftEditor.createEditorState(this.value).toHTML()));
  }
  render() {
    return ReactDOM.createPortal((
      <div className={`demo-edit-CodeMirror `}>
        {/* <Fullscreen FullscreenBody={() => this.ref} /> */}
        <div className='demo-edit-CodeMirror-btn'>
          <Button icon="diff" type="link" onClick={this.onDiff.bind(this)} title="format"></Button>
          {/* <Button icon="fullscreen" type="link" onClick={this.onFullscreen.bind(this)} title="fullscreen"></Button> */}
        </div>
        <CodeMirror
          options={{ theme: "material", lineNumbers: true, mode: 'xml', }}
          value={this.props.value}
          // onBeforeChange={(editor, data, value) => {
          //   console.log("TCL: DemoEditor -> value", value)
          //   // this.setState({value});
          // }}
          editorDidMount={event => {
            this.instance = event
          }}
          onChange={(editor, data, value) => {
            this.value = value;
            this.props.onChange(value)
          }}
        />
      </div>
    ), this.props.body);
  }
}

export class ControlledEdit extends React.Component<any, any>{
  onPreview() {
    let previewWindow = window['previewWindow'];
    if (previewWindow) {
      previewWindow.close()
    }
    previewWindow = window.open()
    previewWindow.document.write(this.props.value)
    previewWindow.document.close()
  }
  componentDidMount() {
    const { value, onChange } = this.props;
    onChange(html_beautify(value))
  }
  render() {
    const { value, onChange } = this.props;
    return <Card className='app-editor-card card-Controlled'>
      <div className='demo-edit-CodeMirror-btn'>
        <Button icon="diff" type="link" title="format" onClick={event => { onChange(html_beautify(value)) }}></Button>
        <Button icon="eye" type="link" title="preview" onClick={event => { this.onPreview() }}></Button>
      </div>
      <Controlled
        autoScroll
        autoCursor
        value={value}
        // onChange={onChange}
        onBeforeChange={(editor: any, data: any, value: string) => {
          // console.log("TCL: DemoEditor -> render -> value", )
          onChange(value)
        }}
        options={{ theme: "material", lineNumbers: true, mode: 'xml', }}
      />
    </Card>
  }
}

