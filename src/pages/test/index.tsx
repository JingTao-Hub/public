import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';
// @observer
export default class App extends React.Component<any, any> {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>测试页面 参数：{this.props.match.params.id}</div>
        </header>
      </div>
    );
  }
}
