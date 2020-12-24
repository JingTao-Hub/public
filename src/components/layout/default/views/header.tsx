import { Badge, Col, Dropdown, Icon, Input, Layout, List, Menu, Row, Popover, Tabs, Avatar } from 'antd';
import lodash from 'lodash';
import { Debounce } from 'lodash-decorators';
import { observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../store';
import logo from './logo.png';
import SetUp from './setUp';
import Sider, { HeaderMenu } from './sider';
import { Observable } from 'rxjs';

const { Header } = Layout;
export default class App extends React.Component<any, any> {
    render() {
        return (
            <>
                <Header className="demo-layout-header">
                    <Row type="flex" >
                        <Col className="demo-logo">
                            <img src={logo} alt="" />
                            <span>{lodash.get(this.props, 'title', 'demo')} </span>
                            <Icon onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                event.nativeEvent.stopImmediatePropagation();
                                Store.onCollapsed()
                            }} type="menu-fold" theme="outlined" />
                        </Col>
                        <MenuSearch  {...this.props} />
                        <UserMenu {...this.props} />
                    </Row>
                </Header>
                <HeaderMenu  {...this.props} />
            </>
        );
    }
}

class UserMenu extends React.Component<any, any> {
    render() {
        return (
            <Col className='demo-user'>
                <Bell />
                <SetUp />
                <Dropdown overlay={this.renderOverlay()}>
                    <a className="ant-dropdown-link" href="javascript:void(0)">
                        <Avatar src={lodash.get(this.props, 'user.avatar', 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3339117455,124087930&fm=58&bpow=600&bpoh=388')}/> {lodash.get(this.props, 'user.name', 'UserName')} <Icon type="down" />
                    </a>
                </Dropdown>
            </Col>
        );
    }
    renderOverlay() {
        return lodash.get(this.props, 'user.menu', <Menu >
            <Menu.Item>
                无菜单
            </Menu.Item>
        </Menu>)
        // (
        //     <Menu>
        //         <Menu.Item>
        //             <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        //                 1st menu item
        //         </a>
        //         </Menu.Item>
        //         <Menu.Item>
        //             <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        //                 2nd menu item
        //         </a>
        //         </Menu.Item>
        //         <Menu.Item>
        //             <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        //                 3rd menu item
        //         </a>
        //         </Menu.Item>
        //     </Menu>
        // );
    }
}
class Bell extends React.Component<any, any> {
    render() {
        const data = [
            {
                title: 'Ant Design Title 1',
            },
            {
                title: 'Ant Design Title 2',
            },
            {
                title: 'Ant Design Title 3',
            },
            {
                title: 'Ant Design Title 4',
            },
        ];
        return (
            <Popover placement="bottomLeft" content={
                <div style={{ width: 360, overflow: "hidden" }}>
                    <Tabs defaultActiveKey="1" >
                        <Tabs.TabPane tab={<Badge count={5} >
                            <span>Notice</span>
                        </Badge>} key="1">
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                        />
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Already read" key="2">
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                        />
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Unread" key="3">
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                        />
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            } >
                <a href="javascript:void(0)">
                    <Badge count={5} dot>
                        <Icon type="bell" />
                    </Badge>
                </a>
            </Popover>
        );
    }
}
@observer
class MenuSearch extends React.Component<any, any> {

    render() {
        const className = Store.isSearch ? 'demo-open-search' : ''
        return (
            <>
                <Col className={`demo-menu ${className}`}>
                    <Sider {...this.props} mode="horizontal" />
                </Col>
                {this.props.search && <Col className={`demo-search ${className}`}>
                    <Search {...this.props} />
                </Col>}
            </>
        );
    }
}
@observer
class Search extends React.Component<any, any> {
    @observable dataSource = [];
    @observable loading = false
    onClick(event) {
        // event.preventDefault()
        // event.stopPropagation()
        // event.nativeEvent.stopImmediatePropagation();
        Store.onOpenSearch()
    }
    @Debounce(1000)
    async  onDataSource(value) {
        runInAction(() => this.loading = true)
        const dataSource = this.props.search.onChange(value);
        let res;
        // 值为 数组 
        if (lodash.isArray(dataSource)) {
            res = dataSource;
        }
        // 值为 Promise
        else if (dataSource instanceof Promise) {
            res = await dataSource;
        }
        // 值为 Observable 
        else if (dataSource instanceof Observable) {
            res = await dataSource.toPromise();
        }
        console.log("TCL: Search -> onDataSource -> res", res)
        runInAction(() => {
            this.dataSource = res;
            this.loading = false;
        })
    }
    onChange(event) {
        this.onDataSource(event.target.value);
    }
    onItem(event) {
        this.props.search.onItemClick && this.props.search.onItemClick(toJS(event));
    }
    render() {
        return (
            <>
                <div className='demo-search-body'>
                    <div className='ant-modal-mask' >
                        <Input placeholder="Search"
                            prefix={<Icon type="search" />}
                            suffix={<Icon onClick={this.onClick.bind(this)} type="close" />}
                            onChange={this.onChange.bind(this)}
                        />
                        <div className='demo-search-list'>
                            {this.renderList()}
                        </div>
                    </div>
                </div>
                <a className='demo-open-search-btn' href="javascript:void(0)"
                    onClick={this.onClick.bind(this)}
                >
                    <Icon type="search" />
                </a>
            </>
        );
    }
    renderList() {
        if (this.props.search.body) {
            return this.props.search.body
        } else {
            return <List
                loading={this.loading}
                size="small"
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                bordered
                dataSource={[...this.dataSource]}
                renderItem={item => <List.Item onClick={this.onItem.bind(this, item)}>
                    {item.text}
                </List.Item>}
            />
        }
    }
}