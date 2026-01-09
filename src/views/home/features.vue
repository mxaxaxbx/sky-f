<template>
   <section class="bg-[var(--bg)] font-alexandria font-sans py-2  pt-40 pb-8">
    <div class="w-full flex items-center justify-center">
</div>
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
          ref="lockContainer"
          class="
            group
            animated-card
            flex flex-col
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            h-96 px-6 pt-6
            rounded-lg
            cursor-pointer

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
            class="relative flex items-center justify-center
              mt-6 w-64 h-64 opacity-50 group-hover:opacity-100
            ">
            <!-- Base del candado -->
            <div class="flex items-center justify-center px-auto">
              <svg id="locky" class="lock z-50" width="45" height="61" viewBox="0 0 45 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.5234 20.9767C39.0053 21.3079 44.1602 26.7184 44.1602 33.3449V48.2062C44.1602 54.8327 39.0053 60.2432 32.5234 60.5744L31.8936 60.591H12.2666C5.49194 60.5909 0 55.046 0 48.2062V33.3449C0 26.5051 5.49194 20.9602 12.2666 20.9601H31.8936L32.5234 20.9767ZM12.2666 25.9142C8.20182 25.9143 4.90625 29.241 4.90625 33.3449V48.2062C4.90625 52.3101 8.20182 55.6368 12.2666 55.6369H31.8936C35.9583 55.6368 39.2539 52.3101 39.2539 48.2062V33.3449C39.2539 29.241 35.9583 25.9143 31.8936 25.9142H12.2666Z" fill="#0A77F3"/>
                <path id="lock-shackle" d="M12.6667 15.1579C12.6667 9.57691 16.8453 5.05263 22 5.05263C27.1547 5.05263 31.3333 9.57691 31.3333 15.1579V17.6842H36V15.1579C36 6.78642 29.732 0 22 0C14.268 0 8 6.78642 8 15.1579V22L12.6667 21.7928V15.1579Z" fill="#0A77F3"/>
                <path d="M21.8263 50.4002C19.695 49.9048 17.9355 48.776 16.5478 47.0139C15.1601 45.2517 14.4663 43.2949 14.4663 41.1435V35.9632L21.8263 33.4155L29.1864 35.9632V41.1435C29.1864 43.2949 28.4925 45.2517 27.1048 47.0139C25.7172 48.776 23.9577 49.9048 21.8263 50.4002Z" fill="#0A77F3"/>
              </svg>
            </div>
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
            <!-- Círculo derecho -->
            <img
              ref="dialBig"
              src="/dial-big.svg"
              alt="big"
              class="absolute z-40"
            />
          </div>
        </div>

        <!-- Organize Files -->
          <div
            ref="organiceContainer"
            class="
              group
              animated-card
              flex flex-col
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              h-96 px-6 pt-6
              rounded-lg
              cursor-pointer

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
            class="relative flex mt-6 w-64 h-64 opacity-50
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
          ref="planetContainer"
          @mouseenter="onHover(true)"
          @mouseleave="onHover(false)"
          @focus="onHover(true)"
          @blur="onHover(false)"
          class="
            group
            animated-card
            flex flex-row
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            pt-6 h-96 overflow-hidden
            rounded-lg
            cursor-pointer

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
            <div class="mt-auto mb-4 jutify-self-end">
              <span
                class="
                  inline-flex items-center gap-1
                  text-[var(--text-terceary)] text-sm font-regular
                  transition-colors duration-300
                  group-hover:text-[var(--text)]
                  cursor-pointer
                "
              >
                Try it now
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="
                    w-4 h-4 ml-2
                    text-[var(--text-terceary)]
                    transition-all duration-150
                    group-hover:text-[var(--text)]
                    arrow-move
                  "
                >
                  <path
                    transform="rotate(-45 10 10)"
                    fill-rule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1
                    1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
       <!-- Aqui va la nueva animacion -->
        <div class="relative flex w-56">
          <div
            class="w-96 h-96 top-4 left-8
              absolute flex items-center justify-center
              opacity-50 group-hover:opacity-100 transition-opacity duration-300
            ">
            <svg
              :width="size"
              :height="size"
              viewBox="0 0 800 800"
              class="overflow-visible rotate-20"
              >
              <!-- Órbitas + planetas -->
              <g v-for="(planet, i) in planets" :key="i" transform="rotate(-4  400 400)">
              <!-- Órbita elíptica -->
              <ellipse
              cx="400"
              cy="400"
              :rx="planet.rx"
              :ry="planet.ry"
              fill="none"
              stroke="#0A77F3"
              stroke-width="0.5"
              :stroke-opacity="planet.opacity"
              />

              <!-- Planeta -->
              <circle
              :cx="400 + planet.rx * Math.cos(planet.angle)"
              :cy="400 + planet.ry * Math.sin(planet.angle)"
              :r="planet.size"
              :fill="planet.color"
              />
              </g>
              <!-- Sol -->
              <defs>
                <filter id="circle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="8"
                    flood-color="var(--color-primary)"
                    flood-opacity="0.8"
                  />
                </filter>
              </defs>
              <circle cx="400" cy="392" r="32" fill="var(--sun)"
              stroke="var(--hover-border)"
              filter="url(#circle-shadow)"
              stroke-width="0.5
              "/>
              </svg>
            </div>
        </div>
        </div>
    </div>
  </section>
