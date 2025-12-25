<template>
  <div class="text-center m-12 w-full flex flex-col items-center justify-center px-4 mx-auto">
    <!-- 메인 제목 (API title) -->
    <h1
      ref="titleRef"
      class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] break-keep w-full"
      :style="titleShadowStyle"
    >
      {{ title }}
    </h1>

    <!-- 설명 텍스트 (API description) -->
    <p
      ref="descriptionRef"
      class="m-4 text-base sm:text-lg md:text-xl text-yellow-400 font-medium drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] px-6 py-3 break-keep mx-auto"
      :style="subtitleWithBorderStyle"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  title: string
  description: string
}>()

const titleRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)

// 공통 스타일 정의
const titleShadowStyle = {
  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
}

const subtitleWithBorderStyle = {
  textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)',
  borderTop: '2px solid white',
  borderBottom: '2px solid white',
  borderLeft: 'none',
  borderRight: 'none',
}

onMounted(async () => {
  await nextTick()
  
  // 제목과 설명 텍스트 등장 애니메이션
  if (titleRef.value) {
    gsap.from(titleRef.value, {
      opacity: 0,
      y: -30,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out'
    })
  }
  
  if (descriptionRef.value) {
    gsap.from(descriptionRef.value, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out'
    })
  }
})
</script>

