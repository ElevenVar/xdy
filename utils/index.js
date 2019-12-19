var filters = {
  toFix: function (value) {
    return value.toFixed(2); //此处2为保留两位小数
  },
  toFixInt: function (value) {
    if (value >= 10) {
      return value;
    } else {
      return '0' + value;
    }
  }
};
module.exports = {
  toFix: filters.toFix,
  toFixInt: filters.toFixInt
};