<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";
import { computed } from "vue";

const { t } = useI18n();
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

function toggle() {
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<template>
  <button
    type="button"
    :aria-label="isDark ? t('theme.toLight') : t('theme.toDark')"
    :title="isDark ? t('theme.toLight') : t('theme.toDark')"
    :class="
      cn(
        'relative grid size-9 cursor-pointer place-items-center rounded-xl border border-border/70 bg-card/50 text-foreground/80 backdrop-blur-md transition-all duration-300 hover:border-[#f2b134]/50 hover:text-[#f2b134] hover:shadow-[0_4px_18px_-6px_rgba(242,177,52,0.4)]',
      )
    "
    @click="toggle"
  >
    <Transition name="theme-icon" mode="out-in">
      <Icon v-if="isDark" key="sun" name="lucide:sun" class="size-5" />
      <Icon v-else key="moon" name="lucide:moon" class="size-5" />
    </Transition>
  </button>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-40deg) scale(0.6);
}
.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(40deg) scale(0.6);
}
</style>
