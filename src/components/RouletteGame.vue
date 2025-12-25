<template>
  <div class="mt-12 text-center px-4 w-full">
    <h3
      class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg"
      style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(250,204,21,0.5);"
    >
      • 행운의 룰렛에 도전하세요! •
    </h3>

    <div class="flex flex-col items-center justify-center">
      <div class="relative mb-6" style="filter: drop-shadow(0 0 30px rgba(250, 204, 21, 0.6)) drop-shadow(0 0 60px rgba(250, 204, 21, 0.4));">
        <div class="absolute inset-0 rounded-full border-2 border-yellow-400 pointer-events-none z-10"></div>
        <div class="absolute inset-[8px] rounded-full border-2 border-yellow-400 pointer-events-none z-10"></div>
        
        <canvas
          ref="canvasRef"
          id="canvas"
          :width="canvasSize"
          :height="canvasSize"
          class="rounded-full"
          style="box-shadow: 0 0 30px rgba(250, 204, 21, 0.6), 0 0 60px rgba(250, 204, 21, 0.4), 0 10px 40px rgba(250, 204, 21, 0.3);"
        ></canvas>

        <button
          ref="startButtonRef"
          @click="handleStartClick"
          :disabled="isSpinning"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                 w-16 h-16 sm:w-20 sm:h-20 rounded-full
                 font-bold text-sm sm:text-base border-2
                 disabled:cursor-not-allowed
                 transition-all duration-200
                 flex items-center justify-center aspect-square"
          :style="{
            backgroundColor: isSpinning ? '#9ca3af' : '#ffffff',
            color: isSpinning ? '#4b5563' : '#000000',
            borderRadius: '50%',
            borderColor: isSpinning ? '#9ca3af' : '#facc15',
            boxShadow: isSpinning ? '0 4px 6px rgba(156, 163, 175, 0.3)' : '0 4px 6px rgba(250, 204, 21, 0.5), 0 0 20px rgba(250, 204, 21, 0.3)'
          }"
        >
          START
        </button>

        <div
          class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div class="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-600"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { gsap } from 'gsap'

const Winwheel = (window as any).Winwheel

const canvasRef = ref<HTMLCanvasElement | null>(null)
const startButtonRef = ref<HTMLButtonElement | null>(null)
const wheel = ref<any>(null)
const isSpinning = ref(false)

const canvasSize = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 ? 500 : window.innerWidth >= 640 ? 330 : 290
  }
  return 420
})

onMounted(async () => {
  await nextTick()
  if (!canvasRef.value) return

  if (!Winwheel) {
    console.error('Winwheel is not loaded. Make sure Winwheel.js is loaded in index.html')
    return
  }

  if (typeof window !== 'undefined') {
    const TweenMaxAlias = {
      to: (target: any, duration: number, vars: any) => {
        return gsap.to(target, {
          duration: duration,
          ...vars,
        })
      },
    }
    ;(window as any).TweenMax = TweenMaxAlias
    ;(window as any).TweenLite = TweenMaxAlias
  }

  const canvasId = 'canvas'
  if (canvasRef.value && !canvasRef.value.id) {
    canvasRef.value.id = canvasId
  }

  const size = canvasSize.value
  const centerPos = size / 2

  try {
    console.log('Initializing Winwheel with canvasId:', canvasId, 'size:', size)
    wheel.value = new Winwheel({
      canvasId: canvasId,
      numSegments: 6,
      outerRadius: size / 2 - 10,
      centerX: centerPos,
      centerY: centerPos,
      pointerAngle: -90,
      textFontSize: 14,
      textOrientation: 'curved',
      textAlignment: 'center',
      textMargin: 15,
      lineWidth: 2,
      segments: [
        { fillStyle: '#A78BFA', text: '커피\n기프티콘', size: 60, textFillStyle: '#000000', textFontSize: 14 },
        { fillStyle: '#4ECDC4', text: '할인 쿠폰\n10%', size: 60, textFillStyle: '#000000', textFontSize: 14 },
        { fillStyle: '#FFD93D', text: '프리미엄\n이용원', size: 60, textFillStyle: '#000000', textFontSize: 14 },
        { fillStyle: '#A78BFA', text: '커피\n기프티콘', size: 60, textFillStyle: '#000000', textFontSize: 14 },
        { fillStyle: '#4ECDC4', text: '할인 쿠폰\n10%', size: 60, textFillStyle: '#000000', textFontSize: 14 },
        { fillStyle: '#FFD93D', text: '프리미엄\n이용원', size: 60, textFillStyle: '#000000', textFontSize: 14 },
      ],
      animation: {
        type: 'spinToStop',
        duration: 3,
        spins: 12,
      },
    } as any)

  

    if (wheel.value) {
      wheel.value.draw()
      console.log('Wheel drawn')
    }
  } catch (error) {
    console.error('Winwheel initialization error:', error)
  }
})

