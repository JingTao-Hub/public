
import { Col, Layout, Row, Typography } from 'antd';
import * as React from 'react';
import lodash from 'lodash';
import logo from './images/logo.png';
import code from './images/code.png';
import imgCode from './imgCode';
import './style.scss';
const { Header, Content, Sider, Footer } = Layout;
export class LayoutLogin extends React.Component<{
  links?: React.ReactNodeArray;
  code?: string;
}, any>{
  static ImgCode = imgCode;
  render() {
    return (
      <Layout className="demo-layout-login demo-fade-enter">
        <Main>{this.props.children}</Main>
        <Footer>
          <Row type="flex" align="top" className='demo-login-links'>
            <Col lg={18} md={24}>
              <Typography>
                <Typography.Title>Quick Links</Typography.Title>
                <Typography.Paragraph>
                  <Row type="flex" align="top">
                    {lodash.get(this.props as any, 'links', ['IT Support', 'IDMC', 'BT/IT T2.0', 'User Case Testing', 'Assitant', 'demo Support', 'Web VPN', 'IT Service']).map((value, index) => (
                      <Col key={index} lg={6} md={8} xs={8} sm={12}>
                        {value}
                      </Col>
                    ))}
                  </Row>
                </Typography.Paragraph>
              </Typography>
            </Col>
            <Col lg={6} md={24} className='demo-login-codeimg'>
              <img src={lodash.get(this.props, 'code', code)} alt="" width="88" height="88" />
              <p>IT Service everywhere</p>
              <p>Scan to download</p>
            </Col>
          </Row>
          <div className="demo-login-record">
            Help    Contact us    @2019 demo.All rights reserved
          </div>
        </Footer>
      </Layout>
    );
  }
}
class Main extends React.Component<any, any>{
  state = {
    loginBck: this.onSample(),
    Unmount: false
  }
  onSample() {
    return `demo-login-back-${lodash.sample([1, 2, 3, 4, 5])}`;
  }
  onDelay() {
    if (this.state.Unmount) {
      return
    }
    lodash.delay(() => {
      this.setState({ loginBck: this.onSample() }, () => this.onDelay())
    }, 5000)
  }
  componentDidMount() {
    // this.onDelay()
  }
  componentWillUnmount() {
    this.setState({ Unmount: true })
  }
  render() {
    return (
      <Layout className={this.state.loginBck}>
        <Header>
          <img className='demo-login-logo' src={logo} alt="" width="144" height="48" />
        </Header>
        <Content>
          <div className='demo-login-form'>
            {this.props.children}
          </div>
        </Content>
      </Layout>
    )
  }
}