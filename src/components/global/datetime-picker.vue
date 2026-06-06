<template>
  <div class="datetime-picker-root relative">
    <label v-if="label && !inline" :for="inputId" class="mb-1 ml-2 block text-sm font-semibold text-[var(--text)]">
      <slot name="label">{{ label }}</slot>
    </label>

    <button
      v-if="!inline"
      :id="inputId"
      type="button"
      class="flex w-full items-center justify-between rounded-full border border-[var(--border)] bg-[var(--bg)]
             px-3 py-1.5 text-left text-sm text-[var(--text)] shadow-sm transition hover:border-[var(--hover-border)]
             focus:outline-none focus:ring-2 focus:ring-[var(--hover-border)]/30 cursor-pointer"
      @click="isOpen = !isOpen"
    >
      <span :class="displayValue ? 'text-[var(--text)]' : 'text-[var(--text-terceary)]'">
        {{ displayValue || placeholder }}
      </span>
      <i class="fa-solid fa-calendar-day text-[var(--text-terceary)] text-xs"></i>
    </button>

    <input v-if="!inline" :name="name" type="hidden" :value="modelValue" />

    <Transition
      enter-active-class="transition duration-150 ease-out"
      leave-active-class="transition duration-100 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-8"
      leave-from-class="opacity-100 translate-y-8"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="pickerVisible"
        class="relative z-50 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] backdrop-blur-md
               shadow-2xl shadow-black/20"
        :class="inline ? '' : 'absolute left-0 mt-2'"
      >
        <div class="relative z-10 flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
          <button type="button" class="text-[var(--text-secondary)] transition hover:text-[var(--text)] cursor-pointer" @click="previousMonth">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            type="button"
            class="text-sm font-semibold text-[var(--text)] cursor-pointer"
            @click="goToToday"
          >
            {{ monthTitle }}
          </button>
          <button type="button" class="text-[var(--text-secondary)] transition hover:text-[var(--text)] cursor-pointer" @click="nextMonth">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>

        <div class="relative z-10 flex flex-raw">
          <div
            class="calendar-stage p-2 flex-1"
            @mousemove="handleCalendarMouseMove"
            @focusin="handleCalendarFocus"
            @mouseleave="clearCalendarBorderGlow"
            @focusout="clearCalendarBorderGlow"
          >
            <div class="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--text-terceary)]">
              <span v-for="day in weekDays" :key="day">{{ day }}</span>
            </div>
            <div class="calendar-grid grid grid-cols-7 gap-1 w-full">
              <button
                v-for="cell in calendarCells"
                :key="cell.key"
                type="button"
                class="calendar-day h-8 w-8 text-sm hover:border-white hover:shadow-[0_0_2px_1px_rgba(116,116,116,0.5)] transition-shadow focus-visible:outline-none"
                :class="dayCellClass(cell)"
                @click="selectDay(cell)"
              >
                <span>{{ cell.label }}</span>
              </button>
            </div>
          </div>

          <div v-if="!hideTime" class="p-2 border-l border-[var(--border)]" :class="activeStep === 'date' ? 'opacity-50 pointer-events-none' : ''">
            <button
              type="button"
              class="mb-3 flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]
                     px-4 py-2 text-left text-sm text-[var(--text)] shadow-sm transition hover:border-[var(--hover-border)] cursor-pointer"
              @click="isTimeListOpen = !isTimeListOpen"
            >
              <span>{{ selectedTimeLabel }}</span>
              <i class="fa-solid fa-chevron-down text-[var(--text-terceary)] text-xs ml-2"></i>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              leave-active-class="transition duration-100 ease-in"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-2"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="isTimeListOpen"
                class="max-h-[162px] overflow-y-auto overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] p-1 scrollbar-thin -mt-2"
              >
                <button
                  v-for="time in timeOptions"
                  :key="time"
                  type="button"
                  class="flex w-full items-center justify-center space-y-1 rounded-lg px-1 py-1 text-left text-sm font-semibold text-[var(--text)] hover:bg-[var(--hover-bg-gray)] transition cursor-pointer"
                  :class="time === selectedTime ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-white/5'"
                  @click="selectTime(time)"
                >
                  {{ time }}
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import moment from 'moment';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Select date and time',
  },
  hideTime: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'date-selected']);

const isOpen = ref(false);
const currentMonth = ref(moment().startOf('month'));
const selectedDate = ref(moment());
const inputId = `dt-${Math.random().toString(36).slice(2, 9)}`;

const weekDays = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];
const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

