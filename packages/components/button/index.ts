interface Events {
  /**
   * 这是一个事件的备注这是一个事件的备注这是一个事件的备注
   */
  change: { index: string }
}

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
