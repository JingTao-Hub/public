import { BindAll } from 'lodash-decorators';
import lodash from 'lodash';
import * as React from 'react';
import './ckeditor.scss';
import { Spin, Icon } from 'antd';
const CKEditor = React.lazy(() => import('ckeditor4-react')
    // .then(x => {
    //     // console.log("TCL: x.default.editorUrl", x.default.editorUrl)
    //     // x.default.editorUrl="12323"
    //     return x
    // })
);
/**
 * 富文本 文档地址如下
 *
 * @export
 * @class DemoCKEditor
 * https://ckeditor.com/docs/ckeditor4/latest/guide/dev_react.html
 * https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
 */
@BindAll()
export class DemoCKEditor extends React.Component<{
    /**
     * CKEditor 配置
     * API https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html
     */
    config?: {
        /** 图片上传 */
        uploadUrl?: string;
        [key: string]: any;
    };
    [key: string]: any;
}, any> {
    state = {
        loading: true
    }
    editor: any;
    event = {
        onChange: (event) => {
            this.props.onChange && this.props.onChange(event.editor.getData());
        },
        onLoaded: (event) => {
            this.setState({ loading: false });
            this.editor = event.editor;
            this.props.onLoaded && this.props.onLoaded(event);
        },
        onBlur: (event) => {
        },
        onMouseOut: (event) => {
            if (this.editor) {
                const data = this.editor.getData();
                if (!(lodash.eq(this.props.value, data))) {
                    this.props.onChange && this.props.onChange(data);
                }
            }
        }
    }
    default = {
        editorName: lodash.uniqueId(lodash.now().toString()),
        // Define the toolbar: http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_toolbar
        // The full preset from CDN which we used as a base provides more features than we need.
        // Also by default it comes with a 3-line toolbar. Here we put all buttons in a single row.
        // toolbar: [
        //     { name: 'document', items: ['Print'] },
        //     { name: 'clipboard', items: ['Undo', 'Redo'] },
        //     { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
        //     { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting'] },
        //     { name: 'colors', items: ['TextColor', 'BGColor'] },
        //     { name: 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        //     { name: 'links', items: ['Link', 'Unlink'] },
        //     { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
        //     { name: 'insert', items: ['Image', 'Table'] },
        //     { name: 'tools', items: ['Maximize'] },
        //     { name: 'editing', items: ['Scayt'] }
        // ],
        // Since we define all configuration options here, let's instruct CKEditor to not load config.js which it does by default.
        // One HTTP request less will result in a faster startup time.
        // For more information check http://docs.ckeditor.com/ckeditor4/docs/#!/api/CKEDITOR.config-cfg-customConfig
        customConfig: '',
        language: 'es',
        // Sometimes applications that convert HTML to PDF prefer setting image width through attributes instead of CSS styles.
        // For more information check:
        //  - About Advanced Content Filter: http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_advanced_content_filter
        //  - About Disallowed Content: http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_disallowed_content
        //  - About Allowed Content: http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_allowed_content_rules
        disallowedContent: 'img{width,height,float}',
        extraAllowedContent: 'img[width,height,align]',
        // Enabling extra plugins, available in the full-all preset: http://ckeditor.com/presets-all
        extraPlugins: 'tableresize,uploadimage,uploadfile',

        // uploadUrl: '/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images',
        // imageUploadUrl:'/aaa',
        // filebrowserImageUploadUrl:"/aaaa",
        /*********************** File management support ***********************/
        // In order to turn on support for file uploads, CKEditor has to be configured to use some server side
        // solution with file upload/management capabilities, like for example CKFinder.
        // For more information see http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_ckfinder_integration
        // Uncomment and correct these lines after you setup your local CKFinder instance.
        // filebrowserBrowseUrl: 'http://example.com/ckfinder/ckfinder.html',
        // filebrowserUploadUrl: 'http://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
        /*********************** File management support ***********************/
        // Make the editing area bigger than default.
        height: 500,
        // An array of stylesheets to style the WYSIWYG area.
        // Note: it is recommended to keep your own styles in a separate file in order to make future updates painless.
        contentsCss: ['https://ckeditor.com/assets/libs/ckeditor4/4.12.1/contents.css?t=J7DK'],
        // This is optional, but will let us define multiple different styles for multiple editors using the same CSS file.
        bodyClass: 'document-editor',
        // Reduce the list of block elements listed in the Format dropdown to the most commonly used.
        format_tags: 'p;h1;h2;h3;pre',
        // Simplify the Image and Link dialog windows. The "Advanced" tab is not needed in most cases.
        removeDialogTabs: 'image:advanced;link:advanced',
        // Define the list of styles which should be available in the Styles dropdown list.
        // If the "class" attribute is used to style an element, make sure to define the style for the class in "mystyles.css"
        // (and on your website so that it rendered in the same way).
        // Note: by default CKEditor looks for styles.js file. Defining stylesSet inline (as below) stops CKEditor from loading
        // that file, which means one HTTP request less (and a faster startup).
        // For more information see http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_styles
        stylesSet: [
            /* Inline Styles */
            { name: 'Marker', element: 'span', attributes: { 'class': 'marker' } },
            { name: 'Cited Work', element: 'cite' },
            { name: 'Inline Quotation', element: 'q' },
            /* Object Styles */
            {
                name: 'Special Container',
                element: 'div',
                styles: {
                    padding: '5px 10px',
                    background: '#eee',
                    border: '1px solid #ccc'
                }
            },
            {
                name: 'Compact table',
                element: 'table',
                attributes: {
                    cellpadding: '5',
                    cellspacing: '0',
                    border: '1',
                    bordercolor: '#ccc'
                },
                styles: {
                    'border-collapse': 'collapse'
                }
            },
            { name: 'Borderless Table', element: 'table', styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
            { name: 'Square Bulleted List', element: 'ul', styles: { 'list-style-type': 'square' } }
        ]
    }
    render() {
        const { uploadUrl: filebrowserImageUploadUrl } = this.props.config;
        return (
            <React.Suspense fallback={<div className='demo-CKEditor'><Spin size="large" tip="loading..." indicator={<Icon type="loading" spin />} /></div>}>
                <div className='demo-CKEditor' onMouseOut={this.event.onMouseOut}>
                    <Spin size="large" tip="loading..." spinning={this.state.loading} indicator={<Icon type="loading" spin />} >
                        <CKEditor
                            {...this.props}
                            data={this.props.value}
                            {...this.event}
                            config={{
                                filebrowserImageUploadUrl,
                                ...this.default,
                                ...this.props.config,
                            }}

                        />
                    </Spin>
                </div>
            </React.Suspense>

        );
    }
}
export default DemoCKEditor