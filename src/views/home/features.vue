<template>
   <section class="bg-[var(--bg)] font-alexandria font-sans py-2  pt-40 pb-8">
      <!-- Animación SVG bienvenida -->
      <div class="reltive w-full h-full flex items-left justify-left pt-12">

        <div class="absolute w-full lg:h-52 h-20 bg-slide"> </div>
        <div class="relative overflow-hidden w-full bg-slide">
          <div class="absolute w-full lg:h-46 h-20 bg-slide"></div>

          <object
            id="Welcome"
            aria-label="Welcome SVG"
            type="image/svg+xml"
            data="Welcome.svg"
            class="w-auto lg:h-52 h-20 animate-slide-in-left">
          </object>
        </div>
      </div>

      <!-- Texto principal -->
      <div
        class="
          container
          flex flex-row items-center justify-center
          mx-auto my-8 px-2 gap-4 sm:gap-20
        ">
        <h2
          id="animated-heading"
          class="
            text-2xl text-left mb-4 font-semibold lg:text-5xl">
            We built a private cloud
          <br> that puts you in control,<br> with a fast, intuitive,<br> and hassle-free
          <span class="text-[var(--color-primary)] pl-2 lg:pl-0">Experience.</span>
        </h2>

        <!--data rain-->
        <div id="wrapper2"
            class="opacity-50 hidden md:block"
            ref="wrapper2">
            <canvas ref="canvas2" class="block"></canvas>
        </div>
      </div>

      <!-- Tarjetas de características -->
      <div
        class="
          container w-full
          flex flex-col items-center justify-center
          mx-auto gap-4 my-12

          sm:flex-row
          ">

        <!-- seguridad -->
        <div
          class="
            group
            animated-card
            flex flex-col
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            h-96 px-6 pt-6
            rounded-lg

            hover:border-[var(--color-primary)]
            hover:bg-[var(--hover-bg)]
            hover:shadow-[0_0_10px_5px_rgba(10,119,243,0.2)]
            transition-all duration-300
          ">
          <div class="flex flex-col gap-6">
            <h3 class="
              text-[var(--text)] text-xl font-semibold
              ">Secure Storage
            </h3>
            <p class="text-[var(--text-terceary)] text-sm font-light leading-tight">
              Store your files securely with<br />end-to-end encryption.
            </p>
          </div>
        <!-- seguridad -->
        <div
          ref="lockContainer"
          class="relative flex items-center justify-center
            mt-8 w-64 h-64 opacity-50 group-hover:opacity-100
          ">
          <!-- Base del candado -->
          <object
            id="lockbase"
            aria-label="lockBase SVG"
            type="image/svg+xml"
            data="lock-base.svg"
            class="absolute z-50
            ">
          </object>
          <!-- Círculo izquierdo -->
          <img
            ref="dialInner"
            src="/dial-inner.svg"
            alt="inner"
            class="absolute z-20"
          />
          <!-- Círculo del medio -->
          <img
            ref="dialMidder"
            src="/dial-midder.svg"
            alt="midder"
            class="absolute z-30"
          />
          <!-- Círculo derecho -->
          <img
            ref="dialOuter"
            src="/dial-outer.svg"
            alt="outer"
            class="absolute z-40"
          />
          </div>
        </div>

        <!-- Organize Files -->
          <div
            class="
              group
              animated-card
              flex flex-col
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              h-96 px-6 pt-6
              rounded-lg

              hover:border-[var(--color-primary)]
              hover:bg-[var(--hover-bg)]
              hover:shadow-[0_0_10px_5px_rgba(10,119,243,0.2)]
              transition-all duration-300
            ">
            <div class="flex flex-col gap-6">
            <h3 class="
              text-[var(--text)] text-xl font-semibold
              "> Organize Files
            </h3>
            <p class="text-[var(--text-terceary)] text-sm font-light leading-tight">
              Keep your files organized with<br />folders and tags for easy access.
            </p>
          </div>
          <div
            ref="organiceContainer"
            class="relative flex mt-8 w-64 h-64 opacity-50
              group-hover:opacity-100 transition-opacity duration-300
            ">
            <!-- Base -->
            <img
              src="Organice.svg"
              alt="Organice"
              class="absolute z-50"
            />

            <!-- Hotspots -->
            <img
              src="dgsky-organice1.svg"
              alt=""
              class="js-hotspot absolute h-5 z-50"
              style="left: 154px; top: 110px;"
            />
            <img
              src="dgsky-organice2.svg"
              alt=""
              class="js-hotspot absolute h-5 z-50"
              style="left: 95px; top: 40px;"
            />
            <img
              src="dgsky-organice3.svg"
              alt=""
              class="js-hotspot absolute h-5 z-50"
              style="left: 125px; top: 212px;"
            />
            <img
              src="dgsky-organice4.svg"
              alt=""
              class="js-hotspot absolute h-[20px] z-50"
              style="left: -5px; top: 156px;"
            />
          </div>
        </div>

        <!-- Unlimited Access -->
        <div
          class="
            group
            animated-card
            flex flex-col
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            pt-6 h-96 overflow-hidden
            rounded-lg

            hover:border-[var(--color-primary)]
            hover:bg-[var(--hover-bg)]
            hover:shadow-[0_0_10px_5px_rgba(10,119,243,0.2)]
            transition-all duration-300
          ">
          <div class="flex flex-col gap-6 mx-6">
            <h3 class="
              text-[var(--text)] text-xl font-semibold
              ">Unlimited Access
            </h3>
            <p class="text-[var(--text-terceary)] text-sm font-light">
              Collaborate instantly with your<br />friends and colleagues.
            </p>
          </div>
       <!-- Aqui va la nueva animacion -->
        <div class="relative flex w-96">
          <div
            ref="planetContainer"
            class="w-96 h-96 -top-8 left-16
              absolute flex items-center justify-center
              opacity-50 group-hover:opacity-100 transition-opacity duration-300
            ">
            <!-- Base del candado -->
            <object
              id="planetBase"
              aria-label="planetBase SVG"
              type="image/svg+xml"
              data="sun.svg"
              class="absolute h-54 z-50">
            </object>
            <!-- Círculo izquierdo -->
            <img
              ref="orbit1"
              src="/orbit1.svg"
              alt="orbit1"
              class="absolute h-54 z-20"
            />
            <!-- Círculo del medio -->
            <img
              ref="orbit2"
              src="/orbit2.svg"
              alt="orbit2"
              class="absolute h-54 z-30"
            />
            <!-- Círculo derecho -->
            <img
              ref="orbit3"
              src="/orbit3.svg"
              alt="orbit3"
              class="absolute h-54 z-40"
            />
            </div>
        </div>
        </div>
    </div>
  </section>
