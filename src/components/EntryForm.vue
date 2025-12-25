<template>
  <div ref="formRef" class="mt-20 text-center px-4 w-full max-w-md mx-auto">
    <!-- 섹션 타이틀 -->
    <h3
      class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 drop-shadow-lg"
      style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(250,204,21,0.5);"
    >
      • 이벤트 응모하기 •
    </h3>

    <!-- 성공 메시지 -->
    <div
      v-if="isSuccess"
      class="mb-6 p-6 bg-green-500/20 border-2 border-green-400 rounded-xl backdrop-blur-sm"
    >
      <div class="flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <p class="text-green-400 font-bold text-lg">응모가 완료되었습니다!</p>
      </div>
      <p class="text-white/80 text-sm mb-4">감사합니다. 당첨 결과는 추후 연락드리겠습니다.</p>
      
      <!-- URL 복사 버튼 -->
      <button
        @click="copyUrl"
        class="w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg
               transition-all duration-200 transform hover:scale-105 active:scale-95
               flex items-center justify-center gap-2"
        style="box-shadow: 0 4px 6px rgba(250, 204, 21, 0.5), 0 0 20px rgba(250, 204, 21, 0.3);"
      >
        <svg v-if="!urlCopied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ urlCopied ? 'URL이 복사되었습니다!' : 'URL 복사하기' }}</span>
      </button>
    </div>

    <!-- 에러 메시지 -->
    <div
      v-if="submitError"
      class="mb-6 p-6 bg-red-500/20 border-2 border-red-400 rounded-xl backdrop-blur-sm"
    >
      <div class="flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <p class="text-red-400 font-bold text-lg">제출 실패</p>
      </div>
      <p class="text-white/80 text-sm">{{ submitError }}</p>
    </div>

    <!-- 응모 폼 -->
    <form
      v-if="!isSuccess"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <!-- 이름 입력 -->
      <div class="text-left">
        <label for="name" class="block text-white font-semibold mb-2 drop-shadow-md">
          이름 <span class="text-red-400">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="이름을 입력하세요"
          class="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30
                 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400
                 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
          :class="{ 'border-red-400': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-red-400 text-sm">{{ errors.name }}</p>
      </div>

      <!-- 연락처 입력 -->
      <div class="text-left">
        <label for="phone" class="block text-white font-semibold mb-2 drop-shadow-md">
          연락처 <span class="text-red-400">*</span>
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          placeholder="010-1234-5678"
          class="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30
                 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400
                 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
          :class="{ 'border-red-400': errors.phone }"
        />
        <p v-if="errors.phone" class="mt-1 text-red-400 text-sm">{{ errors.phone }}</p>
      </div>

      <!-- 이메일 입력 -->
      <div class="text-left">
        <label for="email" class="block text-white font-semibold mb-2 drop-shadow-md">
          이메일 <span class="text-red-400">*</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="example@email.com"
          class="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30
                 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400
                 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-200"
          :class="{ 'border-red-400': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-red-400 text-sm">{{ errors.email }}</p>
      </div>

      <!-- 약관 동의 -->
      <div class="text-left">
        <label class="flex items-start cursor-pointer">
          <input
            v-model="formData.agreeTerms"
            type="checkbox"
            class="mt-1 w-5 h-5 rounded border-2 border-white/30 bg-white/10
                   focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400
                   transition-all duration-200 cursor-pointer"
            :class="{ 'border-red-400': errors.agreeTerms }"
          />
          <span class="ml-3 text-white text-sm drop-shadow-md">
            개인정보 수집 및 이용에 동의합니다 <span class="text-red-400">*</span>
          </span>
        </label>
        <p v-if="errors.agreeTerms" class="mt-1 text-red-400 text-sm">{{ errors.agreeTerms }}</p>
      </div>

      <!-- 제출 버튼 -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg
               rounded-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-200 transform hover:scale-105 active:scale-95
               disabled:hover:scale-100"
        style="box-shadow: 0 4px 6px rgba(250, 204, 21, 0.5), 0 0 20px rgba(250, 204, 21, 0.3);"
      >
        <span v-if="!isSubmitting">응모하기</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          제출 중...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { submitEntry, type EntryFormData } from '../services/api'

