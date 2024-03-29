/**
 * @Class uni-app Http网络请求库
 * @Author Wang Lihui
 * @Date 2019-09-06
 * */
export default class Http {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.create = this.create.bind(this);
    this.upload = this.upload.bind(this);
  }
  config = {
    baseURL: "",
    method: "GET",
    data: {},
    header: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    dataType: "json",
    success() {},
    fail() {},
    complete() {},
    debug: true
  };
  interceptor = {
    request(config) {
      return config;
    },
    response(res) {
      return res;
    }
  };
  /** 判断url是否为绝对路径 */
  static _posUrl(url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
  }
  /** 获取拼接后的地址 */
  static _jointUrl(url, baseURL) {
    if (/\/$/.test(baseURL) && /^\//.test(url)) {
      url = Http._posUrl(url) ? url : baseURL + url.slice(1);
    } else if (!/\/$/.test(baseURL) && !/^\//.test(url)) {
      url = Http._posUrl(url) ? url : baseURL + "/" + url;
    } else {
      url = Http._posUrl(url) ? url : baseURL + url;
    }
    return url;
  }
  /** 自定义判断元素类型JS */
  static toType(obj) {
    return {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase();
  }
  /** 参数过滤函数 */
  static filterNull(o) {
    for (var key in o) {
      if (o[key] === null) {
        delete o[key];
      }
      if (this.toType(o[key]) === "string") {
        o[key] = o[key].trim();
      } else if (this.toType(o[key]) === "object") {
        o[key] = this.filterNull(o[key]);
      } else if (this.toType(o[key]) === "array") {
        o[key] = this.filterNull(o[key]);
      }
    }
    return o;
  }
  print(...args) {
    if (this.config.debug) {
      console.log.call(
        console,
        `${new Date().toLocaleString()} Http: `,
        ...args
      );
    }
  }
  request(options = {}) {
    // 取消options请求
    // if (uni.getStorageSync("token"))
    //   options.data = { ...options.data, token: uni.getStorageSync("token") };
    if (options.data) {
      options.data = Http.filterNull(options.data);
    }
    options.baseURL = options.baseURL || this.config.baseURL;
    options.url = Http._jointUrl(options.url, options.baseURL);
    options.method = options.method || this.config.method;
    options.data = options.data || {};
    options.header = options.header || this.config.header;
    options.dataType = options.dataType || this.config.dataType;
    return new Promise((resolve, reject) => {
      options.complete = response => {
        let statusCode = response.statusCode;
        response.config = _config;
        response = this.interceptor.response(response) || response;
        if (statusCode === 200) {
          this.print(response);
          resolve(response);
        } else {
          reject(response);
        }
      };
      let origin = { ...this.config, ...options };
      let _config = { ...origin, ...this.interceptor.request(origin) };
      this.print(_config);
      uni.request(_config);
    });
  }

  get(url, data, options = {}) {
    options.url = url;
    options.data = data;
    options.method = "GET";
    return this.request(options);
  }
  post(url, data, options = {}) {
    options.url = url;
    options.data = data;
    options.method = "POST";
    return this.request(options);
  }
  put(url, data, options = {}) {
    options.url = url;
    options.data = data;
    options.method = "PUT";
    return this.request(options);
  }
  delete(url, data, options = {}) {
    options.url = url;
    options.data = data;
    options.method = "DELETE";
    return this.request(options);
  }
  /**
   * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
   * @param {string} url 开发者服务器地址
   * @param {object} formData HTTP 请求中其他额外的 form data
   * @param {string} formData.filePath 要上传文件资源的路径
   * @param {string} [formData.name] 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
   * @param {function} [complete] 接口调用结束的回调函数
   * @returns {UploadTask} `UploadTask` 一个可以监听上传进度进度变化的事件和取消上传的对象
   */
  upload(url, formData,  complete) {
    const { filePath, name = "file", header = {},  ...data } = formData;
    return uni.uploadFile({
      url: Http._jointUrl(url, this.config.baseURL),
      filePath,
      name,
      formData: data,
      header,
      complete(res) {
        if (res.errMsg === "uploadFile:ok") {
          typeof complete === "function" &&
            complete(JSON.parse(res.data || "{}"));
        } else {
          typeof complete === "function" && complete({});
        }
      }
    });
  }

  create(options) {
    let http = new Http();
    return !options ? req : http.request(options);
  }
}
