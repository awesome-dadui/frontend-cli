let host = window.location.host;

let env = `${/localhost|test/g.test(host)
  ? 'test'
  : (/dev/g.test(host)
    ? 'dev'
    : (/uat/g.test(host))
      ? 'uat'
      : '')}`;

let ajax = CabinX.ajax({withCredentials: true});

function send (type, url, params, loading, notice) {
  loading && (loading = CabinX.loading());

  type === `post` && (params = {param: JSON.stringify(params)});

  let option = {url, params}

  return ajax[`${type}`](option).then((res) => {
    let {code, message, result} = res;
    if (notice && code !== `0000`) {
      CabinX.notice({
        text: `${message || result || '请求异常'}(${code})`,
        status: `error`
      });
    }
    return res;
  }).finally(() => {
    loading && loading.hideLoading()
  })
}

// 封装GET请求
function get (obj) {
  let {url, params, loading = true, notice = true} = obj
  return send('get', url, params, loading, notice)
}

// 封装POST请求
function post (obj) {
  let {url, params, loading = true, notice = true} = obj
  return send('post', url, params, loading, notice)
}

/**
 * 封装POST "文件上传" 请求
 * @example let params = new FormData(); params['file'] = files[0].raw;
 * */
function upload (obj) {
  let {url, params, loading = true, notice = true} = obj

  /*return CabinX.ajax({
    url,
    method: 'post',
    params,
    contentType: 'multipart/form-data',
    crossDomain: true, // 设置跨域为true
    withCredentials: true // 默认情况下，标准的跨域请求是不会发送cookie的
  })*/
  loading && (loading = CabinX.loading());

  return new Promise((resolve, reject) => {
    let formData = new FormData();
    for (let s in params) {
      formData.append(s, params[s]);
    }

    $.ajax({
      url,
      type: 'POST',
      data: formData,
      xhrFields: {
        withCredentials: true
      },
      // 必须false才会自动加上正确的Content-Type
      contentType: false,
      /**
       * 必须 false 才会避开 jQuery 对 formdata 的默认处理
       * XMLHttpRequest 会对 formdata 进行正确的处理
       */
      processData: false,
      success: result => {
        resolve(result)
      },
      error: err => reject(err)
    });
  }).then((res) => {
    let {code, message, result} = res;
    if (notice && code !== `0000`) {
      CabinX.notice({
        text: `${message || result || '请求异常'}(${code})`,
        status: `error`
      });
    }
    return res;
  }).finally(() => {
    loading && loading.hideLoading()
  })
}

// 封装下载请求
function download (obj) {

}

export {
  env,
  get,
  post,
  upload
}