const handleStartClick = () => {
  if (isSpinning.value || !wheel.value) return
  
  if (startButtonRef.value) {
    gsap.to(startButtonRef.value, {
      scale: 0.9,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(startButtonRef.value, {
          scale: 1,
          duration: 0.2,
          ease: 'back.out(1.7)'
        })
      }
    })
    
    if (startButtonRef.value) {
      startButtonRef.value.classList.add('glow-effect')
      setTimeout(() => {
        if (startButtonRef.value) {
          startButtonRef.value.classList.remove('glow-effect')
        }
      }, 400)
    }
  }
  
  spinRoulette()
}

const spinRoulette = () => {
  console.log('spinRoulette called', { isSpinning: isSpinning.value, wheel: wheel.value })
  
  if (isSpinning.value || !wheel.value) {
    console.log('Cannot spin:', { isSpinning: isSpinning.value, hasWheel: !!wheel.value })
    return
  }

  isSpinning.value = true

  const randomSegment = Math.floor(Math.random() * 6) + 1
  console.log('Random segment index (1-based):', randomSegment)
  
  const segments = wheel.value.segments
  if (!segments || !segments[randomSegment]) {
    console.error('Invalid segment index:', randomSegment)
    isSpinning.value = false
    return
  }
  
  const targetSegment = segments[randomSegment]
  console.log('Target segment:', targetSegment)
  
  const segmentStartAngle = targetSegment.startAngle || 0
  const segmentEndAngle = targetSegment.endAngle || 0
  const segmentCenterAngle = (segmentStartAngle + segmentEndAngle) / 2
  
  console.log('Segment angles:', { start: segmentStartAngle, end: segmentEndAngle, center: segmentCenterAngle })
  
  const pointerAngle = -90
  let targetRotation = pointerAngle - segmentCenterAngle
  
  targetRotation = ((targetRotation % 360) + 360) % 360
  
  let expectedRelativeAngle = Math.floor(pointerAngle - targetRotation)
  if (expectedRelativeAngle < 0) {
    expectedRelativeAngle = 360 - Math.abs(expectedRelativeAngle)
  }
  
  console.log('Expected relativeAngle:', expectedRelativeAngle, 'segmentCenterAngle:', segmentCenterAngle)
  
  const totalRotation = 360 * 9 + targetRotation
  console.log('Total rotation:', totalRotation, 'targetRotation:', targetRotation)
  
  if (wheel.value) {
    try {
      wheel.value.rotationAngle = 0
      const wheelAny = wheel.value as any
      
      const checkResultAfterAnimation = () => {
        setTimeout(() => {
          if (wheel.value && isSpinning.value) {
            isSpinning.value = false
          }
        }, 200)
      }
      
      if (wheelAny.animation) {
        wheelAny.animation.stopAngle = totalRotation
        wheelAny.animation.callbackFinished = checkResultAfterAnimation
        console.log('Updated animation config:', wheelAny.animation)
      } else {
        wheelAny.animation = {
          type: 'spinToStop',
          duration: 4,
          spins: 9,
          stopAngle: totalRotation,
          callbackFinished: checkResultAfterAnimation
        }
        console.log('Created new animation config:', wheelAny.animation)
      }
      
      const fallbackTimer = setTimeout(() => {
        console.log('Fallback timer triggered - checking result...')
        if (isSpinning.value && wheel.value) {
          checkResultAfterAnimation()
        }
      }, 4500)
      
      const originalCallback = wheelAny.animation.callbackFinished
      wheelAny.animation.callbackFinished = () => {
        clearTimeout(fallbackTimer)
        originalCallback()
      }
      
      console.log('Starting animation...', { 
        stopAngle: totalRotation, 
        randomSegment,
        targetSegment: targetSegment.text,
        animationConfig: wheelAny.animation
      })
      wheel.value.startAnimation()
      console.log('Animation started')
    } catch (error) {
      console.error('Error starting animation:', error)
      isSpinning.value = false
    }
  }
}

onUnmounted(() => {
  if (wheel.value) {
    wheel.value = null
  }
})
</script>

<style scoped>
.glow-effect {
  animation: glowPulse 0.4s ease-in-out;
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 4px 6px rgba(250, 204, 21, 0.5), 0 0 20px rgba(250, 204, 21, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(250, 204, 21, 0.8), 0 0 50px rgba(250, 204, 21, 0.6);
  }
}
</style>
