import { Col, Drawer, Layout, Menu, Row, Tooltip } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import lodash from 'lodash';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Store from '../store';
import { observable, runInAction, action } from 'mobx';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@observer
export default class App extends React.Component<{
    mode: "horizontal" | "inline"
}, any> {
    @observable isDrawer = false;
    // 事件对象
    resizeEvent: Subscription;
    componentDidMount() {
        // 响应式 左侧菜单
        if (this.props.mode === "inline") {
            this.initDrawer();
            this.resizeEvent = fromEvent(window, "resize").pipe(debounceTime(200)).subscribe(e => {
                this.initDrawer();
            });
        }
    }
    @action
    initDrawer() {
        if (window.innerWidth <= 500) {
            if (!this.isDrawer) {
                this.isDrawer = true;
                Store.onCollapsed(false);
                Store.menuMode = "inline";
            }
        } else if (this.isDrawer) {
            this.isDrawer = false
        }
    }
    componentWillUnmount() {
        this.resizeEvent && this.resizeEvent.unsubscribe()
    }
    public render() {
        // 响应式 左侧菜单
        if (this.isDrawer) {
            return <Drawer className='demo-layout-sider-drawer' placement="left" closable={false} visible={Store.collapsed} maskClosable onClose={event => Store.onCollapsed()}>
                <PageMenu {...this.props} mode="inline" key="Drawer" />
            </Drawer>
        }
        if (Store.menuMode === this.props.mode) {
            if (this.props.mode === "inline") {
                const width = Store.collapsed ? lodash.get(this.props, 'menusWidth', 200) : 60;
                return (
                    <>
                        <Sider theme="light" trigger={null} collapsible collapsed={!Store.collapsed} width={width} className='demo-layout-sider' >
                            <PageMenu {...this.props} key="Sider" />
                        </Sider>
                        <div style={{ minWidth: width, maxWidth: width, width, transition: "all .2s" }}></div>
                    </>
                );
            }
            if (this.props.mode === "horizontal") {
                return (
                    <PageMenu {...this.props} key="horizontal" theme="dark" />
                );
            }
        }
        return null
    }
}

@observer
class PageMenu extends React.Component<any, any> {
    defaultOpenKeys = [];
    getDefaultOpenKeys(Menus, Menu, OpenKeys = []) {
        const ParentId = lodash.get(Menu, 'parentId');
        if (ParentId) {
            OpenKeys.push(String(ParentId));
            const Parent = lodash.find(Menus, ["id", ParentId]);
            if (Parent.parentId) {
                this.getDefaultOpenKeys(Menus, Parent, OpenKeys);
            }
        }
        return OpenKeys
    }
    getMenu(menus) {
        // const menus = lodash.get(this.props, 'menus', []);
        return lodash.find(menus, ["path", this.props.location.pathname]);
    }
    UNSAFE_componentWillMount() {
        const menus = lodash.get(this.props, 'menus', []);
        this.defaultOpenKeys = this.getDefaultOpenKeys(menus, this.getMenu(menus));
    }
    public render() {
        const props: MenuProps = {
            mode: this.props.mode,
            theme: this.props.theme,
            defaultSelectedKeys: [],
            defaultOpenKeys: [],
            // selectedKeys:[],
        }
        const menusTree = lodash.get(this.props, 'menusTree', lodash.get(this.props, 'route.routes', []));
        const menus = lodash.get(this.props, 'menus', []);
        const find = lodash.find(menus, ["path", this.props.location.pathname]);
        props.defaultSelectedKeys.push(String(lodash.get(find, 'id', '')));
        if (props.mode === "horizontal" || !Store.collapsed) {
            delete props.defaultOpenKeys
            // props.theme = "dark"
        } else {
            props.defaultOpenKeys = this.defaultOpenKeys;
        }
        return (
            <Menu
                {...props}
            >
                {runderSubMenu(menusTree)}
            </Menu>
        );
    }
}
@observer
export class HeaderMenu extends React.Component<any, any> {
    // onCollapsed = () => {
    //     console.log('aaaa')
    //     Store.onCollapsed()
    // }
    // componentDidMount() {
    //     document.body.addEventListener('click', this.onCollapsed, true)
    // }
    // componentWillUnmount() {
    //     document.body.removeEventListener('click', this.onCollapsed, true)
    // }
    public render() {
        if (Store.menuMode === "horizontal") {
            const menus = lodash.get(this.props, 'menusTree', lodash.get(this.props, 'route.routes', []));
            return (
                <Row
                    type="flex"
                    align="top"
                    onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        event.nativeEvent.stopImmediatePropagation();
                    }}
                    gutter={30}
                    className={`demo-layout-header-menu ${!Store.collapsed && 'header-menu-open'}`}>
                    {menus.map(item => (
                        <Col xl={4} lg={8} md={8} sm={12} xs={24} key={item.id} >
                            <Menu className='demo-menu' mode="inline">
                                {item.children && item.children.length ? <Menu.ItemGroup title={<>{item.icon}{item.title}</>}>
                                    {runderSubMenu(item.children)}
                                </Menu.ItemGroup> : runderSubMenu([item])}

                            </Menu>
                        </Col>
                    ))}
                </Row>
            );
        }
        return null
    }
}

function renderLink(menu) {
    const title = menu.title || menu.path
    if (menu.path) {
        return <Tooltip placement="right" title={title}>
            <Link to={menu.path} >{menu.icon} <span>{title}</span></Link>
        </Tooltip>
    }
    return <Tooltip placement="right" title={title}>
        <span >
            {menu.icon}
            <span>{menu.title}</span>
        </span>
    </Tooltip>
}

function runderSubMenu(Meuns) {
    return Meuns.map((menu, index) => {
        const key = menu.id || menu.path || index
        if (menu.children && menu.children.length > 0) {
            return <SubMenu key={key} title={<span>
                {menu.icon}
                <span>{menu.title}</span>
            </span>}>
                {
                    runderSubMenu(menu.children)
                }
            </SubMenu>
        }
        return <Menu.Item key={key} >
            {renderLink(menu)}
        </Menu.Item>
    })
}
