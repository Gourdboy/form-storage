/**
 * @fileoverview 
 * @author 舒克<shuke.cl@taobao.com>
 * @module form-storage
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Form-storage
     * @constructor
     * @extends Base
     */
    function Form-storage(comConfig) {
        var self = this;
        //调用父类构造函数
        Form-storage.superclass.constructor.call(self, comConfig);
    }
    S.extend(Form-storage, Base, /** @lends Form-storage.prototype*/{

    }, {ATTRS : /** @lends Form-storage*/{

    }});
    return Form-storage;
}, {requires:['node', 'base']});



