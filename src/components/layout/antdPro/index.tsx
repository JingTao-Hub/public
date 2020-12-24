import { BasicLayout, BasicLayoutProps, GridContent, MenuDataItem ,PageHeaderWrapper} from '@ant-design/pro-layout';
import lodash from 'lodash';
import { BreadcrumbProps as AntdBreadcrumbProps } from 'antd/es/breadcrumb';
import { action, observable, toJS } from 'mobx';
import { create, persist } from 'mobx-persist';
import { observer } from 'mobx-react';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import regulars from "../../../utils/regulars";
import { base64 } from "../../../utils/crypto";
import LayoutSpin from "./LayoutSpin";
import logo from './logo.png';
import RouterTabs from './RouteBar';
import SettingDrawer, { ContentWidth, Settings } from './SettingDrawer';
import './style.less';
export interface LayoutProMenuDataItem {
    authority?: string[] | string;
    // children?: MenuDataItem[];
    hideChildrenInMenu?: boolean;
    hideInMenu?: boolean;
    icon?: string;
    locale?: string;
    name?: string;
    path: string;
    key: string;
    parent: undefined | string;
    [key: string]: any;
}``
interface LayoutProProps extends BasicLayoutProps {
    menus?: LayoutProMenuDataItem[];
    breadcrumb?:boolean
}
const hydrate = create({
    storage: window.localStorage,   // 存储的对象
    jsonify: true, // 格式化 json
    debounce: 1000,
});
@observer
export class LayoutPro extends React.Component<LayoutProProps> {
    @observable
    collapse = false;
    @persist("object")
    @observable
    settings: Settings = {
        // 导航的主题 'light' | 'dark'
        navTheme: 'dark',
        // layout 的菜单模式,sidemenu：右侧导航，topmenu：顶部导航 'sidemenu' | 'topmenu'
        layout: 'sidemenu',
        // layout 的内容模式,Fluid：定宽 1200px，Fixed：自适应
        contentWidth: 'Fluid',
        // 是否固定 header 到顶部
        fixedHeader: true,
        // 是否下滑时自动隐藏 header
        autoHideHeader: false,
        // 是否固定导航
        fixSiderbar: true,
        // 关于 menu 的配置，暂时只有 locale,locale 可以关闭 menu 的自带的全球化
        menu: {
            locale: true,
        },
        // layout 的 左上角 的 title
        title: 'React',
        // 使用 IconFont 的图标配置
        iconfontUrl: '',
        // 弹框类型
        infoType: "Modal",
        /**
        * AgGrid 主题
        * ag-theme-balham
        * ag-theme-material
        */
        agGridTheme: "ag-theme-material",
        /**
         * 页签 页面
         */
        tabsPage: false,
    }
    constructor(props) {
        super(props)
        this.menus = createMenus(this.props.menus);
        this.menusTree = recursionTree(lodash.cloneDeep(this.menus), undefined, []);
        hydrate('demo-settings', this)
            // post hydration
            .then(() => {
                // window['g_locale'] = this.language;
            })
    }
    /**
     *settings 变更 事件
     *
     * @param {*} settings
     * @memberof App
     */
    @action.bound
    onSettingChange(settings) {
        this.settings = settings;
    }
    // 菜单 打开 的 key
    defaultOpenKeys = [];
    // 菜单 选择 的 key
    selectedKeys = [];
    menusTree = [];
    menus = [];
    //  获取 
    getDefaultOpenKeys(Menus, Menu, OpenKeys = []) {
        const ParentId = lodash.get(Menu, 'parent');
        if (ParentId) {
            OpenKeys.push(ParentId);
            const Parent = lodash.find(Menus, ["key", ParentId]);
            if (Parent && Parent.parent) {
                this.getDefaultOpenKeys(Menus, Parent, OpenKeys);
            }
        }
        return OpenKeys
    }
    // 根据 路径获取对应菜单
    getMenu(pathname) {
        const menu = lodash.find(this.props.menus || [], ["path", pathname]);
        this.selectedKeys = [lodash.get(menu, 'key', '/')]
        return menu;
    }