</template>
<script setup>
import {
  onMounted,
  ref,
  onBeforeUnmount,
  defineAsyncComponent,
  nextTick,
  computed,
  watch,
} from 'vue';

import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useStore } from 'vuex';

const store = useStore();

gsap.registerPlugin(ScrollTrigger);

const isLight = computed(() => store.state.theme.theme === 'light');

const getHeadingColors = () => ({
  from: isLight.value ? '#0A77F3' : '#0A77F3',
  to: getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary')
    .trim(),
});

onMounted(() => {
  /* -------------------------
     Slide-in-up para tarjetas (solo una vez)
     ------------------------- */
  const cards = Array.from(document.querySelectorAll('.animated-card'));
  if (cards.length) {
    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        delay: index * 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none', // solo entra, no repite
          once: true, // extra seguridad para que solo pase una vez
        },
      });
    });
  }
  /* ------------------------------------------
     Animación letra-por-letra reversible (heading)
     ------------------------------------------ */
  const heading = document.getElementById('animated-heading');
  if (heading) {
    const children = Array.from(heading.childNodes);
    heading.innerHTML = '';

    const animatedSpans = [];

    children.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const chars = node.textContent.split('');
        chars.forEach((char) => {
          const safeChar = char === ' ' ? '\u00A0' : char;
          const span = document.createElement('span');
          span.className = 'inline-block text-current';
          span.textContent = safeChar;
          heading.appendChild(span);
          animatedSpans.push(span);
        });
      } else {
        heading.appendChild(node);
      }
    });

    const from = isLight.value ? '#9DC9FA' : '#9DC9FA';
    const to = getComputedStyle(document.documentElement)
      .getPropertyValue('--text-secondary')
      .trim();
    gsap.set(animatedSpans, { color: from });

    gsap.to(animatedSpans, {
      color: to,
      stagger: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heading,
        start: 'top 50%',
        end: 'bottom 40%',
        scrub: true,
      },
    });
  }
});

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});

