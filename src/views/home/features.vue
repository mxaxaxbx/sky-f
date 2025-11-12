<template>
   <section class="bg-[#EDF5FF] font-alexandria py-2  pt-40 pb-8">
      <div class="reltive w-full h-full flex items-left justify-left pt-12">
        <div class="absolute w-full lg:h-52 h-20
          bg-gradient-to-r from-transparent to-[#EDF5FF]/100">
        </div>
        <div class="relative overflow-hidden w-full">
        <div class="absolute w-full lg:h-46 h-20
          bg-gradient-to-r from-transparent to-[#EDF5FF]/50">
        </div>
        <object id="Welcome"
              aria-label="Welcome SVG"
              type="image/svg+xml"
              data="Welcome.svg"
              class="w-auto lg:h-52 h-20
              animate-slide-in-left"></object>
      </div>
      </div>
      <div class="container w-[95%] md:[80%] lg:w-[70%]
        flex flex-row items-center justify-between
        mx-auto pt-16 pb">
        <h2 id="animated-heading"
        class="text-3xl lg:text-5xl font-bold lg:font-bold
        lg:font-bold text-left mb-4">
        We built a private cloud
        <br> that puts you in control,<br> with a fast, intuitive,<br> and hassle-free
  <span class="text-[#0B77F3] pl-2 lg:pl-0">Experience.</span>
</h2>
        <div id="wrapper2"
            class="opacity-50 hidden md:block"
            ref="wrapper2">
            <canvas ref="canvas2" class="block"></canvas>
        </div>
      </div>
      <div
        class="container w-full lg:w-[75%]
          flex flex-row items-center justify-between
          mx-auto gap-4
          pt-16 pb-20 px-6 lg:px-12
          overflow-x-auto lg:overflow-x-visible
          hide-scrollbar"
      >
        <div
          class="
            animated-card
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 min-w-80 max-w-80 h-92
            rounded-[56px]
            pt-10 pb-10 gap-y-2
          "
        >
        <h3
          class="
            text-[#0A77F3] text-3xl font-bold
            mt-2
          "
        >
          Secure Storage
        </h3>
        <!-- seguridad -->
        <div
          ref="lockContainer"
          class="w-64 h-64
            relative flex items-center justify-center
          ">
          <!-- Base del candado -->
          <object
            id="lockbase"
            aria-label="lockBase SVG"
            type="image/svg+xml"
            data="lock-base.svg"
            class="absolute z-50 left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2 w-full h-full
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
          <p class="text-[#797979] text-lg font-semibold leading-tight text-left">
            Store your files securely with<br />end-to-end encryption.
          </p>
        </div>
        <div
          class="
            animated-card
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 min-w-80 max-w-80 h-92
            rounded-[56px]
            pt-10 pb-10 gap-y-2
          "
        >
        <h3
          class="
            text-[#0A77F3] text-3xl font-bold
            mt-2
          "
        >
          Unlimited Access
        </h3>
       <!-- Aqui va la nueva animacion -->
        <div
          ref="planetContainer"
          class="w-64 h-64
            relative flex items-center justify-center
          ">
          <!-- Base del candado -->
          <object
            id="planetBase"
            aria-label="planetBase SVG"
            type="image/svg+xml"
            data="sun.svg"
            class="absolute z-50 left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2 w-full h-full
            ">
          </object>
          <!-- Círculo izquierdo -->
          <img
            ref="orbit1"
            src="/orbit1.svg"
            alt="orbit1"
            class="absolute z-20"
          />
          <!-- Círculo del medio -->
          <img
            ref="orbit2"
            src="/orbit2.svg"
            alt="orbit2"
            class="absolute z-30"
          />
          <!-- Círculo derecho -->
          <img
            ref="orbit3"
            src="/orbit3.svg"
            alt="orbit3"
            class="absolute z-40"
          />
        </div>
          <p class="text-[#797979] text-lg font-semibold leading-tight text-left">
            Collaborate instantly with your<br />friends and colleagues.
          </p>
        </div>
        <div
          class="
            animated-card
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 min-w-80 max-w-80 h-92
            rounded-[56px]
            pt-10 pb-10 gap-y-2
          "
        >
        <h3
          class="
            text-[#0A77F3] text-3xl font-bold
            mt-2
          "
        >
          Organize Files
        </h3>
    <div class="w-64 h-64 relative flex" ref="organiceContainer">
    <!-- Base -->
    <img
      src="Organice.svg"
      alt="Organice"
      class="absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
    />

    <!-- Hotspots -->
    <img
      src="dgsky-organice1.svg"
      alt=""
      class="js-hotspot absolute h-[20px] z-50"
      style="left: 165px; top: 110px;"
    />
    <img
      src="dgsky-organice2.svg"
      alt=""
      class="js-hotspot absolute h-[20px] z-50"
      style="left: 75px; top: 50px;"
    />
    <img
      src="dgsky-organice3.svg"
      alt=""
      class="js-hotspot absolute h-[20px] z-50"
      style="left: 130px; top: 225px;"
    />
    <img
      src="dgsky-organice4.svg"
      alt=""
      class="js-hotspot absolute h-[20px] z-50"
      style="left: -5px; top: 156px;"
    />
  </div>
          <p class="text-[#797979] text-lg font-semibold leading-tight text-left">
            Keep your files organized with<br />folders and tags for easy access.
          </p>
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
} from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    gsap.set(animatedSpans, { color: '#9DC9FA' });

    gsap.to(animatedSpans, {
      color: '#3d3d3d',
      stagger: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heading,
        start: 'top 90%',
        end: 'bottom 50%',
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
</script>
