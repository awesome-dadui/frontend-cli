import {env, post, get, upload} from "../ajax"

const HOST = `https://${env}.example.com`

export let listApi = {
  getPath(name) {
    return HOST + `/toolkit/${name}/activityList`
  },
  getActivityList(name, params) {
    let url = HOST + `/toolkit/${name}/activityList`
    return get({url, params})
  },
  postSaveActivity(name, params) {
    let url = HOST + `/toolkit/${name}/saveActivity`
    return post({url, params})
  },
  downloadExportStore(params) {
    window.open(url.exportStore + '?rewardTempId=' + params.rewardTempId + '&rewardCfgId=' + params.rewardCfgId)
  },
  uploadStoreFiles(params) {
    return upload({url: url.uploadStore, params})
  }
}