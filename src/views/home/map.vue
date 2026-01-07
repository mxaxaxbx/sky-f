<template>
  <section class="bg-[var(--bg)] py-0 lg:py-10 mb-20 overflow-hidden">
    <div
      class="
        container
        flex flex-col
        items-center justify-center
        mx-auto gap-8 px-2

        sm:gap-20 md:flex-row
      ">
      <!-- Mapa -->
      <object
        id="Icons"
        aria-label="Icons SVG"
        type="image/svg+xml"
        data="dgsky-mapa.svg"
        class="w-full md:w-80 lg:w-[600px] h-auto z-30"
      ></object>

      <!-- Texto + formulario -->
      <div class="w-[90%] md:w-auto">
        <h2 class="text-4xl text-left text-[var(--text-secondary)]
          font-bold mb-6 md:mb-10 md:text-5xl">
          Trusted by Thousands <br /> Worldwide
        </h2>

        <p class="text-base md:text-md text-left text-[var(--text-terceary)] font-regular">
          Create your account and start storing your files with total peace of mind. <br />
          Access them anytime, anywhere, and share them effortlessly with the people <br />
          you trust the most.
        </p>
      </div>
    </div>
  </section>
</template>
<script setup>
import {
  ref,
  defineAsyncComponent,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const message = ref('');
const isError = ref(false);

onMounted(async () => {
  await nextTick();

  const title = document.querySelector('h2.text-5xl.text-left');
  const para = document.querySelector('p.text-md.text-left');
  if (!title || !para) return;

  gsap.set([title, para], { y: 60, autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true });
  tl.to(title, {
    y: 8,
    autoAlpha: 1,
    duration: 0.62,
    ease: 'power2.out',
  })
    .to(title, { y: 0, duration: 0.55, ease: 'power1.out' })
    .to(para, {
      y: 18,
      autoAlpha: 1,
      duration: 0.62,
      ease: 'power2.out',
    }, '-=0.60')
    .to(para, { y: 0, duration: 0.55, ease: 'power1.out' }, '-=0.28');

  ScrollTrigger.create({
    trigger: title,
    start: 'top 80%',
    onEnter() {
      tl.play();
    },
    once: true,
  });
});

// animación de formulario de email

const emailWrapper = ref(null);
let revealTL = null;
let trig = null;

// validación
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const handleSubmit = (e) => {
  e.preventDefault();
  const input = emailWrapper.value.querySelector('input');
  if (!validateEmail(input.value)) {
    message.value = 'Please enter a valid email address';
    isError.value = true;
  } else {
    message.value = 'Email submitted successfully!';
    isError.value = false;
    input.value = '';
  }
};

onMounted(async () => {
  await nextTick();
  const el = emailWrapper.value;
  if (!el) return;

  const button = el.querySelector('button');
  const input = el.querySelector('input');

  gsap.set(el, {
    width: `${button.scrollWidth}px`,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0A77F3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  gsap.set(input, {
    autoAlpha: 0,
    pointerEvents: 'none',
    display: 'none',
  });

  revealTL = gsap.timeline({ paused: true });
  revealTL.to(el, {
    width: window.innerWidth < 768 ? '100%' : '570px',
    maxWidth: '100%',
    justifyContent: 'space-between',
    duration: 0.7,
  }, 0)
    .set(input, {
      display: 'block',
    }, 0.1)
    .to(input, {
      autoAlpha: 1,
      pointerEvents: 'auto',
      duration: 0.3,
    }, 0.2);

  // slide-in-up antes de la expansión
  gsap.set(el, { y: 60, autoAlpha: 0 });
  const slideInTL = gsap.timeline({ paused: true });
  slideInTL.to(el, {
    y: 0,
    autoAlpha: 1,
    duration: 0.5,
    ease: 'power3.out',
  });
  slideInTL.eventCallback('onComplete', () => {
    if (revealTL && typeof revealTL.play === 'function') {
      revealTL.play();
    }
  });

  trig = ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter(self) {
      slideInTL.play();
      if (self && typeof self.kill === 'function') {
        self.kill();
      }
    },
  });
});

onBeforeUnmount(() => {
  if (trig) trig.kill();
  if (revealTL) revealTL.kill();
});

</script>