const displayValue = computed(() => {
  if (!props.modelValue) return '';
  return moment(props.modelValue, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm');
});

const monthTitle = computed(() => currentMonth.value.format('MMMM YYYY'));
const selectedTime = ref('12:00');
const isTimeListOpen = ref(false);
const selectedTimeLabel = computed(() => selectedTime.value);
const activeStep = ref<'date' | 'time'>('date');
const pickerVisible = computed(() => props.inline || isOpen.value);

const calendarCells = computed(() => {
  const start = currentMonth.value.clone().startOf('month').startOf('week');
  const end = currentMonth.value.clone().endOf('month').endOf('week');
  const cells = [];
  const cursor = start.clone();

  while (cursor.isSameOrBefore(end, 'day')) {
    cells.push({
      key: cursor.format('YYYY-MM-DD'),
      label: cursor.date(),
      date: cursor.clone(),
      isCurrentMonth: cursor.month() === currentMonth.value.month(),
      isSelected: props.modelValue
        ? cursor.isSame(moment(props.modelValue, 'YYYY-MM-DDTHH:mm'), 'day')
        : cursor.isSame(selectedDate.value, 'day'),
    });
    cursor.add(1, 'day');
  }

  return cells;
});

function syncFromValue(value: string) {
  if (!value) return;
  const parsed = moment(value, 'YYYY-MM-DDTHH:mm');
  if (!parsed.isValid()) return;

  currentMonth.value = parsed.clone().startOf('month');
  selectedDate.value = parsed.clone();
  selectedTime.value = parsed.format('HH:mm');
}

function buildValue() {
  const base = selectedDate.value.clone();
  const [hourText, minuteText] = selectedTime.value.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return base
    .hour(hour)
    .minute(minute)
    .second(0)
    .format('YYYY-MM-DDTHH:mm');
}

function selectDay(cell: { date: moment.Moment }) {
  const previousDate = selectedDate.value.clone();

  selectedDate.value = cell.date
    .clone()
    .hour(previousDate.hour())
    .minute(previousDate.minute())
    .second(0);

  emit('update:modelValue', buildValue());
  emit('date-selected', buildValue());

  if (!props.hideTime) {
    activeStep.value = 'time';
  }
}
function selectTime(time: string) {
  selectedTime.value = time;
  isTimeListOpen.value = false;

  emit('update:modelValue', buildValue());
  emit('date-selected', buildValue());
}

function applySelection() {
  if (props.hideTime) {
    emit('update:modelValue', selectedDate.value.clone().format('YYYY-MM-DDTHH:mm'));
    isOpen.value = false;
    return;
  }
  if (activeStep.value === 'date') {
    activeStep.value = 'time';
    return;
  }
  emit('update:modelValue', buildValue());
  isOpen.value = false;
}

function clearValue() {
  emit('update:modelValue', '');
  isOpen.value = false;
}

function previousMonth() {
  currentMonth.value = currentMonth.value.clone().subtract(1, 'month');
}

function nextMonth() {
  currentMonth.value = currentMonth.value.clone().add(1, 'month');
}

function goToToday() {
  const today = moment();
  currentMonth.value = today.clone().startOf('month');
  selectedDate.value = today.clone();
}

function dayCellClass(cell: { isCurrentMonth: boolean; isSelected: boolean }) {
  return [
    cell.isCurrentMonth ? 'is-current-month text-[var(--text)]' : 'is-out-month text-[var(--text-terceary)] opacity-40',
    cell.isSelected ? 'is-selected font-bold text-white' : '',
  ];
}

function clearCalendarBorderGlow(event: Event) {
  const target = event.currentTarget as HTMLElement;
  target.querySelectorAll<HTMLElement>('.calendar-day').forEach((day) => {
    day.style.setProperty('--calendar-border-alpha', '0');
  });
}

function updateCalendarBorderGlow(stage: HTMLElement, origin: HTMLElement) {
  const glowRadius = 60;
  const originRect = origin.getBoundingClientRect();
  const originX = originRect.left + originRect.width / 2;
  const originY = originRect.top + originRect.height / 2;

  stage.querySelectorAll<HTMLElement>('.calendar-day').forEach((day) => {
    const rect = day.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(originX - centerX, originY - centerY);
    const progress = Math.max(0, 1 - distance / glowRadius);
    const alpha = progress ** 1.2;

    day.style.setProperty('--calendar-border-alpha', alpha.toFixed(3));
  });
}

function handleCalendarMouseMove(event: MouseEvent) {
  const stage = event.currentTarget as HTMLElement;
  const origin = (event.target as HTMLElement).closest<HTMLElement>('.calendar-day');
  if (!origin) return;

  updateCalendarBorderGlow(stage, origin);
}

function handleCalendarFocus(event: FocusEvent) {
  const stage = event.currentTarget as HTMLElement;
  const origin = (event.target as HTMLElement).closest<HTMLElement>('.calendar-day');
  if (!origin) return;

  updateCalendarBorderGlow(stage, origin);
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.datetime-picker-root')) {
    isOpen.value = false;
  }
}

watch(
  () => props.modelValue,
  (value) => {
    syncFromValue(value);
  },
  { immediate: true },
);

watch(
  () => props.open,
  (value) => {
    isOpen.value = value;
    if (value) {
      activeStep.value = 'date';
      isTimeListOpen.value = false;
    }
  },
  { immediate: true },
);

watch(isOpen, (value) => {
  if (value && props.modelValue) {
    activeStep.value = 'time';
    return;
  }
  if (value) {
    activeStep.value = 'date';
  }
});

function openPicker() {
  isOpen.value = true;
  activeStep.value = 'date';
  isTimeListOpen.value = false;
}

function closePicker() {
  isOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});

defineExpose({
  openPicker,
  closePicker,
});
</script>

<style scoped>
.calendar-stage {
  position: relative;
  overflow: hidden;
  background: var(--bg);
}

.calendar-grid {
  position: relative;
  z-index: 1;
}

.calendar-day {
  position: relative;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  border-radius: 0.5rem;
  background: transparent;
  padding: 0;
  border: 1px solid rgba(100, 100, 100, var(--calendar-border-alpha, 0));
  transition: border-color 0.12s ease, color 0.2s ease;
}

.calendar-day:focus {
  outline: none;
}

.calendar-day::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: var(--bg);
  transition: background-color 0.2s ease;
  border-radius: 0.35rem;
}

.calendar-day span {
  position: relative;
  z-index: 2;
}

.calendar-day.is-current-month:hover::after {
  background: color-mix(in srgb, var(--color-primary), transparent 85%);
}

.calendar-day.is-selected::after {
  background: var(--color-primary);
}

.calendar-day.is-selected {
  --calendar-border-alpha: 1;
  color: white !important;
}
</style>
