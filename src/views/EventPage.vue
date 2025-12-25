<template>
  <div
    class="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
 
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- 로딩 화면 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <!-- 로딩 스피너 -->
        <div class="relative w-20 h-20 mx-auto mb-4">
          <div
            class="absolute inset-0 border-4 border-yellow-400/30 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin"
          ></div>
        </div>
        <!-- 로딩 텍스트 -->
        <p class="text-white text-xl font-bold drop-shadow-lg">
          이벤트 정보를 불러오는 중...
        </p>
      </div>
    </div>

    <!-- 에러 화면 -->
    <div
      v-else-if="!event && hasError"
      class="absolute inset-0 flex items-center justify-center z-50"
    >
      <div class="text-center px-4 max-w-md">
        <!-- 에러 아이콘 -->
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              class="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <!-- 에러 메시지 -->
        <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">
          데이터를 불러올 수 없습니다
        </h2>
        <p class="text-white/80 text-lg mb-8 drop-shadow-md">
          네트워크 연결을 확인하거나<br />잠시 후 다시 시도해주세요.
        </p>
        <!-- 새로고침 버튼 -->
        <button
          @click="retryFetch"
          class="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          🔄 새로고침
        </button>
      </div>
    </div>

    <!-- 중앙 콘텐츠 컬럼 -->
    <div
      v-else-if="event"
      class="p-4 w-full max-w-[480px] flex flex-col items-center justify-center text-center"
    >
      <div ref="headerRef">
        <EventHeader
          :title="event?.title ?? '신규 서비스 오픈 기념 이벤트'"
          :description="event?.description ?? '지금 응모하고 특별한 혜택을 받아가세요!'"
        />
      </div>
      <div ref="timerRef" class="mt-8">
        <CountdownTimer :end-date="event?.endDate" />
      </div>
      <div
        v-if="event"
        ref="rewardRef"
        class="mt-10"
      >
        <RewardList :rewards="event.rewards" />
      </div>
      <div ref="rouletteRef" class="mt-16">
        <RouletteGame />
      </div>
      <div ref="entryFormRef" class="mt-20">
        <EntryForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import EventHeader from '../components/EventHeader.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import RewardList from '../components/RewardList.vue'
import RouletteGame from '../components/RouletteGame.vue'
import EntryForm from '../components/EntryForm.vue'
import { fetchEvent, type EventData } from '../services/api'
import bgImage from '../assets/images/eventPage-bg.png'

const event = ref<EventData | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const headerRef = ref<HTMLElement | null>(null)
const timerRef = ref<HTMLElement | null>(null)
const rewardRef = ref<HTMLElement | null>(null)
const rouletteRef = ref<HTMLElement | null>(null)
const entryFormRef = ref<HTMLElement | null>(null)

const loadEvent = async () => {
  isLoading.value = true
  hasError.value = false
  
  try {
    event.value = await fetchEvent()
    if (!event.value) {
      hasError.value = true
    }
  } catch (error) {
    console.error('Failed to fetch event:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const retryFetch = async () => {
  await loadEvent()
  
  if (event.value) {
    await nextTick()
    
    // 초기 상태 설정 (애니메이션 전에 보이지 않게)
    if (headerRef.value) {
      gsap.set(headerRef.value, { opacity: 0, y: -30 })
    }
    if (timerRef.value) {
      gsap.set(timerRef.value, { opacity: 0, y: 30 })
    }
    if (rewardRef.value) {
      gsap.set(rewardRef.value, { opacity: 0, y: 30 })
    }
    if (rouletteRef.value) {
      gsap.set(rouletteRef.value, { opacity: 0, y: 30 })
    }
    
    // 섹션별 등장 애니메이션 (fade-in, slide-up)
    const timeline = gsap.timeline()
    
    if (headerRef.value) {
      timeline.to(headerRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
    }
    
    if (timerRef.value) {
      timeline.to(timerRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
    }
    
    if (rewardRef.value) {
      timeline.to(rewardRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
    }
    
    if (rouletteRef.value) {
      timeline.to(rouletteRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
    }
  }
}

onMounted(async () => {
  await loadEvent()
  
  await nextTick()
  
  // 초기 상태 설정 (애니메이션 전에 보이지 않게)
  if (headerRef.value) {
    gsap.set(headerRef.value, { opacity: 0, y: -30 })
  }
  if (timerRef.value) {
    gsap.set(timerRef.value, { opacity: 0, y: 30 })
  }
  if (rewardRef.value) {
    gsap.set(rewardRef.value, { opacity: 0, y: 30 })
  }
  if (rouletteRef.value) {
    gsap.set(rouletteRef.value, { opacity: 0, y: 30 })
  }
  if (entryFormRef.value) {
    gsap.set(entryFormRef.value, { opacity: 0, y: 30 })
  }
  
  // 섹션별 등장 애니메이션 (fade-in, slide-up)
  const timeline = gsap.timeline()
  
  if (headerRef.value) {
    timeline.to(headerRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
  
  if (timerRef.value) {
    timeline.to(timerRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
  }
  
  if (rewardRef.value) {
    timeline.to(rewardRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
  }
  
  if (rouletteRef.value) {
    timeline.to(rouletteRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
  }
  
  if (entryFormRef.value) {
    timeline.to(entryFormRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
  }
})
</script>
