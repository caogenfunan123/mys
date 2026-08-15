// sober 主题辅助函数
// 注册 markdown 渲染 helper，用于动态/友链等数据文件的 markdown 内容渲染
hexo.extend.helper.register('md', function (content) {
  if (!content) return '';
  try {
    return hexo.render.renderSync({ text: content, engine: 'markdown' });
  } catch (e) {
    return content;
  }
});

// 格式化动态日期：YAML 的 date 字段会被解析成 Date 对象，这里统一转成 YYYY-MM-DD
hexo.extend.helper.register('ddate', function (d) {
  if (!d) return '';
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  if (typeof d === 'string') return d;
  var dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d);
  return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
});
