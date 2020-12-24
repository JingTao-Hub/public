/**
 * @author 荆 (https://github.com/JingTao-Hub)
 * @email jingtao8692@gmail.com 
 * @create date 2018-09-12 18:52:27
 * @modify date 2018-09-12 18:52:27
 * @desc [description] .
 */
import { notification, message } from 'antd';
// import globalConfig from 'global.config';
import lodash from 'lodash';
import { BindAll } from 'lodash-decorators';
import { AjaxRequest } from 'rxjs/ajax';
import { Request } from '../../utils/request';
import RequestFiles from '../../utils/requestFiles';
import PageState from './pageState';
import { toJS } from 'mobx';
import { DraggerProps } from 'antd/lib/upload';
export declare namespace ITablePageStore {
	interface ApiRequest {
		/** 搜索 */
		search?: AjaxRequest;
		/** 详情 */
		details?: AjaxRequest;
		/** 添加 */
		insert?: AjaxRequest;
		/** 修改 */
		update?: AjaxRequest;
		/** 删除 */
		delete?: AjaxRequest;
		/** 导入 */
		import?: AjaxRequest;
		/** 导出 */
		export?: AjaxRequest;
		/** 模板 */
		template?: AjaxRequest;
		/** 其他 */
		[key: string]: AjaxRequest;
	}
	/**
   * "filter":{ // 搜索条件
        "[key]":"[value]"
      },
      "pagination":{
        "order":"desc,asc",  //排序方式
        "field":"name,age",  //排序字段
        "current":1, //当前页码
        "pageSize":10, //每页条数
      }
   */
	interface searchParams {}
}
@BindAll()
export class TablePageStore {
	/**
   * 
   * @param target 接口地址
   */
	constructor(public target = '/') {
	}
	/**
   * Api 请求 参数
   */
	apiRequest: ITablePageStore.ApiRequest = {};
	/**
   * 数据管道 Ajax
   */
	Observable = new Request(this.target);

