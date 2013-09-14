## form-storage


这是一个辅助功能插件，旨在提高用户填写表单时的工作效率，节省不必要的重复劳动时间。代码量少，功能简单，环保，绿色，节能。

* 版本：1.0
* 教程：[http://gallery.kissyui.com/form-storage/1.0/guide/index.html](http://gallery.kissyui.com/form-storage/1.0/guide/index.html)
* demo：[http://gallery.kissyui.com/form-storage/1.0/demo/index.html](http://gallery.kissyui.com/form-storage/1.0/demo/index.html)
* 作者：舒克(shuke.cl@taobao.com)


### why ?


* 常常遇到表单要填写项太多，填完提交一次如同初中政治考试交卷的感脚，如果中途再去上个厕所回来发现网页被“宠物”给关掉了，停电了，windows蓝屏了…
* 查询表单，查询条件较多，经常需要重复查询想偷懒不想重复输入的情况.
* 开发过程中需要反复测试表单数据完整性时。。。

### Usage

* 保存表单内容到本地，避免丢失和重复填写。
* 可自动保存。
* 可对保存的表单进行备注方便归类。


### Invoke


```javascript
	KISSY.use('gallery/form-storage/1.0/index' , function (S,Fs){
        new Fs({
            node : '#J_Form'
        })
        //一个页面多个表单也可以这样
        //Fs.bind({
        //	selector: 'form'
        //});
        //
        //
	});
```

### Config(element attribute && attribute)

|element attribute|attribute|value|description|
|:---------------|:--------|:----|:----------|
|data-save|无|on   off|启用自动存储，建议form有自己的ID,否则会自动创建，且以后有新表单存在时可能带来数据不能对应的问题|
|data-auto-save|allowAutoSave| on   off|是否启用自动保存功能，启用后会在提交表单以及设定的间隔时间自动进行存储|
|data-auto-save-timer |autoSaveTimer| 300(单位：秒) |Number,自动保存的间隔时间，默认300秒|
|data-auto-save-max|autoSaveMax|5|自动保存的最大条数，默认为5，请不要设置过大，storage只有5M的大小限制|

### Events

|event|param|description|
|:----|:----|:----------|
|restore|e.source:用于回填的数据源 <br/> e.form_id 完成回填的表单id|表单所有项还原完成后触发|
|restoreitem|e.node:完成回填的输入节点(input,select,textarea)|单个表单项值完成回填后触发，常用于有JS交互的表单项|

### Method

|method|param|description|
|:-----|:----|:----------|
|save|要保存的数据 可选|调用后自动保存当前表单内容到本地|






