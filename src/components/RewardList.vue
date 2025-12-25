<template>
  <div class="mt-10 text-center px-4 w-full">
    <!-- 섹션 타이틀 -->
    <h3
      class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg"
      style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(250,204,21,0.5);"
    >
      • 이벤트 혜택 •
    </h3>

    <!-- 리워드 카드 목록 -->
    <div
      class="flex flex-row items-start justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full"
    >
      <div
        v-for="(reward, index) in rewards"
        :key="reward.id"
        ref="cardRefs"
        class="flex flex-col items-center flex-shrink-0 card-container"
        :style="{ width: 'calc((100% - 2rem) / 3)' }"
        :data-index="index"
      >
        <!-- 카드 뒤집기 컨테이너 -->
        <div class="card-flip-container w-full">
          <!-- 앞면 -->
          <div
            class="card-front relative rounded-xl overflow-hidden shadow-xl w-full
                   h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] cursor-pointer
                   transition-all duration-500 transform-gpu"
            :style="{
              backgroundImage: getImageSrc(reward.image) ? `url(${getImageSrc(reward.image)})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }"
            @mouseenter="onCardHover(index, true)"
            @mouseleave="onCardHover(index, false)"
            @click="flipCard(index)"
          >
            <!-- 호버 시 글로우 효과 -->
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 
                        transition-all duration-300 pointer-events-none glow-overlay"></div>
            
            <!-- 이미지가 없을 때 아이콘 -->
            <div v-if="!getImageSrc(reward.image)" class="absolute inset-0 flex items-center justify-center">
              <span class="text-5xl">🎁</span>
            </div>
          </div>

          <!-- 뒷면 (카드 뒤집기용) -->
          <div
            class="card-back absolute inset-0 rounded-xl overflow-hidden shadow-xl w-full
                   h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] cursor-pointer
                   bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-sm
                   flex items-center justify-center transform rotate-y-180"
            style="backface-visibility: hidden; transform-style: preserve-3d;"
            @click="flipCard(index)"
          >
            <div class="text-white font-bold text-lg sm:text-xl text-center px-4">
              {{ reward.name }}
            </div>
          </div>
        </div>

        <!-- 이름 (카드 밑에 위치) -->
        <div class="mt-3 text-xs sm:text-sm md:text-base font-bold text-white break-keep text-center 
                    drop-shadow-lg w-full" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
          {{ reward.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import type { Reward } from '../services/api'
import coffeeImg from '../assets/images/coffee.png'
import couponImg from '../assets/images/coupon.png'
import premiumImg from '../assets/images/premium.png'

const props = defineProps<{
  rewards: Reward[]
}>()

const cardRefs = ref<(HTMLElement | null)[]>([])
const flippedCards = ref<Set<number>>(new Set())

// 이미지 파일명 매핑
const imageMap: Record<string, string> = {
  'coffee.png': coffeeImg,
  'coupon.png': couponImg,
  'premium.png': premiumImg,
}

const getImageSrc = (imageName: string | undefined): string | undefined => {
  if (!imageName) return undefined
  return imageMap[imageName]
}

// 카드 호버 효과 (확대, 글로우)
const onCardHover = (index: number, isHovering: boolean) => {
  const card = cardRefs.value[index]?.querySelector('.card-front') as HTMLElement
  const glow = card?.querySelector('.glow-overlay') as HTMLElement
  
  if (!card || flippedCards.value.has(index)) return
  
  if (isHovering) {
    gsap.to(card, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out'
    })
    if (glow) {
      gsap.to(glow, {
        background: 'linear-gradient(to bottom right, rgba(250, 204, 21, 0.3), rgba(251, 146, 60, 0.3))',
        duration: 0.3
      })
    }
  } else {
    gsap.to(card, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    if (glow) {
      gsap.to(glow, {
        background: 'linear-gradient(to bottom right, rgba(250, 204, 21, 0), rgba(251, 146, 60, 0))',
        duration: 0.3
      })
    }
  }
}

// 카드 뒤집기
const flipCard = (index: number) => {
  const container = cardRefs.value[index]?.querySelector('.card-flip-container') as HTMLElement
  if (!container) return
  
  const isFlipped = flippedCards.value.has(index)
  
  if (isFlipped) {
    gsap.to(container, {
      rotationY: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    })
    flippedCards.value.delete(index)
  } else {
    gsap.to(container, {
      rotationY: 180,
      duration: 0.6,
      ease: 'power2.inOut'
    })
    flippedCards.value.add(index)
  }
}

onMounted(async () => {
  await nextTick()
  
  // 카드 등장 애니메이션 (순차적으로)
  cardRefs.value.forEach((card, index) => {
    if (card) {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.8,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.7)'
      })
    }
  })
})
</script>

<style scoped>
.card-flip-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card-back {
  transform: rotateY(180deg);
}
</style>


