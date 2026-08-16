// sober 主题站内搜索：构建时生成 search.json（纯脚本，无 npm 依赖）
// 文件由 hexo generate 自动加载执行，输出到 public/search.json
'use strict';

hexo.extend.generator.register('search_json', function (locals) {
  var root = this.config.root || '/';
  var posts = locals.posts.sort('-date');

  var data = posts.map(function (post) {
    var tags = [];
    if (post.tags && post.tags.length) {
      post.tags.each(function (t) { tags.push(t.name); });
    }
    var cats = [];
    if (post.categories && post.categories.length) {
      post.categories.each(function (c) { cats.push(c.name); });
    }
    // 去掉 HTML 标签，生成可搜索纯文本（截取前 3000 字符控制体积）
    var text = (post.content || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    return {
      title: post.title || '',
      date: post.date ? post.date.toISOString().slice(0, 10) : '',
      path: root + post.path,
      tags: tags,
      categories: cats,
      content: text
    };
  });

  return {
    path: 'search.json',
    data: JSON.stringify({ posts: data })
  };
});
