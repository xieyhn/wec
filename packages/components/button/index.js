"use strict";
Component({
    properties: {
        /**
         * 当前值
         */
        value: String,
        /**
         * 数据列表
         */
        list: {
            type: Array,
            value: []
        }
    },
    lifetimes: {
        attached() {
        },
    },
});
