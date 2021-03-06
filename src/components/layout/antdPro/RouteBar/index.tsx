/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Tag, Dropdown, Icon, Tooltip, Menu, Tabs, Button } from 'antd';
import { RouteProps, withRouter } from "react-router-dom";
import { isUrl } from '../../../../utils/utils';
import styles from './index.module.less'


const { SubMenu } = Menu;
const { TabPane } = Tabs;

// 模拟全局路由配置对象，
let allRouteFlatMap = {};

// 通过 pathname 获取 pathname 对应到路由描述信息对象
const getRouteInfo = pathname => allRouteFlatMap[pathname]

const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

const Positions = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left'
}

interface IRouteProps extends RouteProps {
  route?: any
  unListen?: any
  history?: any
  homeUrl?: string
  menus?: any[]
  breadcrumb?: boolean
}
//@ts-ignore
@withRouter
class RouterTabs extends Component<IRouteProps, any> {
  didUnMounted = false
  notListenOnce = false
  tags = []
  routes = []; // 路由信息

  tabMap = {}; // 每个 页签对应的路由信息

  constructor(props) {
    super(props);
    const { location: { pathname }, route = {} } = this.props;
    const { routes = [] } = route
    this.routes = routes
    // 路由扁平化
    allRouteFlatMap = this.routeToMap(this.routes, allRouteFlatMap);

    this.state = {
      curPage: {}, // 当前路由对应到 pathname
      pages: [],
      type: 'editable-card',// editable-card line card
      hideAdd: true,
      tabPosition: Positions.top,
    };

    // 第一次渲染首页
    this.renderHome();
  }

  // 首页
  renderHome = () => {
    const { homeUrl, history, location: { pathname } } = this.props;
    const { search } = location
    if (pathname == '/') {
      const menu = this.props.menus.find(item => {
        return item.path === homeUrl
      })
      history.push({
        pathname: homeUrl,
        search
      })
      this.setState({
        pages: [menu]
      })
    } else if (pathname != homeUrl && this.state.pages.length == 0) {
      history.push({
        pathname: pathname,
        search
      })
    }




  }
  unListen = () => {
    const { homeUrl, history, location: { pathname } } = this.props;
    // 获取路由唯一key
    const curKey = pathname || "/";
    if (!this.tabMap[curKey]) {
      // 路由配置
      const routeInfo = getRouteInfo(pathname) || getRouteInfo("/exception/404") || {};
      // 菜单配置
      const menuInfo = this.getMenuInfo(pathname) || {};

      const path = this.props.menus.find(item => {
        return item.path === homeUrl
      })
      if (pathname === '/') {
        this.setState(
          {
            curPage: {
              pageId: path.path,
              path: path.path,
            }, 
            pages: [{ ...path, pageId: path.path }]
          }
        )
        this.tabMap[path.path] = {
          path: path.path,
          api: undefined,
        }
      } else {
        if (routeInfo.path) {
          this.setState(
            {
              curPage: {
                pageId: curKey,
                path: pathname,
              }, 
              pages: [{
                pageId: curKey,
                ...routeInfo,
                ...menuInfo,
                name: menuInfo.name || routeInfo.name,
                // search: _location.search
              }]
            }
          )
          this.tabMap[curKey] = {
            path: pathname,
            api: undefined,
          }
        }
      }
    }
  }
  componentDidMount() {
    const { homeUrl } = this.props
    if (this.unListen) {
      this.unListen();
      this.unListen = null;
    }
    // 监听路由切换事件
    this.unListen = this.props.history.listen((_location) => {
      if (this.didUnMounted) {
        return;
      }
      if (this.notListenOnce) {
        this.notListenOnce = false;
        return;
      }
      const { pathname, query = {}, search } = _location;
      const newPages = [...this.state.pages];

      if (pathname == '/') { // 返回首页
        this.props.history.push({
          pathname: homeUrl,
          search
        })
        return;
      }

      // 
      // 
      // 获取路由唯一key
      const curKey = this.getFullPathName(pathname, query) + "";
      if (!this.tabMap[curKey]) {
        // 路由配置
        const routeInfo = getRouteInfo(pathname) || getRouteInfo("/exception/404");

        // 菜单配置
        const menuInfo = this.getMenuInfo(pathname) || {};
        newPages.push({
          pageId: curKey,
          ...routeInfo,
          ...menuInfo,
          name: query.titleName || menuInfo.name || routeInfo.name,
          search: _location.search
        });
      }
      // 保存对应页面信息
      this.tabMap[curKey] = {
        path: pathname,
        search,
        api: undefined,
      }
      this.setState({
        curPage: {
          pageId: curKey,
          path: pathname,
        },
        pages: newPages
      });
    });
  }

