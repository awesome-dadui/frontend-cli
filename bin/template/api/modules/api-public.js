import {env, post, get, upload} from "../ajax";

const HOST = `https://${env}magpie-partner.dmall.com`;
let url = {
  queryOffStoreStock: '/man/task/queryOffStoreStock', // 分页查询门店库存列表接口
  uploadStore: '/man/task/lottery/uploadStore', // 上传门店库存列表
  exportStore: '/man/task/lottery/exportStore', // 下载门店库存接口
  removeStoreStock: '/man/task/removeStoreStock',//删除门店库存接口
  saveStoreStock: '/man/task/saveStoreStock',//删除门店库存接口
  countStoreStock: '/man/task/countStoreStock'
}
Object.keys(url).forEach(key => (url[key] = `${HOST}${url[key]}`))

export let listApi = {
  url,
  getPath (name) {
    return HOST + `/toolkit/${name}/activityList`
  },
  getActivityList (name, params) {
    let url = HOST + `/toolkit/${name}/activityList`;
    return get({url, params});
  },
  postSaveActivity (name, params) {
    let url = HOST + `/toolkit/${name}/saveActivity`;
    return post({url, params});
  },
  downloadExportStore (params) {
    window.open(url.exportStore + '?rewardTempId=' + params.rewardTempId + '&rewardCfgId=' + params.rewardCfgId);
  },
  uploadStoreFiles (params) {
    return upload({url: url.uploadStore, params})
  }
}