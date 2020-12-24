import { Layout, Menu, Spin, Icon } from 'antd';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
export default class App extends React.Component<any, any> {
  componentDidMount() {
  }
  renderRoutes = renderRoutes(this.props.route.routes);
  public render() {
    return (
      // <Layout >
      <Content className="demo-layout-content">
        <div>
          <React.Suspense fallback={<div className='demo-layout-content-spin'><Spin size="large" tip="loading..." indicator={<Icon type="loading" spin />} /></div>}>
            {this.renderRoutes}
          </React.Suspense>
        </div>
      </Content>
      // </Layout>

    );
  }
}