	/**
   * 状态
   */
	PageState = new PageState();
	/**
   * 过滤 空 参数转换
   * @param body 
   * @param deleteNull 删除空属性 
   */
	protected MapValue(body, deleteNull = false) {
		if (!lodash.isObject(body)) {
			return body;
		}
		body = lodash.mapValues(body, (value: any) => {
			switch (true) {
				case lodash.isNil(value):
					value = '';
				case lodash.isString(value):
					value = lodash.trim(value);
			}
			return value;
		});
		if (deleteNull) {
			body = lodash.omitBy(body, (value) => lodash.isNil(value) || lodash.eq(value, ''));
		}
		return body;
	}
	/**
   * 获取 设置的默认 搜索条件
   */
	onGetSearchFilter(filter = {}) {
		return this.MapValue(
			{
				...lodash.get(this.apiRequest.search.body, 'filter'),
				...toJS(this.PageState.searchParams.filter),
				...filter
			},
			true
		);
	}
	/**
   * 搜索
   * @param filter 过滤条件
   * @param pagination 分页参数 
   * @param AjaxRequest 替换默认的 AjaxRequest
   */
	async onSearch(filter = {}, pagination = {}, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingTable) {
				return console.warn('已请求~');
			}
			this.PageState.loadingTable = true;
			const body = {
				// 检索参数
				filter: this.onGetSearchFilter(filter),
				// pagination: { ...pagination }
				// 分页参数
				pagination: { ...this.PageState.searchParams.pagination, ...pagination }
			};
			const res = await this.Observable
				.ajax({
					...this.apiRequest.search,
					...AjaxRequest,
					body
				})
				.toPromise();
			this.PageState.searchParams = body;
			for (var i = 0; i < res.dataSource.length; i++) {
				if (res.dataSource[i].currentDatetime) {
					res.dataSource[i].currentDatetime = res.dataSource[i].currentDatetime.split('T', 10)[0];
				}
			}
			this.PageState.table = res;
			console.log('res-----', res);
			this.PageState.selectedRows = [];
			this.PageState.loadingTable = false;
		} catch (error) {
			console.error(this.apiRequest.search.url, error);
			this.PageState.loadingTable = false;
			throw error;
		}
		// finally {
		//   this.PageState.loadingTable = false;
		// }
	}
	/**
   * 详情
   * @param body 请求体
   * @param AjaxRequest 替换默认的 AjaxRequest
   */
	async onDetails(body, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingDetails) {
				return console.warn('已请求~');
			}
			this.PageState.loadingDetails = true;
			const res = await this.Observable
				.ajax({
					...this.apiRequest.details,
					...AjaxRequest,
					body: this.MapValue({ ...this.apiRequest.details.body, ...body })
				})
				.toPromise();
			this.PageState.details = res;
			this.PageState.loadingDetails = false;
		} catch (error) {
			console.error(this.apiRequest.details.url, error);
			this.PageState.loadingDetails = false;
			throw error;
		}
		// finally {
		//   this.PageState.loadingDetails = false;
		// }
	}
	/**
   * 添加
   * @param body 请求体
   * @param AjaxRequest 替换默认的 AjaxRequest
   */
	async onInsert(body, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingEdit) {
				return console.warn('已请求~');
			}
			this.PageState.loadingEdit = true;
			const res = await this.Observable
				.ajax({
					...this.apiRequest.insert,
					...AjaxRequest,
					body: this.MapValue({ ...this.apiRequest.insert.body, ...body })
				})
				.toPromise();
			notification.success({ message: 'Successful operation' });
			this.PageState.loadingEdit = false;
			return res;
		} catch (error) {
			console.error(this.apiRequest.insert.url, error);
			this.PageState.loadingEdit = false;
			throw error;
		}
	}
	/**
  * 修改
  * @param body 请求体
  * @param AjaxRequest 替换默认的 AjaxRequest
  */
	async onUpdate(body, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingEdit) {
				return console.warn('已请求~');
			}
			this.PageState.loadingEdit = true;
			const res = await this.Observable
				.ajax({
					...this.apiRequest.update,
					...AjaxRequest,
					body: this.MapValue({ ...this.apiRequest.update.body, ...body }, true)
				})
				.toPromise();
			notification.success({ message: 'Successful operation' });
			this.PageState.loadingEdit = false;
			return res;
		} catch (error) {
			console.error(this.apiRequest.update.url, error);
			this.PageState.loadingEdit = false;
			throw error;
		}
	}
	/**
   * 删除
   * @param body 请求体
   * @param AjaxRequest 替换默认的 AjaxRequest
   */
	async onDelete(body: any, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingDelete) {
				return console.warn('已请求~');
			}
			this.PageState.loadingDelete = true;
			const res = await this.Observable
				.ajax({
					...this.apiRequest.delete,
					...AjaxRequest,
					body: this.MapValue({ ...this.apiRequest.delete.body, ...body }, true)
				})
				.toPromise();
			notification.success({ message: 'Successful operation' });
			this.PageState.loadingEdit = false;
			return res;
		} catch (error) {
			console.error(this.apiRequest.delete.url, error);
			this.PageState.loadingEdit = false;
			throw error;
		}
	}
	/**
   * 导入
   * @param body 请求体
   * @param AjaxRequest 替换默认的 AjaxRequest
   */
	async onImport(body?, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingImportExport) {
				return console.warn('已请求~');
			}
			this.PageState.loadingImportExport = true;
			const res = await this.Observable.ajax({
				...this.apiRequest.import,
				...AjaxRequest,
				body: this.MapValue({ ...this.apiRequest.import.body, ...body }, true)
			});
			notification.success({ message: 'Successful operation' });
			this.PageState.loadingImportExport = false;
			return res;
		} catch (error) {
			console.error(this.apiRequest.import.url, error);
			this.PageState.loadingImportExport = false;
			throw error;
		}
	}
	/**
   * 导入 DraggerProps
   */
	onImportDraggerProps(props?: DraggerProps): DraggerProps {
		return {
			name: 'file',
			// multiple: true,
			showUploadList: false,
			// accept: ".xlsx,.xls",
			action: Request.compatibleUrl(this.target, lodash.get(this.apiRequest.import, 'url')), //RequestFiles.FileTarget,
			onChange: (info) => {
				const status = info.file.status;
				if (status !== 'uploading') {
				}
				if (status === 'done') {
					const response = info.file.response;
					if (typeof response.Id === 'string') {
						this.onImport(response.Id);
					} else {
						message.error(`${info.file.name} ${response.message}`);
					}
				} else if (status === 'error') {
					message.error(`${info.file.name} Import error`);
				}
			},
			onRemove: (file) => {
				const response = file.response;
				if (typeof response.Id === 'string') {
					// RequestFiles.onFileDelete(response.Id)
				}
			},
			...props
		};
	}
	/**
   * 导出
   * @param body 筛选参数
   * @param AjaxRequest 替换默认的 AjaxRequest
   */
	async onExport(body?, AjaxRequest: AjaxRequest = {}) {
		try {
			if (this.PageState.loadingImportExport) {
				return console.warn('已请求~');
			}
			this.PageState.loadingImportExport = true;
			await RequestFiles.download({
				...this.apiRequest.export,
				...AjaxRequest,
				url: Request.compatibleUrl(this.target, this.apiRequest.export.url),
				body: { ...this.apiRequest.export.body, ...body }
			});
		} catch (error) {
			console.error(this.apiRequest.export.url, error);
			this.PageState.loadingImportExport = false;
			throw error;
		}
	}
	/**
  * 数据模板
  *  @param AjaxRequest 替换默认的 AjaxRequest
  */
	async onTemplate(AjaxRequest: AjaxRequest = {}) {
		await RequestFiles.download({
			...this.apiRequest.template,
			...AjaxRequest,
			url: Request.compatibleUrl(this.target, this.apiRequest.template.url)
		});
	}
}
export default ITablePageStore;
