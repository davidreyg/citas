<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";

const { t, locale, locales, setLocale } = useI18n();

function isActive(code: string) {
  return locale.value === code;
}

async function switchLocale(code: string) {
  if (isActive(code)) return;
  await setLocale(code);
}
</script>

<template>
  <div
    role="group"
    aria-label="Language switcher"
    class="flex items-center gap-1 rounded-full border border-border/70 bg-card/50 p-1 backdrop-blur-md"
  >
    <button
      v-for="l in locales"
      :key="l.code"
      type="button"
      :aria-label="t('locale.switchTo', { locale: l.name })"
      :aria-pressed="isActive(l.code)"
      :class="
        cn(
          'flex h-7 cursor-pointer items-center justify-center rounded-full px-3 text-xs font-semibold tracking-wide transition-all duration-300',
          isActive(l.code)
            ? 'bg-gradient-to-br from-[#f2b134] via-[#eda53f] to-[#d98a2b] text-[#201405] shadow-[0_2px_10px_-2px_rgba(242,177,52,0.5)]'
            : 'text-muted-foreground hover:text-primary',
        )
      "
      @click="switchLocale(l.code)"
    >
      {{ l.code.toUpperCase() }}
    </button>
  </div>
</template>