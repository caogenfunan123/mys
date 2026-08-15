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

// 转时间戳（用于精确排序：yml 只有日期按 00:00，文章带具体时间）
hexo.extend.helper.register('dtime', function (d) {
  if (!d) return 0;
  if (typeof d === 'string') {
    var t = new Date(d + 'T00:00:00');
    return isNaN(t.getTime()) ? 0 : t.getTime();
  }
  var dt = new Date(d);
  return isNaN(dt.getTime()) ? 0 : dt.getTime();
});

// 收集全部动态：dynamics.yml 数据 + type:dynamic 的说说文章，按时间戳倒序合并
hexo.extend.helper.register('all_dynamics', function () {
  var self = this;
  var items = [];

  // 1) dynamics.yml 里的动态（Markdown 原文，需要 md() 渲染）
  var data = this.site.data.dynamics || [];
  data.forEach(function (item) {
    items.push({ date: item.date, content: item.content, raw: true });
  });

  // 2) type:dynamic 的说说文章（content 已是渲染后的 HTML）
  this.site.posts.each(function (post) {
    if (post.type === 'dynamic') {
      items.push({
        date: post.date,
        content: post.content,
        raw: false,
        link: self.url_for(post.path),
        title: post.title
      });
    }
  });

  // 按完整时间戳倒序（新的在前；同日期时带具体时间的文章排前面）
  items.sort(function (a, b) {
    return self.dtime(b.date) - self.dtime(a.date);
  });

  return items;
});