const formRef = ref<HTMLElement | null>(null)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const submitError = ref<string | null>(null)
const urlCopied = ref(false)

const ENTRY_STORAGE_KEY = 'event_entry_submitted'

const formData = reactive<EntryFormData>({
  name: '',
  phone: '',
  email: '',
  agreeTerms: false,
})

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  agreeTerms: '',
})

// 유효성 검사
const validateForm = (): boolean => {
  let isValid = true
  
  // 이름 검사
  if (!formData.name.trim()) {
    errors.name = '이름을 입력해주세요.'
    isValid = false
  } else if (formData.name.trim().length < 2) {
    errors.name = '이름은 2자 이상 입력해주세요.'
    isValid = false
  } else {
    errors.name = ''
  }

  // 연락처 검사
  const phoneRegex = /^010-?\d{4}-?\d{4}$/
  if (!formData.phone.trim()) {
    errors.phone = '연락처를 입력해주세요.'
    isValid = false
  } else if (!phoneRegex.test(formData.phone.replace(/-/g, ''))) {
    errors.phone = '올바른 연락처 형식이 아닙니다. (예: 010-1234-5678)'
    isValid = false
  } else {
    errors.phone = ''
  }

  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = '이메일을 입력해주세요.'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
    isValid = false
  } else {
    errors.email = ''
  }

  // 약관 동의 검사
  if (!formData.agreeTerms) {
    errors.agreeTerms = '약관에 동의해주세요.'
    isValid = false
  } else {
    errors.agreeTerms = ''
  }

  return isValid
}

// URL 복사
const copyUrl = async () => {
  try {
    const currentUrl = window.location.href
    await navigator.clipboard.writeText(currentUrl)
    urlCopied.value = true
    
    setTimeout(() => {
      urlCopied.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to copy URL:', error)
    alert('URL 복사에 실패했습니다. 브라우저를 확인해주세요.')
  }
}

// 중복 응모 체크
const checkDuplicateEntry = (): boolean => {
  const submitted = localStorage.getItem(ENTRY_STORAGE_KEY)
  if (submitted) {
    try {
      const data = JSON.parse(submitted)
      const submittedEmail = data.email?.toLowerCase()
      const submittedPhone = data.phone?.replace(/-/g, '')
      const currentEmail = formData.email.trim().toLowerCase()
      const currentPhone = formData.phone.trim().replace(/-/g, '')
      
      if (submittedEmail === currentEmail || submittedPhone === currentPhone) {
        return true
      }
    } catch (error) {
      console.error('Error parsing stored entry:', error)
    }
  }
  return false
}

// 응모 완료 정보 저장
const saveEntrySubmission = (email: string, phone: string) => {
  try {
    localStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify({
      email: email.toLowerCase(),
      phone: phone.replace(/-/g, ''),
      submittedAt: new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error saving entry to localStorage:', error)
  }
}

// 폼 제출
const handleSubmit = async () => {
  submitError.value = null

  if (!validateForm()) {
    return
  }

  if (checkDuplicateEntry()) {
    submitError.value = '이미 응모하신 정보입니다. 중복 응모는 불가능합니다.'
    return
  }

  isSubmitting.value = true

  try {
    const entryData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      agreeTerms: formData.agreeTerms,
    }

    const result = await submitEntry(entryData)

    if (result.success) {
      isSuccess.value = true
      saveEntrySubmission(entryData.email, entryData.phone)
      formData.name = ''
      formData.phone = ''
      formData.email = ''
      formData.agreeTerms = false
    } else {
      submitError.value = result.error || '응모 제출에 실패했습니다. 다시 시도해주세요.'
    }
  } catch (error) {
    console.error('Submit error:', error)
    submitError.value = '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await nextTick()
  
  const submitted = localStorage.getItem(ENTRY_STORAGE_KEY)
  if (submitted) {
    try {
      const data = JSON.parse(submitted)
      if (data.email || data.phone) {
        isSuccess.value = true
      }
    } catch (error) {
      console.error('Error parsing stored entry:', error)
    }
  }
  
  if (formRef.value) {
    gsap.from(formRef.value, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
})
</script>

