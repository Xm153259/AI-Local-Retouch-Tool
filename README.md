# 小懋AI 局部编辑助手 — Photoshop CEP 扩展

## 功能
- 导出当前选区为 PNG，保存原画布尺寸和切片坐标到桌面，并对原文档执行保留隐藏像素的非破坏性裁切。
- 使用 Photoshop 的 Reveal All（显示全部）命令恢复非破坏性裁切隐藏的画布区域。
- 面板增加蓝紫渐变 AI Logo，以及导出、恢复两个按钮的配套线性图标。

## Windows 安装
1. 关闭 Photoshop。
2. 将 `com.aiedit.cropper` 文件夹复制到：
   `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
3. 重启 Photoshop，在 **窗口 > 扩展（旧版）** 中查找 **小懋AI 局部编辑与恢复**。

## macOS 安装
将 `com.aiedit.cropper` 文件夹复制到：
`/Library/Application Support/Adobe/CEP/extensions/`
然后重启 Photoshop。

## 面板大小调整
- 在 Photoshop 中打开插件面板后，将鼠标移到面板边缘或右下角，拖动即可调整宽度和高度。
- 默认面板尺寸为 320 × 360，最小尺寸为 220 × 190；内容会随面板宽度自适应，空间不足时可滚动查看。
- Photoshop 停靠面板的可调整范围也受 Photoshop 工作区布局影响。

## 使用
1. 打开图片并使用矩形选框等工具建立有效选区。
2. 点击“导出选区 PNG 并非破坏性裁切”。
3. 对桌面生成的 PNG 进行 AI 修改，建议保持像素宽高不变。
4. 点击“恢复裁切前的画布范围”。
5. 将修改后的图片置入原文档，依据坐标记录中的 `left` 和 `top` 定位，再通过蒙版融合。

## 注意
- 本插件按 CEP 扩展结构打包，未在当前环境的真实 Photoshop 中实机验证。
- 若 Photoshop 未显示 CEP 扩展入口，可能与版本或 CEP 扩展签名设置有关。
- 当前版本不会自动导入 AI 修改后的 PNG 并自动定位；导入定位可在后续版本继续增加。
