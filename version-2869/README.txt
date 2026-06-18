日韩精选片库静态网站

生成结果：
- 首页：index.html
- 分类总览：categories.html
- 排行榜：ranking.html
- 搜索页：search.html
- 独立分类页：10 个主题分类页 + 完整片库页
- 影片详情页：2000 个，位于 movie/ 目录
- 播放器：详情页已绑定 m3u8 源，并通过 assets/hls-dru42stk.js 初始化 HLS 播放

封面图片：
页面已按要求引用网站顶级目录下的 1.jpg 到 150.jpg。当前上传素材包中未包含这些 JPG 文件，部署时把 1.jpg、2.jpg ... 150.jpg 放在 index.html 同级目录即可显示对应封面和 Hero 图片。

部署方式：
把本目录所有文件上传到静态空间即可。建议通过 HTTP/HTTPS 访问，以确保 ES Module 与 HLS 播放器正常加载。
