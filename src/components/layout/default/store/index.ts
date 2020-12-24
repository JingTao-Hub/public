import { observable, action } from "mobx";
import { create, persist } from 'mobx-persist';
const hydrate = create({
    storage: window.localStorage,   // 存储的对象
    jsonify: true, // 格式化 json
    debounce: 1000,
});
class Store {
    constructor() {
        hydrate('Demo_layout', this)
            // post hydration
            .then(() => { })
    }
    /**
     * 菜单模式 
     * @horizontal 横向
     * @inline 竖向
     */
    @persist
    @observable
    menuMode: "horizontal" | "inline" = "inline";
    /**
     * 菜单 展开收起
     */
    @observable collapsed: boolean = true;
    @action
    onCollapsed(collapsed = !this.collapsed) {
        this.collapsed = collapsed;
        // 主动触发 浏览器 resize 事件
        // dispatchEvent(new CustomEvent('resize'));
    }
    /**
     * 搜索
     */
    @observable isSearch = false;
    @action
    onOpenSearch(isSearch = !this.isSearch) {
        this.isSearch = isSearch;
    }
}
export default new Store();