import * as React from 'react';
// import { AuthorizeDecorator } from 'store/system/authorize';
import Store from './store';
import Action from './views/action';
import Other from './views/other';
import Search from './views/search';
import Table from './views/table';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;


/**
 * 页面入口
 *  Action：页面动作
 *  Details：详情信息，添加，编辑，详情。
 *  Other：其他部件，导入导出
 *  Search：搜索参数
 *  Table：表格
 */
// @AuthorizeDecorator({ PageStore: Store })
export default class App extends React.Component<any, any> {
  render() {
    return (
      <div className="app-page-dataprivilege" key="app-page-dataprivilege">
        <Collapse defaultActiveKey={["1", "2"]}>
          <Panel header="This is panel header 1" key="1">
            <Search {...this.props} />
          </Panel>
          <Panel header="This is panel header 2" key="2">
            <Action.pageAction {...this.props} />
            <Table {...this.props} />
          </Panel>
        </Collapse>
        <Other {...this.props} />
      </div>
    );
  }
}
