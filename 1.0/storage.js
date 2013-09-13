KISSY.add(function (S,RichBase,LocalStorage,JSON){
    var E = S.Event;
    var win = window;
    var Storage = RichBase.extend({
        initializer : function (){
            var storage = new LocalStorage();
            var pagesSource;
            if (pagesSource = storage.getItem('formStorage')) {
                try{
                    pagesSource = JSON.parse(pagesSource);
                }
                catch(e){
                    pagesSource = {}
                }
            }else{
                pagesSource = {};
            }
            this.set('pagesSource' , pagesSource);
            this.bindUI();
        },
        destructor : function (){

        },
        renderUI : function (){

        },
        bindUI : function (){
            /**
             * 自动保存
             */
            this.on('afterPagesSourceChange' , function (e){
                var sourceStr = JSON.stringify(this.get('pagesSource'));
                var storage = new LocalStorage();
                storage.setItem('formStorage' , sourceStr);
            },this);
        },
        /**
         * 讲当前
         */
        save : function (pagePath , formId , data){
            var pagesSource = this.get('pagesSource');
            if (!pagesSource[pagePath]) {
                pagesSource[pagePath] = {};
            }
            pagesSource[pagePath][formId] = data;
            this.set('pagesSource' , S.merge({},pagesSource));
        },
        /**
         * 读取本地存储数据
         */
        load : function (pagePath , formId){
            var pageSource = this.get('pagesSource');
            if (!pageSource[pagePath]) {
                return null;
            }
            if (!pageSource[pagePath][formId]) {
                return null;
            }
            return pageSource[pagePath][formId];
        }
    },{
        ATTRS : {
            pagesSource : {
                value : null
            }
        }
    });
    return new Storage();
},{requires : ['rich-base','gallery/offline/1.1/index','json','node' , 'event']});