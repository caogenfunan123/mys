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
