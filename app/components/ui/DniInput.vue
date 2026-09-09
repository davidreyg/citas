<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";
import { computed, ref } from "vue";

const { t } = useI18n();

interface Props {
  placeholder?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), { placeholder: undefined });

const emit = defineEmits<{
  search: [dni: string];
}>();

const model = defineModel<string>({ default: "" });

const focused = ref(false);
const hovered = ref(false);
const rootRef = ref<HTMLDivElement | null>(null);
const glow = ref({ x: 0, y: 0 });

function formatDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  const cut = digits.slice(0, 8);
  return cut.replace(/(\d{4})(?=\d)/g, "$1 ");
}

const display = computed({
  get: () => formatDigits(model.value ?? ""),
  set: (value: string) => {
    model.value = value.replace(/\D/g, "").slice(0, 8);
  },
});

const digits = computed(() => (model.value ?? "").replace(/\D/g, "").slice(0, 8));

function handleMove(event: MouseEvent) {
  if (!rootRef.value) return;
  const rect = rootRef.value.getBoundingClientRect();
  glow.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function submit() {
  if (digits.value.length > 0) emit("search", digits.value);
}
</script>

<template>
  <div ref="rootRef" :class="cn('group relative w-full max-w-xl', props.class)" @mousemove="handleMove"
    @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div
      class="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-60 group-focus-within:opacity-80"
      :class="focused || hovered ? '' : 'opacity-30'" style="
        background:
          radial-gradient(40% 60% at 20% 30%, rgba(242, 177, 52, 0.35), transparent 70%),
          radial-gradient(40% 60% at 80% 70%, rgba(103, 195, 160, 0.28), transparent 70%);
      " />

    <div class="pointer-events-none absolute inset-0 rounded-[1.4rem] transition-opacity duration-300"
      :class="focused ? 'opacity-100' : 'opacity-50'" :style="{
        background: `radial-gradient(240px circle at ${glow.x}px ${glow.y}px, rgba(242,177,52,0.18), transparent 72%)`,
      }" />

    <div
      class="pointer-events-none absolute -inset-px overflow-hidden rounded-[1.45rem] opacity-80 blur-[0.5px] group-focus-within:opacity-100">
      <div class="absolute top-1/2 left-1/2 aspect-square w-[185%] -translate-x-1/2 -translate-y-1/2">
        <div class="dni-ring size-full" style="
            background: conic-gradient(
              from 0deg,
              transparent 0deg,
              #f2b134 70deg,
              #67c3a0 130deg,
              #e08b9b 200deg,
              #f6d98e 270deg,
              transparent 340deg
            );
          " />
      </div>
    </div>

    <div
      class="relative flex items-center rounded-[1.4rem] border border-border/60 bg-card/85 p-2 pl-6 backdrop-blur-xl transition-shadow duration-500 group-focus-within:border-transparent group-focus-within:shadow-[0_0_0_1px_rgba(242,177,52,0.45),0_24px_60px_-24px_rgba(242,177,52,0.25)]">
      <Icon name="lucide:id-card"
        class="mr-4 size-6 shrink-0 text-primary/80 transition-colors duration-300 group-focus-within:text-primary" />

      <input v-model="display" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" maxlength="9"
        :placeholder="props.placeholder ?? t('hero.searchPlaceholder')"
        class="h-12 w-full min-w-0 bg-transparent pr-16 font-medium tracking-[0.22em] text-foreground transition-colors duration-300 outline-none placeholder:tracking-normal placeholder:text-muted-foreground focus:placeholder:text-muted-foreground/70"
        @focus="focused = true" @blur="focused = false" @keydown.enter="submit" />

      <button type="button" :aria-label="t('hero.searchAria')"
        class="absolute right-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#f2b134] via-[#eda53f] to-[#d98a2b] text-[#201405] shadow-lg shadow-[#f2b134]/25 transition-all duration-300 hover:scale-105 hover:shadow-[#f2b134]/40 active:scale-95"
        @click="submit">
        <Icon name="lucide:arrow-right" class="size-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.dni-ring {
  animation: dni-ring-spin 7s linear infinite;
}

@keyframes dni-ring-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>