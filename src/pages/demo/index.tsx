import * as React from 'react';
import { Tabs } from 'antd';
import lodash from 'lodash';

import Search from './view/search';
import Dialog from './view/dialog';
import Table from './view/table';
import request from '../../utils/request';
// request.ajax('/mock/select').toPromise();
// function one(one) {
//     request.ajax('/mock/select?one=' + one).toPromise();
// }
// function two(one, two) {
//     request.ajax(`/mock/select?one=${one}&two=${two}`).toPromise();
// }
// console.log("TCL: one -> one", one)
// console.log("TCL: two -> two", two)


export interface IAppProps {
}
const { TabPane } = Tabs;
export default class App extends React.Component<IAppProps, any> {
    public render() {
        return (
            <Tabs tabPosition="left" >
                <TabPane tab="伸缩表单头" key="1" style={{ paddingRight: 20 }}>
                    <Search />
                </TabPane>
                <TabPane tab="弹框" key="2">
                    <Dialog />
                </TabPane>
                <TabPane tab="表格" key="3">
                    <Table />
                </TabPane>
            </Tabs>
        );
    }
}
