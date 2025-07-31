<template>
   <section class="bg-[#EDF5FF] font-alexandria py-2  pt-32">
      <div class="reltive w-full h-full flex items-left justify-left pt-12">
        <div class="absolute w-full lg:h-52 h-20
          bg-gradient-to-r from-transparent to-[#EDF5FF]/100">
        </div>
        <div class="relative overflow-hidden w-full">
        <div class="absolute w-full lg:h-52 h-20
          bg-gradient-to-r from-transparent to-[#EDF5FF]/50">
        </div>
        <object id="Welcome"
              aria-label="Welcome SVG"
              type="image/svg+xml"
              data="Welcome.svg"
              class="w-auto lg:h-52 h-20"></object>
      </div>
      </div>
      <div class="container w-[90%] md:[80%] lg:w-[75%]
        flex flex-row items-center justify-between
        mx-auto pt-10">
        <h2 class="text-3xl lg:text-6xl text-[#3D3D3D] font-semibold lg:font-bold text-left mb-4">
          We built a private cloud<br>
          that puts you in control,<br>
          with a fast, intuitive, and<br>
          hassle-free <span class="text-[#0B77F3]">Experience.</span></h2>
        <div id="wrapper2"
            class="opacity-50 hidden md:block"
            ref="wrapper2">
            <canvas ref="canvas2" class="block"></canvas>
        </div>
      </div>
      <div
        class=" container
          w-[75%]
          flex flex-row items-center justify-between
          mx-auto spaces-x-4
          pt-8 pb-20"
      >
        <div
          class="
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 h-92
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
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 h-92
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
        <!-- Aqui va la nueva animacion -->
        <!-- Aqui va la nueva animacion -->
        <div
          ref="lockContainer"
          class="w-64 h-64
            relative flex items-center justify-center
          ">
          <!-- Base del candado -->
          <object
            id="Organice"
            aria-label="Organice SVG"
            type="image/svg+xml"
            data="Organice.svg"
            class="absolute z-50 left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2 w-full h-full
            ">
          </object>
          <!-- Círculo izquierdo -->
        </div>
          <p class="text-[#797979] text-lg font-semibold leading-tight text-left">
            Keep your files organized with<br />folders and tags for easy access.
          </p>
        </div>
        <div
          class="
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 h-92
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
            flex flex-col items-center justify-between
            bg-[#ffffff]
            w-80 h-92
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
        <!-- Aqui va la nueva animacion -->
        <!-- Aqui va la nueva animacion -->
        <!-- Aqui va la nueva animacion -->
          <p class="text-[#797979] text-lg font-semibold leading-tight text-left">
            Store your files securely with<br />end-to-end encryption.
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
} from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// animacion planetas
onMounted(() => {
  const svgObject = document.getElementById('planetBase');

  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll('circle');

    const step = 0.3;
    const animations = [];

    paths.forEach((path, i) => {
      // Empieza desde escala pequeña y opacidad completa
      gsap.set(path, {
        scale: 0.8,
        opacity: 1,
        transformOrigin: 'center center',
      });

      const delay = i * step + Math.random() * 0.5;

      const tl = gsap.to(path, {
        scale: 1.2,
        stroke: 'rgba(255, 255, 255, 0.3)',
        strokeWidth: 1,
        filter: 'drop-shadow(0 0 3px rgba(0, 238, 255, 0.2))',
        opacity: 1,
        duration: 3,
        delay,
        repeat: -1,
        ease: 'power1.out',
      });

      animations.push({ path, tl });
    });

    // Hover (opcional)
    svgObject.addEventListener('mouseenter', () => {
      animations.forEach(({ path, tl }) => {
        tl.pause();
        gsap.to(path, {
          scale: 1,
          duration: 0.5,
          stroke: '#0A77F3',
          opacity: 1,
          ease: 'power1.out',
        });
      });
    });

    svgObject.addEventListener('mouseleave', () => {
      animations.forEach(({ tl }) => {
        tl.play();
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
    duration: 12,
    repeat: -1,
    ease: 'linear',
    opacity: 1,
    transformOrigin: '50% 50%',
  });

  tlOrbit2 = gsap.to(orbit2.value, {
    rotate: -360,
    duration: 12,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  tlOrbit3 = gsap.to(orbit3.value, {
    rotate: 360,
    duration: 9,
    repeat: -1,
    ease: 'linear',
    transformOrigin: '50% 50%',
  });

  // Guardamos funciones en variables
  onEnter1 = () => {
    tlOrbit1.timeScale(0.2);
    tlOrbit2.timeScale(0.2);
    tlOrbit3.timeScale(0.2);
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

// animacion candado
onMounted(() => {
  const svgObject = document.getElementById('lockbase');

  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll('circle');

    const step = 0.3;
    const animations = [];

    paths.forEach((path, i) => { // eslint-disable-next-line no-param-reassign
      // Empieza desde escala pequeña y opacidad completa
      gsap.set(path, {
        scale: 0.8,
        opacity: 1,
        transformOrigin: 'center center',
      });

      const delay = i * step + Math.random() * 0.5;

      const tl = gsap.to(path, {
        scale: 1.5,
        stroke: 'rgba(255, 255, 255, 0.3)',
        strokeWidth: 1,
        filter: 'drop-shadow(0 0 3px rgba(0, 238, 255, 0.2))',
        opacity: 1,
        duration: 3,
        delay,
        repeat: -1,
        ease: 'power1.out',
      });

      animations.push({ path, tl });
    });

    // Hover handlers en el <object> que contiene el SVG
    svgObject.addEventListener('mouseenter', () => {
      animations.forEach(({ path, tl }) => {
        tl.pause();
        gsap.to(path, {
          scale: 0.9,
          duration: 0.5,
          stroke: '#0A77F3',
          opacity: 1,
          ease: 'power1.out',
        });
      });
    });
    svgObject.addEventListener('mouseleave', () => {
      animations.forEach(({ tl }) => {
        tl.play();
      });
    });
  });
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

onMounted(() => { // animacion welcome
  const svgObject = document.getElementById('Welcome');

  svgObject.addEventListener('load', () => {
    const svg = svgObject.contentDocument.querySelector('svg');

    gsap.fromTo(
      svg,
      { x: '0%' },
      {
        x: '-100%',
        duration: 120,
        ease: 'linear',
        repeat: -1,
      },
    );
  });
});
</script>
