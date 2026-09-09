<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";
import { computed } from "vue";

interface AuroraBackgroundProps {
  radialGradient?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<AuroraBackgroundProps>(), {
  radialGradient: true,
});

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const styles = computed(() => {
  return {
    "--aurora":
      "repeating-linear-gradient(100deg,#e6b23a_10%,#f6d98e_15%,#67c3a0_20%,#e08b9b_25%,#d9a441_30%)",
    "--dark-gradient":
      "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",

    "--gold-300": "#f6d98e",
    "--gold-400": "#e6b23a",
    "--gold-500": "#d9a441",
    "--teal-300": "#67c3a0",
    "--rose-300": "#e08b9b",
    "--black": "#000",
    "--transparent": "transparent",
    "--animate-aurora": "aurora 60s linear infinite",
  };
});

const auroraClass = computed(() =>
  cn(
    "after:animate-aurora pointer-events-none absolute -inset-2.5 bg-size-[300%,200%] bg-position-[50%_50%,50%_50%] blur-[10px] will-change-transform after:absolute after:inset-0 after:bg-size-[200%,100%] after:bg-fixed after:content-['']",
    isDark.value
      ? "opacity-50 [background-image:var(--dark-gradient),var(--aurora)] after:bg-position-[50%_50%,50%_50%] after:mix-blend-difference after:[background-image:var(--dark-gradient),var(--aurora)]"
      : "opacity-55 [background-image:var(--aurora)] after:bg-position-[100%_100%,50%_50%] after:mix-blend-soft-light after:[background-image:var(--aurora)]",
  ),
);
</script>

<template>
  <main
    :class="
      cn(
        'relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground',
        props.class,
      )
    "
  >
    <div
      :style="styles"
      class="absolute inset-0 overflow-hidden"
    >
      <div
        :class="
          cn(
            auroraClass,
            props.radialGradient &&
              'mask-[radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]',
          )
        "
      />
    </div>
    <slot />
  </main>
</template>