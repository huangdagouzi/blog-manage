export default {
    formatDate(dateTime) {
        // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
        if (!dateTime) {
            return '';
        } else {
            var timeStamp = new Date(Number(dateTime));
            var year = timeStamp.getFullYear(),
                month = ('0' + (timeStamp.getMonth() + 1)).slice(-2),
                date = ('0' + timeStamp.getDate()).slice(-2),
                hour = ('0' + timeStamp.getHours()).slice(-2),
                minute = ('0' + timeStamp.getMinutes()).slice(-2),
                second = ('0' + timeStamp.getSeconds()).slice(-2);
            // 拼接
            var result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
            // 返回
            return result;
        }
    },
    fullTime(data) {
      let date = new Date(Number(data));
      let year = date.getFullYear() + "-";
      let month =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let day =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      return year + month + day;
    },
};
