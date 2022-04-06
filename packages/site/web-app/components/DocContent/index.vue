<template>
  <div ref="containerRef" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import router from '@/router'
import * as compService from '@/services/comp'

export default defineComponent({
  name: 'DocContent',
  setup() {
    const containerRef = ref<HTMLDivElement>()
    const parentElement = ref<HTMLDivElement>()

    async function setComponentDoc(route: RouteLocationNormalizedLoaded) {
      if (!route.name) {
        parentElement.value!.innerHTML = ''
        return
      }
      const { html } = await compService.loadComponentDoc(route.name as string)
      if (!html) {
        parentElement.value!.innerHTML = ''
        return
      }
      parentElement.value!.innerHTML = html
    }

    onMounted(async () => {
      parentElement.value = containerRef.value!.parentElement as HTMLDivElement
      watch(
        () => router.currentRoute.value, 
        route => {
          setComponentDoc(route)
        },
        { immediate: true }
      )
    })

    return {
      containerRef,
    }
  },
})
</script>
