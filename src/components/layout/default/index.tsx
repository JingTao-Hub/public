import * as React from 'react';
import Content from "./views/content";
import Header from "./views/header";
import Sider from "./views/sider";
import Store from "./store";
import { Observable } from 'rxjs';
import { Layout, Spin, Icon } from 'antd';
import './style.scss'
import { renderRoutes } from 'react-router-config';
declare type menu = {
  id: any;
  parentId?: any;
  icon?: React.ReactNode;
  /** 标题 */
  title: React.ReactNode;
  /** 地址 */
  path?: string;
  children?: menu[];
}
interface ILayoutProps {
  /** 系统名称 */
  title?: React.ReactNode;
  /** 
   * 菜单数据 
   * */
  menus?: any[];
  /**
   * 菜单树
   */
  menusTree?: any[];
  /**
   * 菜单宽度
   */
  menusWidth?: number;
  /**
   * 用户信息
   */
  user?: {
    name: React.ReactNode;
    menu: React.ReactNode;
  }
  /**
   * 搜索
   */
  search?: {
    /**
     * value 更改函数
     */
    onChange: (value: any) => void | Observable<any[]> | any[] | Promise<any[]>;
    /**
     * 
     */
    onItemClick?: (value: any) => void;
    /**
     * 渲染 列表组件
     */
    body?: React.ReactNode;
  }
}
/**
 * 默认布局
 */
export class LayoutDefault extends React.Component<ILayoutProps, any> {
  onClick = event => {
    if (Store.menuMode === "horizontal" && !Store.collapsed) {
      Store.onCollapsed();
    }
  }
  public render() {
    return (
      <Layout onClick={this.onClick} className='demo-layout-main demo-fade-enter'>
        <Header {...this.props} />
        <Sider {...this.props} mode="inline" />
        <Content  {...this.props} />
      </Layout>
    );
  }
}
/**
 * 外部页面布局
 */
export class LayoutOuter extends React.Component<any, any> {
  UNSAFE_componentWillMount() {
    if (document.body.classList) {
      document.body.classList.add('demo-layout-outer')
    }
  }
  componentWillUnmount() {
    if (document.body.classList) {
      document.body.classList.remove('demo-layout-outer')
    }
  }
  renderRoutes = renderRoutes(this.props.route.routes);
  public render() {
    return (
      <React.Suspense fallback={<LayoutSpin />}>
        {this.renderRoutes}
      </React.Suspense>
    );
  }
}
export const LayoutSpin = () => <div className='demo-layout-outer-spin'><Spin size="large" tip="loading..." indicator={<Icon type="loading" spin />} /></div>;
export default LayoutDefault