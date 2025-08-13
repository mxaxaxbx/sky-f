<template>
  <section class="bg-[#EDF5FF] pt-16 pb-24 overflow-hidden">
      <div class="container flex justify-between items-center gap-x-8 mx-auto w-[75%]">
        <object
          id="Icons"
          aria-label="Icons SVG"
          type="image/svg+xml"
          data="dgsky-mapa.svg"
          class="w-72 md:w-80 lg:w-[800px] h-auto z-30"
          ></object>
      <div class="">
        <h2 class="text-5xl text-left text-[#3D3D3D] font-bold mb-10">
          Trusted by Thousands <br /> Worldwide
        </h2>

  <p class="text-md text-left text-[#797979] font-semibold">
    Create your account and start storing your files with total peace of mind. <br />
    Access them anytime, anywhere, and share them effortlessly with the people <br />
    you trust the most.
  </p>

  <!-- WRAPPER para centrar -->
  <div class="w-full mt-10 flex flex-col justify-center">
    <!-- FORMULARIO -->
  <div
    ref="emailWrapper"
    class="flex items-center rounded-full border border-[#0A77F3]
           transition-colors duration-300 focus-within:bg-white bg-transparent"
  >
    <label for="email-input" class="sr-only">Email</label>
    <input
      id="email-input"
      type="email"
      placeholder="Enter your email"
      class="w-full font-semibold text-[#0A77F3] bg-transparent px-6 py-2
             focus:outline-none placeholder-[#71C4FF] placeholder:text-lg placeholder:font-normal"
    />
        <button
          class="bg-[#0A77F3] text-lg text-white font-semibold px-8 py-3 rounded-full"
        >
          Submit
        </button>
        </div>
           <!-- ALERTA -->
          <p
            :class="[ // eslint-disable-next-line
              'min-h-[1.5rem] ml-8 mt-4 text-left text-sm font-semibold transition-allduration-300',
              message ? 'opacity-100 visible ' : 'opacity-0 invisible',
              isError ? 'text-red-500' : 'text-green-600'
            ]"
            >
            {{ message || '‎' }}
          </p>
        </div>
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
  revealTL
    .to(el, {
      width: '470px',
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