</template>
<script setup>
import {
  reactive,
  onMounted,
  ref,
  onBeforeUnmount,
  defineAsyncComponent,
  computed,
  watch,
} from 'vue';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useStore } from 'vuex';

gsap.registerPlugin(ScrollTrigger);

const store = useStore();

const isLight = computed(() => store.state.theme.theme === 'light');

// rain data
const canvas2 = ref(null);

let animationFrameId;

// orbitas solar system
const planetContainer = ref(null);
const orbit1 = ref(null);
const orbit2 = ref(null);
const orbit3 = ref(null);

let tlOrbit1;
let tlOrbit2;
let tlOrbit3;
let onEnter1;
let onLeave1;

// Welcome animation
onMounted(() => {
  const svgObject = document.getElementById('Welcome');

  if (!svgObject) return;

  const startAnimation = () => {
    const svg = svgObject.contentDocument.querySelector('svg');
    if (!svg) return;

    // Primera animación rápida (aceleración)
    gsap.fromTo(
      svg,
      { x: '0%' },
      {
        x: '-10%',
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          // Luego animación infinita lenta
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
// end Welcome animation

// data rain 2
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

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    ctx.font = `200 ${symbolHeight}px alexandria, sans-serif`;

    for (let i = 0; i < drops.length; i += 1) {
      updateLetters(i);

      const drop = drops[i];

      for (let j = drop.letters.length - 1; j >= 0; j -= 1) {
        const char = drop.letters[j];
        const opacity = (j + 1) / drop.letters.length;
        const shouldGlow = Math.random() > 0.5; // probabilidad brillo
        if (shouldGlow) {
          ctx.shadowColor = 'rgba(11, 119, 243, 0.6)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(11, 119, 243, ${Math.min(opacity + 0.5, 1)})`;
        } else {
          ctx.shadowBlur = 5;
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
// end data rain 2

// cambio de color heading
const getHeadingColors = () => ({
  from: isLight.value ? '#0A77F3' : '#0A77F3',
  to: getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary')
    .trim(),
});

/* Slide-in-up para tarjetas */
onMounted(() => {
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
          toggleActions: 'play none none none',
          once: true,
        },
      });
    });
  }

  /* Animación cambio de color en heading */
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

// Clase adaptada directamente de organice (hay que cambiarlo para que se vea mas cool)
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
// end magnetic

// animation segurity (hay que mejorarla)
const dialInner = ref(null);
const dialMidder = ref(null);
const dialOuter = ref(null);
const dialBig = ref(null);
const lockContainer = ref(null);

let tlInner;
let tlMidder;
let tlOuter;
let tlBig;
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
  tlBig = gsap.to(dialBig.value, {
    rotate: -360,
    duration: 28,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  // Guardamos funciones en variables
  onEnter = () => {
    gsap.to([tlInner, tlMidder, tlOuter, tlBig], {
      timeScale: 3,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  onLeave = () => {
    gsap.to([tlInner, tlMidder, tlOuter, tlBig], {
      timeScale: 0.9,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  lockContainer.value.addEventListener('mouseenter', onEnter);
  lockContainer.value.addEventListener('mouseleave', onLeave);
});
onBeforeUnmount(() => {
  lockContainer.value.removeEventListener('mouseenter', onEnter);
  lockContainer.value.removeEventListener('mouseleave', onLeave);
});
// end animacion segurity

// animation solar system
onMounted(() => {
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
// end animation sysolar system

// watch theme for heading
watch(isLight, () => {
  const heading = document.getElementById('animated-heading');
  if (!heading) return;

  const spans = heading.querySelectorAll('span');

  const { from } = getHeadingColors();
  gsap.set(spans, { color: from });
});

const size = 1150;

const speedMultiplier = ref(1);
const HOVER_MULTIPLIER = 2;

function onHover(isHovering) {
  speedMultiplier.value = isHovering ? HOVER_MULTIPLIER : 1;
}

const planets = reactive([
  {
    rx: 80,
    ry: 30,
    angle: 10,
    speed: 0.01,
    size: 3,
    opacity: 0.8,
    color: '#2473CE',
  },
  {
    rx: 120,
    ry: 48,
    angle: 8,
    speed: 0.009,
    size: 4,
    opacity: 0.7,
    color: '#AAD2FF',
  },
  {
    rx: 180,
    ry: 65,
    angle: 2,
    speed: 0.004,
    size: 5,
    opacity: 0.6,
    color: '#0052AF',
  },
  {
    rx: 250,
    ry: 80,
    angle: 2.5,
    speed: 0.002,
    size: 8,
    opacity: 0.5,
    color: '#64A8F5',
  },
  {
    rx: 310,
    ry: 95,
    angle: 3.5,
    speed: 0.002,
    size: 2,
    opacity: 0.4,
    color: '#DEEDFF',
  },
]);

function animate() {
  planets.forEach((planet, index) => {
    planets[index].angle += planet.speed * speedMultiplier.value;
  });

  requestAnimationFrame(animate);
}

onMounted(() => {
  animate();
});

</script>
<style scoped>
  .group:hover .arrow-move {
    animation: arrowMove 1s ease-in-out;
  }

  @keyframes arrowMove {
    0% {
      transform: rotate(0deg) translate(0, 0);
      opacity: 1;
    }
    40% {
      transform: rotate(0deg) translate(6px, -6px);
      opacity: 0;
    }
    60% {
      transform: rotate(0deg) translate(-6px, 6px);
      opacity: 0;
    }
    100% {
      transform: rotate(0deg) translate(0, 0);
      opacity: 1;
    }
  }
  #locky {
    transform-box: fill-box;
  transform-origin: center bottom;
  transition: transform 0.45s cubic-bezier(.4,0,.2,1);

  /* estado inicial: abierto hacia la derecha */
  transform: translateY(0px);
  }
  .group:hover #locky {
  transform: translateY(-4px);
}

  #lock-shackle {
  transform-box: fill-box;
  transform-origin: center bottom;
  transition: transform 0.45s cubic-bezier(.4,0,.2,1);

  /* estado inicial: abierto hacia la derecha */
  transform: translateY(0px);
}

/* hover: se voltea a la izquierda y baja */
.group:hover #lock-shackle {
  transform: translateY(3.8px);
}
</style>
