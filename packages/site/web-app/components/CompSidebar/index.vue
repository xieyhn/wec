<template>
  <div class="sidebar">
    <section v-for="item in sidebarMenu" :key="item.title" class="sidebar-group">
      <p class="sidebar-group__title">{{ item.title }}</p>
      <router-link v-for="i in item.items" :key="i.name" class="link" :to="{ name: i.name }">
        <p class="link-text">{{ i.title }}</p>
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useAppStore from '@/store/app'

export default defineComponent({
  name: 'CompSidebar',
  setup() {
    const appStore = useAppStore()
    return {
      sidebarMenu: appStore.compSidebarMenu
    }
  }
})
</script>

<style scoped lang="scss">
.sidebar {
  width: 300px;
  height: calc(100vh - 55px);
  overflow-y: auto;
  padding: 32px 32px 96px;
  border-right: 1px solid #dcdfe6;
  position: fixed;
  left: 0;
  top: 55px;

  .sidebar-group {
    & + .sidebar-group {
      margin-top: 24px;
    }
    .sidebar-group__title {
      font-size: 18px;
      font-weight: 500;
      padding: 6px 0;
    }
    .link {
      margin-left: 8px;
      padding: 10px 0;
      color: #606266;

      &:hover,
      &.router-link-active {
        color: #006eff;
      }

      .link-text {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: inherit;
        transition: color .5s;
      }
    }
  }
}
</style>