    UNSAFE_componentWillMount() {
        this.defaultOpenKeys = this.getDefaultOpenKeys(this.menus || [], this.getMenu(this.props.location.pathname));
    }
    UNSAFE_componentWillUpdate(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.defaultOpenKeys = this.getDefaultOpenKeys(this.menus || [], this.getMenu(nextProps.location.pathname));
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // this.menusTree=recursionTree(this.props.menus,)
        if (this.props.menus !== nextProps.menus) {
            this.menus = createMenus(nextProps.menus);
            this.menusTree = recursionTree(lodash.cloneDeep(this.menus), undefined, []);
        }
    }
    @action.bound
    togglerContent() {
        this.collapse = !this.collapse;
    };
    public render() {
        const settings = toJS(this.settings);
        const { menus, ...props } = this.props;
        // window['g_locale']='en-US'
        return (
            <>
                <BasicLayout
                    logo={lodash.get(this.props, 'logo', logo)}
                    {...settings}
                    // rightContentRender={rightProps => (
                    //     <RightContent {...rightProps} changeLang={event => {
                    //         // window['g_locale'] = event.key
                    //     }} />
                    //     <div className={`ant-pro-setting ${settings.navTheme} ${settings.layout}`} onClick={this.togglerContent}>
                    //     <Icon type={ 'setting'} />
                    // </div>
                    // )}
                    menuHeaderRender={(logo, title) => <Link to="/">{logo}{title}</Link>}
                    menuDataRender={() => {
                        return this.menusTree || []
                    }}
                    menuItemRender={(menuItemProps, defaultDom) => {
                        if (menuItemProps.isUrl && lodash.startsWith(menuItemProps.path, '/external')) {
                            defaultDom = <Link to={menuItemProps.path}>{lodash.get(defaultDom, 'props.children')}</Link>
                        }
                        return menuItemProps.isUrl ? defaultDom : <Link to={menuItemProps.path}>{defaultDom}</Link>;
                    }}
                    menuProps={{
                        selectedKeys: this.selectedKeys,
                        openKeys: this.defaultOpenKeys,
                        onOpenChange: event => {
                            this.defaultOpenKeys = [...event];
                            this.forceUpdate();
                        }
                    }}
                    footerRender={() => null}
                    {...props}
                >   
                    {/* {settings.tabsPage && settings.contentWidth !== "Fixed" ? <TabsPages {...this.props} /> : <MainContent {...this.props} contentWidth={settings.contentWidth} />} */}
                    <MainContent {...this.props} contentWidth={settings.contentWidth} />
                </BasicLayout>
                <SettingDrawer settings={settings} onSettingChange={this.onSettingChange} />
            </>
        );
    }
}

class MainContent extends React.Component<{ contentWidth: ContentWidth, route?: any ,breadcrumb?:boolean}> {
    shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
        return !lodash.eq(this.props.contentWidth, nextProps.contentWidth)
    }
    renderRoutes = renderRoutes(this.props.route.routes);
    render() {
        return (
            <GridContent contentWidth={this.props.contentWidth}>
              { this.props.breadcrumb&& <RouterTabs breadcrumb homeUrl='/echarts' {...this.props}></RouterTabs>}
                <React.Suspense fallback={<LayoutSpin />}>
                    {this.renderRoutes}
                </React.Suspense>
            </GridContent>
        );
    }
}

/**
* 递归 格式化 树
* @param datalist 
* @param ParentId 
* @param children 
*/
function recursionTree(datalist, ParentId, children: MenuDataItem[] = []) {
    lodash.filter(datalist, ['parent', ParentId]).map(data => {
        data.children = recursionTree(datalist, data.key, data.children || []);
        children.push(data);
    });
    return children;
}
function createMenus(menus: LayoutProMenuDataItem[]) {
    return menus.map(data => {
        // 转换 外部页面
        if (regulars.url.test(data.path)) {
            data.path = "/external/" + base64.encryption(data.path)// encodeURIComponent(data.path);
        } else
            // public 下的 pages 页面
            if (lodash.startsWith(data.path, '@StaticPage')) {
                data.path = "/external/" + base64.encryption(lodash.replace(data.path, '@StaticPage', `${window.location.origin}`))// encodeURIComponent(lodash.replace(data.path, '@StaticPage', `${window.location.origin}`));
            }
        return data
    })
}