  componentWillUnmount() {
    this.didUnMounted = true;
    if (this.unListen) {
      this.unListen();
      this.unListen = null;
    }
  }

  getFullPathName = (pathname, query = { pageId: undefined }) => {
    return query.pageId ? query.pageId : pathname;
  }

  getMenuInfo = (pathname) => {
    const { menus } = this.props
    let obj = menus.find(item => {
      return item.path === pathname
    })
    return obj || {}
  }

  // 扁平化路由
  routeToMap = (routes, ar) => {
    return routes.reduce((pv, cv, ci, arr) => {
      if (!(cv.routes && cv.routes.length > 0) && cv.component && cv.path) {
        pv[`${cv.path}`] = cv;
      }
      if (cv.routes) {
        return this.routeToMap(cv.routes, pv);
      }
      return pv;
    }, ar)
  }

  /**
   * 关闭标签
   * @param {页面标示} pageId 
   */
  handleClose = (pageId) => this.handleEditTab(pageId, 'remove')

  handleClickTag = (tag, e) => {
    if (e && e.key.toLowerCase() === 'i') {
      return;
    }
    if (tag !== this.state.curPage.pageId) {
      this.props.history.push({
        pathname: tag,
        search: this.getSearchMapParams(tag)
      });
    }
  }

  // 获取路由缓存参数
  getSearchMapParams = pageId => {
    const tabMap = this.tabMap[pageId];
    if (!tabMap) {
      return "";
    }
    return tabMap.search ? tabMap.search.replace(/from=[^&]+&?/, '') : undefined;
  }

  /**
   * 标签选择功能
   * 1: 关闭所有
   * 2: 关闭其他
   * 其他: 切换菜单
   * @param {tag 点击} e 
   */
  handleMenuClick = (e) => {
    const { homeUrl, history, location: { pathname } } = this.props;
    const { search } = location
    const eKey = e.key;
    let curPageId = this.getFullPathName(this.props.location.pathname, this.props.location['query']);

    if (eKey === '1') {
      curPageId = homeUrl;
      let page=this.props.menus.find(item=>{
          return item.path===homeUrl
      })
      page.pageId=homeUrl
      const pages = [page]
      const curPage = page;
      this.tabMap = {
        [`${homeUrl}`]: this.tabMap[homeUrl]
      }
      history.push( {
        pathname: homeUrl,
        search
      })
      setTimeout(() => this.setState({ pages, curPage }))
    } else if (eKey === '2') {
      // if (curPageId === homeUrl) {
      //   this.handleMenuClick({ key: '1' });
      // } else {
        const pages = this.state.pages.filter(it =>  it.path == curPageId);
        this.tabMap = {
          // [`${homeUrl}`]: this.tabMap[homeUrl],
          [`${curPageId}`]: this.tabMap[curPageId],
        }
        setTimeout(() => this.setState({ pages }))
      // }
    } else { // 切换
      this.handleClickTag(eKey, e);
      return;
    }
  }

  // 生成组件
  getTabEle = (path, name) => {
    let routeInfo = getRouteInfo(path);
    if (!routeInfo) {
      const { component } = getRouteInfo("/exception/404");
      return React.createElement(component, {
        title: name,
        actions: React.createElement('button', {
          onClick: () => this.clearRouteInfo(path)
        }, "关闭")
      });
    }
    const { component } = routeInfo;
    const tabApi = {
      closeThisTab: () => this.clearRouteInfo(path)
    }
    return React.createElement(component, { ...this.props, tabApi });
  }

