/**
 * 基于本地存储实现的表单临时保存功能，支持自动保存，用户自定义保存
 */
KISSY.add(function (S,RichBase , Ajax , Tmpl , Storage){
    var win = window;
    var pagePath = win.location.pathname;
    var historyTmpl = '<ul>{{#each data}}<li class="J_Item" data-index="{{xindex}}">{{#if remark}}<span class="label label-warning">{{/if}}{{remark}}{{#if remark}}</span>{{/if}}  {{title}} <a href="#" class="J_Restore">恢复</a> <a href="#" class="J_EditRemark">备注</a> <a href="#" class="J_DelStorage">删除</a></li>{{/each}}</ul>';
    var FormStorage = RichBase.extend({
        initializer : function (){
            var form = this.get('node');
            var source;
            if (!form) {
                return;
            }
            var formId = this.get('node').attr('id');
            if (!formId) {
                return;
            }

            /*parse html to attribute*/
            this.set('autoSaveTimer' , form.attr('data-auto-save-timer') || this.get('autoSaveTimer'));
            this.set('allowAutoSave' , form.attr('data-auto-save') === 'on' ? true : false);
            this.set('autoSaveMax' , form.attr('data-auto-save-max') || this.get('autoSaveMax'));

            this.renderUI();
            this.bindUI();
            if (source = Storage.load(pagePath,formId)) {
                this.set('source' , source);
            }
        },
        renderUI : function (){
            var form = this.get('node');
            this.controlNode = S.one('<div class="form-storage">' +
                '<p><span class="btn btn-default btn-xs">已启用本地保存</span></p>' +
                '<div class="storage-list">' +
                '<div class=" alert alert-success">' +
                '<button type="button" class="btn btn-xs btn-success J_AddStorage">临时保存</button><a href="#" target="_blank">什么是临时保存?</a>' +
                '<div class="J_History storage-list-content"></div></div>' +
                '</div>' +
                '</div>').insertBefore(form.prop('firstChild'));
            this.listNode = this.controlNode.one('.J_History');
        },
        bindUI : function (){
            var rootNode = this.controlNode;
            var form = this.get('node');
            rootNode.delegate('click' , '.J_DelStorage' , function (e){
                e.preventDefault();
                var index = S.one(e.currentTarget).parent('.J_Item').attr('data-index');
                this.del(index);
            },this);
            rootNode.delegate('click' , '.J_Restore' , function (e){
                e.preventDefault();
                var index = S.one(e.currentTarget).parent('.J_Item').attr('data-index');
                this.dataToForm(this.get('source')[index].data , this.get('node'));
            },this);
            rootNode.delegate('click' , '.J_EditRemark' , function (e){
                e.preventDefault();
                var index = S.one(e.currentTarget).parent('.J_Item').attr('data-index');
                this._edit(index);
            },this);
            this.on('afterSourceChange' , this._syncHistoryUI , this);
            var that = this;
            //手动保存
            form.delegate('click' , '.J_AddStorage' , function (e){
                e.preventDefault();
                this.save();
            },this);
            //自动保存
            if (this.get('allowAutoSave')) {
                var autoTimer = this.get('autoSaveTimer');
                setInterval(function (){
                    /**
                     * 自动保存条数不超过指定条数
                     */
                    var autoCount = 0;
                    var lastAutoIndex = -1;
                    S.each(that.get('source'),function (item,index){
                        if (item.type == 0) {
                            autoCount ++;
                            lastAutoIndex = index;
                        }
                    });
                    if (autoCount > that.get('autoSaveMax')) {
                        that.del(lastAutoIndex);
                    }
                    that.save();
                },1000*autoTimer);
            }
        },
        /**
         * 日期格式转换
         * @param time
         * @returns {{year: *, month: *, date: *, hour: *, minute: *, second: *}}
         * @private
         */
        _getTime :function (time){
            time = new Date(time);
            function toStr(str){
                str = str.toString();
                return str.length < 2 ? 0 + str : str;
            }
            return {
                year  : toStr(time.getFullYear()),
                month : toStr(time.getMonth() + 1),
                date  : toStr(time.getDate()),
                hour  : toStr(time.getHours()),
                minute: toStr(time.getMinutes()),
                second: toStr(time.getSeconds())
            };
        },
        /**
         * 把表单数据作为数组保存起来
         * @param form
         * @returns {Array}
         */
        formToData : function (form){
            var obj =[];
            var str = Ajax.serialize(form);
            S.log(str);
            S.each(str.split('&') , function (item){
                item = item.split('=');
                obj.push(item);
            });
            return obj;
        },
        /**
         * 将数据对象同步到Form
         * @param data
         * @param form
         * @returns {*}
         */
        dataToForm : function (data, form){
            form[0].reset();
            //reset checkbox and radio
            form.all('input[type="radio"],input[type="checkbox"]').each(function (item){
                item.prop('checked', false);
            });
            S.each(data, function (item , index){
                item[1] = decodeURIComponent(item[1]);
                var node = form.one(':input[name='+item[0]+']');
                if (!node) {
                    return;
                }
                if (node.attr('data-storage') === 'off' || (node.hasAttr('type') && node.attr('type').toLowerCase()==='hidden')) {//关闭恢复功能
                    return;
                }
                var nodeType = node.attr('type') && node.attr('type').toLowerCase();
                if(nodeType === 'radio' || nodeType === 'checkbox'){
                    var __node = form.one(':input[name='+item[0]+'][value='+item[1]+']');
                   __node && __node.prop('checked' , true);
                }
                else{
                    node.val(item[1]);
                }
                this.fire('restoreitem' , {
                    node : node
                });
            },this);
            /**
             * 数据发生变更时触发
             * @event sourceChange
             * @param {Object}
             **/
            this.fire('restore',{
                source : this.get('source'),
                srcForm : this.get('node').attr('id')
            });
            return this;
        },
        /**
         * 将对象加入History数组
         * @param object
         * @returns {*}
         */
        save : function (object){
            var data = this.formToData(this.get('node'));
            var time = new Date();
            if (!data) {
                return;
            }
            object = object || {
                type  : 1,//手动添加
                remark: '',
                time  : time,
                data  : data
            };
            var source = this.get('source');
            var form = this.get('form');
            source = source.concat();
            source.unshift(object);
            this.set('source' , source);
            return this;
        },
        /**
         * 从数据源中删除数组
         * @param index
         * @returns {*}
         */
        del : function (index){
            var source = this.get('source');
            var form = this.get('form');
            source = source.concat();
            source.splice(index,1);
            this.set('source' , source);
            return this;
        },
        /**
         * 编辑备注信息
         * @param index
         * @private
         */
        _edit : function (index){
            var remark = prompt('请输入备注名称:');
            if (S.trim(remark)!='') {
                var source = this.get('source').concat();
                source[index].remark = remark;
                source[index].type = 1;//设置为手动
                this.set('source' , source);
            }
        },
        /**
         * 将souce的变更同步到UI
         * @private
         */
        _syncHistoryUI : function (){
            var source = this.get('source');
            source.sort(function (a, b){
                return b.type - a.type ;
            });
            source = S.map(source , function (item){
                if (!item) {
                    return null;
                }
                var typeStr = item.type === 1 ? '手动' : '自动';
                item.title = S.substitute(typeStr + '保存于 {year}-{month}-{date} {hour}:{minute}:{second}',this._getTime(item.time));
                return item;
            },this);
            this.listNode.html(new Tmpl(historyTmpl).render({data: source}));
            Storage.save(pagePath, this.get('node').attr('id'), source);
        },
        destructor : function (){

        }
    },{
        ATTRS : {
            /**
             * 表单节点选择器：必须为form节点
             * @attribute node
             * @type NodeList
             * @default null
             **/
            node: {
                value: null,
                setter : function(val){
                    return S.one(val);
                }
            },
            source :{
                value : []
            },
            /**
             * 是否允许自动保存
             * @attribute allowAutoSave
             * @type Boolean
             * @default false
             **/
            allowAutoSave : {
                value : false
            },
            /**
             * 自动存储的时间间隔,单位：秒
             * @attribute autoSaveTimer
             * @type number
             * @default 5
             **/
            autoSaveTimer : {
                value : 300//秒
            },
            /**
             * 自动存储的最大值
             * @attribute autoSaveMax
             * @type number
             * @default 5
             **/
            autoSaveMax : {
                value : 5
            }
        },
        bind : function (cfg){
            //默认值
            cfg = S.merge({
                selector : 'form',
                callback : null
            });
            S.all(cfg.selector).each(function (form,index){
                if (form.attr('data-save') !== 'on') {
                    return;
                }
                //没有id的补足id
                var form_id = form.attr('id');
                if (!form_id) {
                    form_id = 'J_StorageId' + index ;
                    form.attr('id' , form_id);
                }
                var formStorage = new Form({
                    node : form
                });
                if (S.isFunction(cfg.callback)) {
                    cfg.callback.call(this , formStorage , form_id);
                }

            },this);
        }
    });
    return FormStorage;
},{requires : ['rich-base','ajax','xtemplate','./storage','node' , 'event','sizzle']});