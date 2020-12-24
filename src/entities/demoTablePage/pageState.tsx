/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2018-09-12 18:52:27
 * @modify date 2018-09-12 18:52:27
 * @desc [description] .
 */
import { Button, Col, List, notification, Row } from 'antd';
// import globalConfig from 'global.config';
import lodash from 'lodash';
import { BindAll, Debounce } from 'lodash-decorators';
import React from 'react';
import { AjaxRequest } from "rxjs/ajax";
import { Request } from '../../utils/request';
import RequestFiles from '../../utils/requestFiles';
import { observable, computed, action, toJS } from 'mobx';
const searchParams = {
    // 过滤条件
    filter: {},
    // 分页参数
    pagination: {
        order: "",  //排序方式
        field: "",  //排序字段
        current: 1, //当前页码
        pageSize: 20, //每页条数
    }
};
@BindAll()
export class PageStore {
    @observable
    private _searchParams = lodash.cloneDeep(searchParams);
    @computed
    public get searchParams() {
        return this._searchParams;
    }
    /**
     * 搜索 参数
     */
    public set searchParams(value) {
        this._searchParams = value;
    }
    /**
     * 重置 搜索 参数
     * @param filter 
     * @param pagination 
     */
    @action
    public onResetSearchParams(filter = {}, pagination = lodash.cloneDeep(searchParams.pagination)) {
        this._searchParams = { filter, pagination };
    }
    /**
     * 重置 搜索 筛选条件  不传 参数 等于清空。
     * @param filter 
     */
    @action
    public onResetSearchParamsFilter(filter = {}) {
        if (lodash.isEqual(filter, {})) {
            return this._searchParams.filter = {};
        }
        if (lodash.isEqual(toJS(this._searchParams.filter), filter)) {
            return
        }
        this._searchParams.filter = { ...filter };
    }
    /** ------------------------------------ */
    @observable
    private _columns = [];
    @computed
    public get columns() {
        return this._columns;
    }
    /**
     * 列配置 用于动态列
     */
    public set columns(value) {
        this._columns = value;
    }
    /** ------------------------------------ */
    @observable
    private _selectedRows = [];
    @computed
    public get selectedRows() {
        return this._selectedRows;
    }
    /**
     * 选择的 行数据
     */
    public set selectedRows(value) {
        this._selectedRows = value;
    }
    /** ------------------------------------ */
    @observable
    private _details = {};
    @computed
    public get details() {
        return this._details;
    }
    /**
     * 数据详情
     */
    public set details(value) {
        this._details = value;
    }
    /** ------------------------------------ */
    @observable
    private _table: any = {
        // total: 0,
        // pageSize: 10,
        // current: 1,
        // dataSource: []
    };
    @computed
    public get table(): {
        total?: number,
        pageSize?: number,
        current?: number,
        dataSource?: any[]
    } {
        return {
            total: lodash.get(this._table, 'total', 0),// this._table.total || 0,
            pageSize: lodash.get(this._table, 'pageSize', lodash.get(this._searchParams, 'pagination.pageSize', 20)),//this._table.pageSize || 10,
            current: lodash.get(this._table, 'current', 1),//this._table.current || 1,
            dataSource: lodash.get(this._table, 'dataSource', []),//this._table.dataSource || []
        };
    }
    /**
     * 表格数据
     */
    public set table(value) {
        this._table = value;
    }
    /** ------------------------------------ */
    @observable
    private _loadingTable = false;
    @computed
    public get loadingTable() {
        return this._loadingTable;
    }
    /**
    * 表格 数据 加载状态
    */
    public set loadingTable(value) {
        this._loadingTable = value;
    }
    /** ------------------------------------ */
    @observable
    private _loadingDetails = false;
    @computed
    public get loadingDetails() {
        return this._loadingDetails;
    }
    /**
    * 详情 数据 加载状态
    */
    public set loadingDetails(value) {
        this._loadingDetails = value;
    }
    /** ------------------------------------ */
    @observable
    private _loadingEdit = false;
    @computed
    public get loadingEdit() {
        return this._loadingEdit;
    }
    /**
    * 编辑 加载状态
    */
    public set loadingEdit(value) {
        this._loadingEdit = value;
    }
    /** ------------------------------------ */
    @observable
    private _loadingDelete = false;
    @computed
    public get loadingDelete() {
        return this._loadingDelete;
    }
    /**
    * 删除 加载状态
    */
    public set loadingDelete(value) {
        this._loadingDelete = value;
    }
    /** ------------------------------------ */
    @observable
    private _loadingImportExport = false;
    @computed
    public get loadingImportExport() {
        return this._loadingImportExport;
    }
    /**
    * 导入 加载状态
    */
    public set loadingImportExport(value) {
        this._loadingImportExport = value;
    }
    /** ------------------------------------ */
    
    @observable
    private _loading = false;
    @computed
    public get loading() {
        return this._loading;
    }
    /**
     * 加载状态
     */
    public set loading(value) {
        this._loading = value;
    }
    /** ------------------------------------ */
}
export default PageStore