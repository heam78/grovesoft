<template>
  <div ref="timerContainerRef" class="text-center px-4">
    <!-- 섹션 제목: 양쪽에 점이 있는 선 -->
    <div class="flex items-center justify-center mb-6">
      <span class="text-white/60 text-2xl mx-2">•</span>
      <div class="h-px bg-white/30 w-32"></div>
      <h2 
        class="text-xl text-white font-semibold mx-4 whitespace-nowrap drop-shadow-lg" 
        style="text-shadow: 2px 2px 4px rgba(250,204,21,0.8), 0 0 8px rgba(250,204,21,0.5);"
      >
        이벤트 종료까지 남은 시간
      </h2>
      <div class="h-px bg-white/30 w-32"></div>
      <span class="text-white/60 text-2xl mx-2">•</span>
    </div>
    
    <!-- 타이머: 카드 형태의 시간 박스 (반응형, 줄바꿈 방지) -->
    <div class="flex flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 overflow-x-auto w-full">
      <!-- 일 -->
      <div class="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 border border-white/20 shadow-lg min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[100px] flex-shrink-0">
        <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center drop-shadow-lg" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          {{ formattedDays }} 
        </div>
        <div class="text-xs sm:text-sm md:text-base text-white mt-1 sm:mt-2 font-medium text-center drop-shadow-md" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">일</div>
      </div>

      <!-- 콜론 -->
      <span class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg flex-shrink-0" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">:</span>

      <!-- 시간 -->
      <div class="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 border border-white/20 shadow-lg min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[100px] flex-shrink-0">
        <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center drop-shadow-lg" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          {{ formattedHours }}
        </div>
        <div class="text-xs sm:text-sm md:text-base text-white mt-1 sm:mt-2 font-medium text-center drop-shadow-md" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">시</div>
      </div>

      <!-- 콜론 -->
      <span class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg flex-shrink-0" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">:</span>

      <!-- 분 -->
      <div class="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 border border-white/20 shadow-lg min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[100px] flex-shrink-0">
        <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center drop-shadow-lg" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          {{ formattedMinutes }}
        </div>
        <div class="text-xs sm:text-sm md:text-base text-white mt-1 sm:mt-2 font-medium text-center drop-shadow-md" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">분</div>
      </div>

      <!-- 콜론 -->
      <span class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg flex-shrink-0" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">:</span>

      <!-- 초 -->
      <div class="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 border border-white/20 shadow-lg min-w-[60px] sm:min-w-[70px] md:min-w-[80px] lg:min-w-[100px] flex-shrink-0">
        <div class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center drop-shadow-lg" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          {{ formattedSeconds }}
        </div>
        <div class="text-xs sm:text-sm md:text-base text-white mt-1 sm:mt-2 font-medium text-center drop-shadow-md" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">초</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

// 상수 정의
const INITIAL_DAYS = 10
const SECONDS_PER_DAY = 24 * 60 * 60
const INTERVAL_MS = 1000

const props = defineProps<{
  endDate?: string
}>()

// 남은 초 계산 (API endDate 기준, 없으면 기본 10일)
const calcRemainingSeconds = () => {
  if (!props.endDate) {
    return INITIAL_DAYS * SECONDS_PER_DAY
  }
  console.log(props.endDate)
  const target = new Date(props.endDate).getTime()
  const now = Date.now()
  const diff = Math.floor((target - now) / 1000)
  return diff > 0 ? diff : 0
}

// 상태
const totalSeconds = ref(calcRemainingSeconds())
const timerContainerRef = ref<HTMLElement | null>(null)
let timer: number | undefined

// 시간 계산
const days = computed(() => Math.floor(totalSeconds.value / SECONDS_PER_DAY))
const hours = computed(() => Math.floor((totalSeconds.value % SECONDS_PER_DAY) / 3600))
const minutes = computed(() => Math.floor((totalSeconds.value % 3600) / 60))
const seconds = computed(() => totalSeconds.value % 60)

// 포맷된 시간 값
const formattedDays = computed(() => String(days.value).padStart(2, '0'))
const formattedHours = computed(() => String(hours.value).padStart(2, '0'))
const formattedMinutes = computed(() => String(minutes.value).padStart(2, '0'))
const formattedSeconds = computed(() => String(seconds.value).padStart(2, '0'))

// 라이프사이클
onMounted(async () => {
  await nextTick()
  
  // 타이머 등장 애니메이션
  if (timerContainerRef.value) {
    gsap.from(timerContainerRef.value, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
  
  timer = window.setInterval(() => {
    totalSeconds.value = calcRemainingSeconds()
  }, INTERVAL_MS)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
  