// Clase adaptada directamente de organice
class MagneticCta {
  constructor(element) {
    this.element = element;

    element.addEventListener('mousemove', (ev) => {
      element.classList.add('is-active');
      this.mousemoveFn(ev);
    });

    element.addEventListener('mouseleave', () => {
      element.classList.remove('is-active');
      this.mouseleaveFn();
    });
  }

  mousemoveFn(ev) {
    const rect = this.element.getBoundingClientRect();
    const x = ev.clientX - rect.left - this.element.offsetWidth / 8;
    const y = ev.clientY - rect.top - this.element.offsetHeight / 8;

    const strength = 3;

    gsap.to(this.element, {
      x: x / strength,
      y: y / strength,
      ease: 'power3.out',
      duration: 0.3,
    });
  }

  mouseleaveFn() {
    gsap.to(this.element, {
      x: 0,
      y: 0,
      ease: 'power3.out',
      duration: 0.5,
    });
  }
}

onMounted(() => {
  const hotspots = document.querySelectorAll('.js-hotspot');

  hotspots.forEach((el) => {
    const magneticCta = new MagneticCta(el);
  });
});
// en pausa
const organiceContainer = ref(null);

onMounted(() => {
  const container = organiceContainer.value;

  const layers = [
    document.getElementById('Organice01'),
    document.getElementById('Organice02'),
    document.getElementById('Organice03'),
    document.getElementById('Organice04'),
  ];

  const strength = [9, 12, 18, 20];

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 4);
    const y = e.clientY - (rect.top + rect.height / 4);

    layers.forEach((layer, i) => {
      gsap.to(layer, {
        x: x / strength[i],
        y: y / strength[i],
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  });

  container.addEventListener('mouseleave', () => {
    layers.forEach((layer) => {
      gsap.to(layer, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  });
});

// animacion orbitas
const orbit1 = ref(null);
const orbit2 = ref(null);
const orbit3 = ref(null);
const planetContainer = ref(null);

let tlOrbit1;
let tlOrbit2;
let tlOrbit3;
let onEnter1;
let onLeave1;

onMounted(() => {
  // Animaciones circulares base
  tlOrbit1 = gsap.to(orbit1.value, {
    rotate: 360,
    duration: 20,
    repeat: -1,
    ease: 'linear',
    opacity: 1,
    transformOrigin: '50% 50%',
  });

  tlOrbit2 = gsap.to(orbit2.value, {
    rotate: -360,
    duration: 25,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  tlOrbit3 = gsap.to(orbit3.value, {
    rotate: 360,
    duration: 30,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  // Guardamos funciones en variables
  onEnter1 = () => {
    tlOrbit1.timeScale(2);
    tlOrbit2.timeScale(2);
    tlOrbit3.timeScale(2);
  };

  onLeave1 = () => {
    tlOrbit1.timeScale(1);
    tlOrbit2.timeScale(1);
    tlOrbit3.timeScale(1);
  };

  planetContainer.value.addEventListener('mouseenter', onEnter1);
  planetContainer.value.addEventListener('mouseleave', onLeave1);
});

onBeforeUnmount(() => {
  planetContainer.value.removeEventListener('mouseenter', onEnter1);
  planetContainer.value.removeEventListener('mouseleave', onLeave1);
});

// animacion dial
const dialInner = ref(null);
const dialMidder = ref(null);
const dialOuter = ref(null);
const lockContainer = ref(null);

let tlInner;
let tlMidder;
let tlOuter;
let onEnter;
let onLeave;

onMounted(() => {
  // Animaciones circulares base
  tlInner = gsap.to(dialInner.value, {
    rotate: 360,
    duration: 18,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  tlMidder = gsap.to(dialMidder.value, {
    rotate: -360,
    duration: 10,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  tlOuter = gsap.to(dialOuter.value, {
    rotate: 360,
    duration: 15,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  // Guardamos funciones en variables
  onEnter = () => {
    tlInner.timeScale(3);
    tlMidder.timeScale(3);
    tlOuter.timeScale(3);
  };

  onLeave = () => {
    tlInner.timeScale(0.3);
    tlMidder.timeScale(0.3);
    tlOuter.timeScale(0.3);
  };

  lockContainer.value.addEventListener('mouseenter', onEnter);
  lockContainer.value.addEventListener('mouseleave', onLeave);
});

onBeforeUnmount(() => {
  lockContainer.value.removeEventListener('mouseenter', onEnter);
  lockContainer.value.removeEventListener('mouseleave', onLeave);
});

// lluvia de datos 2
const canvas2 = ref(null);
onMounted(() => {
  const ctx = canvas2.value.getContext('2d');
  const symbolWidth = 30;
  const symbolHeight = 16;
  const width = 420;
  const height = 320;

  canvas2.value.width = width;
  canvas2.value.height = height;

  const columns = Math.floor(width / symbolWidth);
  const drops = Array.from({ length: columns }, () => ({
    y: Math.floor(Math.random() * (height / symbolHeight)),
    letters: Array(5).fill(''),
    frameCount: 0,
  }));

  const getRandomChar = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890!"#%&';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  const updateLetters = (index) => {
    const drop = drops[index];
    drop.frameCount += 1;
    if (drop.frameCount >= 10) {
      drop.letters = drop.letters.map(() => getRandomChar());
      drop.frameCount = 0;
    }
  };

  let animationFrameId;

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    ctx.font = `200 ${symbolHeight}px alexandria, sans-serif`;

    for (let i = 0; i < drops.length; i += 1) {
      updateLetters(i);

      const drop = drops[i];

      for (let j = drop.letters.length - 1; j >= 0; j -= 1) {
        const char = drop.letters[j];
        const opacity = (j + 1) / drop.letters.length;
        const shouldGlow = Math.random() > 0.6; // probabilidad brillo
        if (shouldGlow) {
          ctx.shadowColor = 'rgba(11, 119, 243, 0.8)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(11, 119, 243, ${Math.min(opacity + 0.2, 1)})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(0, 123, 255, ${opacity})`; // equivalente a #007bff
        }
        ctx.fillText(char, i * symbolWidth, (drop.y - j) * symbolHeight);
      }
      const newY = drop.y - 0.11;
      drops[i] = {
        ...drop,
        y: newY < 1 && Math.random() > 0.9 ? Math.floor(height / symbolHeight) : newY,
      };
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  animationFrameId = requestAnimationFrame(draw);

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
  });
});

onMounted(() => { // animación welcome con aceleración inicial
  const svgObject = document.getElementById('Welcome');

  if (!svgObject) return;

  const startAnimation = () => {
    const svg = svgObject.contentDocument.querySelector('svg');
    if (!svg) return;

    // 🔹 Primera animación rápida (aceleración)
    gsap.fromTo(
      svg,
      { x: '0%' },
      {
        x: '-10%',
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          // 🔹 Luego animación infinita lenta
          gsap.fromTo(
            svg,
            { x: '-10%' },
            {
              x: '-100%',
              duration: 130,
              ease: 'linear',
              repeat: -1,
            },
          );
        },
      },
    );
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (svgObject.contentDocument?.readyState === 'complete') {
          startAnimation();
        } else {
          svgObject.addEventListener('load', startAnimation, { once: true });
        }
        obs.unobserve(svgObject);
      }
    });
  });

  observer.observe(svgObject);
});

watch(isLight, () => {
  const heading = document.getElementById('animated-heading');
  if (!heading) return;

  const spans = heading.querySelectorAll('span');

  const { from } = getHeadingColors();
  gsap.set(spans, { color: from });
});
</script>
