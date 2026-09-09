<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";
import { computed, ref } from "vue";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const config = useRuntimeConfig();

const siteUrl = config.public.siteUrl.trim().replace(/\/$/, "");
const pageUrl = `${siteUrl}${localePath(route.path)}`;

const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${siteUrl}/#hospital`,
  name: "Hospital de Huaycán",
  url: pageUrl,
  description: t("meta.description"),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ate",
    addressRegion: "Lima",
    addressCountry: "PE",
  },
  medicalSpecialty: ["PrimaryCare", "Pediatric", "Dentistry", "Cardiovascular", "Ophthalmologic"],
});

useHead(() => ({
  htmlAttrs: { lang: locale.value === "es" ? "es-PE" : "en-US" },
  link: [{ rel: "canonical", href: pageUrl }],
  meta: [{ name: "robots", content: "index, follow, max-image-preview:large" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify([
        organizationJsonLd(),
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: pageUrl,
          name: t("meta.title"),
          inLanguage: locale.value,
          publisher: { "@id": `${siteUrl}/#hospital` },
        },
      ]),
    },
  ],
}));

useSeoMeta({
  title: () => t("meta.title"),
  description: () => t("meta.description"),
  ogTitle: () => t("meta.title"),
  ogDescription: () => t("meta.description"),
  ogUrl: pageUrl,
  ogType: "website",
  ogSiteName: "Hospital de Huaycán",
  twitterCard: "summary",
  twitterTitle: () => t("meta.title"),
  twitterDescription: () => t("meta.description"),
});

const numeroDocumento = ref("");
const hasSearched = ref(false);

const queryClient = useQueryClient();
const { data, isPending, isError, error: queryError, refetch } = useCitaQuery(numeroDocumento);

const localError = ref<string | null>(null);
const showResult = computed(() => hasSearched.value && !isPending.value && data.value);
const searching = computed(() => hasSearched.value && isPending.value);

function onSearch() {
  const digits = numeroDocumento.value.replace(/\D/g, "");
  if (digits.length < 8) {
    localError.value = t("hero.errorIncompleteDocument");
    return;
  }

  localError.value = null;
  hasSearched.value = true;
  refetch();
}

function onNewSearch() {
  numeroDocumento.value = "";
  hasSearched.value = false;
  localError.value = null;
  queryClient.removeQueries({ queryKey: queryKeys.cita.all });
}
</script>