  /**
   * 点击card 上的关闭
   * @param {pageId} targetKey 
   * @param {remove,...待扩展} action 
   */
  handleEditTab = (pageId, action) => {
    if (action == 'remove') {
      this.clearRouteInfo(pageId)
    }
  }

  /**
   * 清除对应页面
   * @param {*} pageId 
   */
  clearRouteInfo = pageId => {
    console.log(pageId)
    const { homeUrl, history, location: { pathname } } = this.props;
    const { search } = location
    const {
      curPage,
      pages,
    } = this.state;

    if (pageId) {
      const targetIndex = pages.findIndex(p => p.pageId === pageId);
      if (targetIndex > -1) {
        pages.splice(targetIndex, 1);
        if (this.tabMap[pageId]) delete this.tabMap[pageId];
      }
      if (pages.length > 0) {
        if (curPage.pageId == pageId) {
          if (pages.length == 1) {
            this.setState({
              curPage: {
                pageId: pages[0].pageId,
                path: pages[0].path
              },
              pages,
            })
            history.push({
              pathname: pages[0].path,
              search
            })
            return;
          } else {
            history.goBack();
          }
        }
      } else if (homeUrl) history.push(homeUrl);
    }
    this.setState({
      curPage, // 当前路由对应到 pathname
      pages: [...pages], // tabs 所有到所有页签
    })
  }

  /**
   * 切换页面
   */
  handleChangeTab = (pageId) => {
    if (pageId !== this.state.curPage.pageId) {
      const pageInfo = this.tabMap[pageId];
      if (pageInfo) {
        this.props.history.push({
          pathname: pageInfo.path,
          search: this.getSearchMapParams(pageId),
        });
      }
    }
  }

  render() {
    const { curPage, pages, ...otherProps } = this.state;
    this.tags = pages.map(({ pageId, path: pathname, name, icon }, index) => {
      if (pageId === '/') {
        const data = this.props.menus.find(item => {
          return item.path === this.props.homeUrl
        })
        pageId = data.path
        pathname = data.path
        name = data.name
        icon = data.icon
      }

      const title = name || this.props.homeUrl;
      const isLonger = title.length > 30; // 标题过长处理
      const tagElem = (
        <Tag
          key={pageId}
          data-key={pageId}
          className={classNames(styles.tag, { [styles.active]: pageId === curPage.pageId })}
          onClick={e => this.handleClickTag(pageId, e)}
          closable={index !== 0}
          afterClose={() => this.handleClose(pageId)}
        >
          {getIcon(icon)}
          <span className={styles.icon} />
          {isLonger ? `${title.slice(0, 30)}...` : title}
        </Tag>
      );
      return isLonger
        ? <Tooltip title={title} key={`tooltip_${pathname}`}>{tagElem}</Tooltip>
        : tagElem;
    });

    /* eslint-disable */
    const operations = <Dropdown overlay={
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">关闭所有</Menu.Item>
        <Menu.Item key="2">关闭其他</Menu.Item>
        <SubMenu title="切换标签">
          {
            this.tags.map(item => (<Menu.Item key={item.key}>{item.props.children}</Menu.Item>))
          }
        </SubMenu>
      </Menu>
    }
    >
      <Tag color="#2d8cf0"
        style={{ marginLeft: 12, padding: '2px 7px' }}>
        标签选项 <Icon type="down" />
      </Tag>
    </Dropdown>
    return (
      <div className={styles.tabMain}>
        <Tabs
          {...otherProps}
          activeKey={curPage.pageId}
          onChange={this.handleChangeTab}
          onEdit={this.handleEditTab}
          tabBarExtraContent={
            <div>
              {operations}
              <Button icon='reload' className={styles.tabRefresh} onClick={() => {
                if (this.tabMap[curPage.pageId] && this.tabMap[curPage.pageId].api) {
                  this.tabMap[curPage.pageId].api.refresh();
                }
              }} />
            </div>
          }
        >
          {
            pages.map(it => (
              <TabPane
                closable={it.closeable != false}
                tab={<span>{getIcon(it.icon)} {it.name}</span>}
                key={it.pageId}
              >

              </TabPane>
            )
            )
          }
        </Tabs>
      </div>
    );
  }
}

export default RouterTabs