export default function ajax(data) {
  let {method, url, params, loading = true, notice = true,} = data

  loading && (loading = CabinX.loading())

  return CabinX.ajax({
    withCredentials: true,
  })[method]({
    url: url,
    params: params || {}
  }).then((value) => {
    loading && loading.hideLoading()

    let {code, result, message} = value
    if (code !== '0000') {
      let msg = result || message || '未知异常!!!'
      notice && CabinX.notice({
        text: `${msg}(${code})`,
        status: 'error',
      })
    }
    return value
  }, (reason) => {
    loading && loading.hideLoading()

    // 回调函数中 reason 对象是Error类的实例
    // console.error(`ajax reject:`, reason)
    CabinX.notice({
      text: `${reason.message}\n${reason.stack.slice(0, 1000)}`,
      status: 'error'
    })
    return reason
  })
}

ajax.get = function (url, params) {
  return ajax({method: 'get', url, params})
}

ajax.post = function (url, params) {
  return ajax({method: 'post', url, params})
}

ajax.upload = function (url, params) {
  let formData = new FormData()
  for (let s in params) {
    formData.append(s, params[s])
  }
  return ajax({method: 'post', url, params: formData})
}

let host = window.location.host
let env = `${/localhost|test/g.test(host)
  ? 'test'
  : (/dev/g.test(host)
    ? 'dev'
    : (/uat/g.test(host))
      ? 'uat'
      : '')}`

ajax.env = env