<template>
  <div class="min-h-svh bg-background text-foreground selection:bg-[#f2b134]/40">
    <UiAuroraBackground class="h-auto! min-h-svh">
      <div class="pointer-events-none absolute inset-0 z-0">
        <UiParticlesBg :quantity="70" color="#f2b134"
          class="absolute inset-0 h-full w-full opacity-50 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,black,transparent_78%)]" />
      </div>

      <header class="absolute inset-x-0 top-0 z-30">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <NuxtLink to="/" class="group flex items-center gap-2.5" :aria-label="t('brand')">
            <span
              class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#f6d98e] via-[#f2b134] to-[#d98a2b] text-[#201405] shadow-lg shadow-[#f2b134]/30 transition-transform duration-300 group-hover:scale-105">
              <Icon name="lucide:heart-pulse" class="size-5" />
            </span>
            <span class="font-display text-base font-semibold leading-tight tracking-tight md:text-lg">
              {{ t("brand") }}
            </span>
          </NuxtLink>

          <div class="flex items-center gap-2.5">
            <UiLocaleSwitcher />
            <UiThemeToggle />
          </div>
        </div>
      </header>

      <main class="relative z-10 flex w-full flex-col items-center px-6 pt-28 pb-16 md:pt-32">
        <div v-if="!showResult && !searching">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-md">
            <Icon name="lucide:calendar-check" class="size-3.5 text-primary" />
            {{ t("header.badge") }}
          </div>

          <h1 class="font-display max-w-3xl text-center text-4xl font-semibold tracking-tight md:text-6xl">
            <span class="block text-foreground">{{ t("hero.title1") }}</span>
            <span class="block text-primary italic">{{ t("hero.title2") }}</span>
          </h1>

          <p class="mt-6 max-w-xl text-center text-base text-muted-foreground md:text-lg">
            {{ t("hero.subtitle") }}
          </p>

          <div class="mt-10 w-full max-w-xl">
            <UiDocumentInput v-model="numeroDocumento" :placeholder="t('hero.searchPlaceholder')" />
          </div>

          <div class="mt-6 flex justify-center">
            <UiShimmerButton :background="'rgba(242, 177, 52, 1)'" :shimmer-color="'#fff7e6'"
              class="px-8 py-3.5 text-base font-semibold text-[#201405] shadow-[0_16px_40px_-16px_rgba(242,177,52,0.6)]"
              @click="onSearch">
              <span class="flex items-center gap-2">
                <Icon name="lucide:search" class="size-4" />
                {{ t("hero.search") }}
              </span>
            </UiShimmerButton>
          </div>

          <p class="mt-6 text-center text-sm text-muted-foreground/80" aria-live="polite">
            {{ t("hero.privacy") }}
          </p>
        </div>

        <div v-else-if="searching" class="flex flex-col items-center" role="status" aria-live="polite">
          <Icon name="lucide:loader-circle" class="size-10 animate-spin text-primary" />
          <p class="mt-4 text-lg text-muted-foreground">{{ t("hero.searching") }}</p>
        </div>

        <div v-else-if="showResult && data" class="w-full max-w-xl">
          <div role="status" aria-live="polite"
            class="overflow-hidden rounded-3xl border border-border/70 bg-card/50 p-8 backdrop-blur-xl">
            <div class="flex flex-col items-center text-center">
              <span
                class="mb-5 grid size-14 place-items-center rounded-full"
                :class="cn(
                  data.hasAppointment
                    ? 'border border-primary/30 bg-primary/10 text-primary'
                    : 'border border-border bg-muted/50 text-muted-foreground',
                )">
                <Icon :name="data.hasAppointment ? 'lucide:calendar-check' : 'lucide:calendar-x'" class="size-7" />
              </span>

              <h2 class="font-display text-3xl font-semibold tracking-tight">
                {{ data.hasAppointment ? t("result.hasTitle") : t("result.noneTitle") }}
              </h2>

              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                {{
                  data.hasAppointment
                    ? t("result.hasBody")
                    : t("result.noneBody", { documento: data.numeroDocumento })
                }}
              </p>

              <div v-if="data.hasAppointment && data.appointment"
                class="mt-6 w-full rounded-2xl border border-border/70 bg-muted/40 p-5 text-left">
                <dl class="space-y-3 text-sm">
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">{{ t("result.appointment.specialty") }}</dt>
                    <dd class="text-foreground font-medium">{{ data.appointment.specialty || t("result.specialtyUnknown") }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">{{ t("result.appointment.location") }}</dt>
                    <dd class="text-primary font-medium">{{ data.appointment.location || t("result.clinic") }}</dd>
                  </div>
                </dl>
              </div>

              <div v-else-if="data.hasAppointment"
                class="mt-6 w-full rounded-2xl border border-border/70 bg-muted/40 p-5 text-left">
                <dl class="space-y-3 text-sm">
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">{{ t("result.appointment.specialty") }}</dt>
                    <dd class="text-foreground font-medium">{{ t("result.specialtyUnknown") }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <dt class="text-muted-foreground">{{ t("result.appointment.location") }}</dt>
                    <dd class="text-primary font-medium">{{ t("result.clinic") }}</dd>
                  </div>
                </dl>
              </div>

              <button type="button" @click="onNewSearch"
                class="mt-6 cursor-pointer rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary">
                {{ t("result.newSearch") }}
              </button>
            </div>
          </div>
        </div>

        <p v-if="localError" class="mt-6 max-w-xl rounded-2xl border border-[#e08b9b]/30 bg-[#e08b9b]/10 px-6 py-4 text-center text-sm text-[#e08b9b]" role="alert">
          {{ localError }}
        </p>
        <p v-else-if="isError && hasSearched" class="mt-6 max-w-xl rounded-2xl border border-[#e08b9b]/30 bg-[#e08b9b]/10 px-6 py-4 text-center text-sm text-[#e08b9b]" role="alert">
          {{ queryError?.message || t("hero.errorGeneric") }}
        </p>
      </main>

      <footer class="relative z-10 px-6 pb-10 text-center">
        <p class="text-sm text-muted-foreground/70">{{ t("footer.copyright") }}</p>
      </footer>
    </UiAuroraBackground>
  </div>
</template>