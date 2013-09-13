## form-storage

* 版本：1.0
* 教程：[http://gallery.kissyui.com/form-storage/1.0/guide/index.html](http://gallery.kissyui.com/form-storage/1.0/guide/index.html)
* demo：[http://gallery.kissyui.com/form-storage/1.0/demo/index.html](http://gallery.kissyui.com/form-storage/1.0/demo/index.html)

基于本地存储实现的表单临时存储

### why ?

适合如下情景之一的便可使用

* 表单要填写项太多，填完点一次提交有交一份政治考试卷的感脚.
* 查询表单，查询条件较多，且每次查询时只有部分条件不一致
* 


### 使用


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

### 通过html配置

|attribute|value|description|
|:-|:-:|-|
|data-save|on \| off|启用自动存储，建议form有自己的ID,否则会自动创建，且以后有新表单存在时可能带来数据不能对应的问题|
|data-auto-save| on \| off|是否启用自动保存功能|
|data-auto-save-timer | 300(单位：秒) |Number,自动保存的间隔时间，默认300秒|
|data-auto-save-max|5|自动保存的最大条数，默认为5，请不要设置过大，storage只有5M的大小限制|







