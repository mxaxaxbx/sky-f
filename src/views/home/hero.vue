<template>
    <section class="bg-[#EDF5FF] font-alexandria py-16 pb-[100px] px-10">
      <div class="container mx-auto text-center">
        <h2 class="text-5xl md:text-6xl lg:text-8xl
          text-[#0B77F3] font-bold mb-6 leading-tight">
          Store. Share.<br>Access from anywhere </h2>
        <p class="text-lg font-semibold text-[#5E5E5E] mb-10">
          Keep your memories, projects, and ideas safe — always accessible, always yours. <br>
          Focus on what matters. We'll handle the storage.
        </p>
        <a
          href="#storage-features"
          class="bg-[#0B77F3] text-lg text-white font-semibold
            px-10 py-3 rounded-full mb-10
            hover:bg-white hover:text-[#0B77F3] hover:shadow transition duration-300"
        >
          Get Started
          <i class="fas fa-arrow-right pl-2"></i>
        </a>
      </div>
      <div class="relative w-full h-full flex items-center justify-center pt-32 lg:pt-40">
        <object id="Icons"
          aria-label="Icons SVG"
          type="image/svg+xml"
          data="iconos.svg"
          class="absolute w-72 md:w-80 lg:w-[450px] h-auto z-30"></object>
        <!-- red plano medio -->
        <object id="network"
          aria-label="Network SVG"
          type="image/svg+xml"
          data="red.svg"
          class="absolute w-72 md:w-80 lg:w-[450px] h-auto z-20"></object>
          <!-- Nube fondo -->
        <object id="cloud"
          aria-label="cloud SVG"
          type="image/svg+xml"
          data="nube.svg"
          class="absolute w-72 md:w-80 lg:w-[450px] h-auto z-10"></object>
          <!-- Lluvia de datos -->
        <div id="wrapper"
          class="absolute translate-y-52  h-auto"
          ref="wrapper">
          <canvas ref="canvas" class="block z-0"></canvas>
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

// lluvia de datos
const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  const symbolWidth = 30;
  const symbolHeight = 16;
  const width = 420;
  const height = 220;

  canvas.value.width = width;
  canvas.value.height = height;

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

// nube animacion datos
onMounted(() => {
  const svgObject = document.getElementById('network');

  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll('line, path, circle');

    const step = 0.3;

    paths.forEach((path, i) => { // eslint-disable-next-line no-param-reassign
      path.style.stroke = ''; // eslint-disable-next-line no-param-reassign
      path.style.fill = ''; // eslint-disable-next-line no-param-reassign
      path.style.filter = ''; // eslint-disable-next-line no-param-reassign
      path.style.opacity = '1';

      const delay = i * 0.5 + Math.random() * 2;

      gsap.to(path, {
        stroke: '#ffffff',
        strokeWidth: 2,
        filter: 'drop-shadow(0 0 3px rgba(0, 238, 255, 0.3))',
        repeat: -1,
        yoyo: true,
        duration: 0.7,
        delay: delay + i * step,
        ease: 'power2.inOut',
      });
    });
  });
});

onMounted(() => { // nube animacion iconos
  const svgObject = document.getElementById('Icons');
  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll('polygon,polyline, path');

    const step = 0.8;

    paths.forEach((path, i) => { // eslint-disable-next-line no-param-reassign
      path.style.stroke = ''; // eslint-disable-next-line no-param-reassign
      path.style.fill = ''; // eslint-disable-next-line no-param-reassign
      path.style.filter = ''; // eslint-disable-next-line no-param-reassign
      path.style.opacity = '1';

      const delay = i * 0.9 + Math.random() * 0;

      gsap.to(path, {
        stroke: '#71C4FF',
        strokeWidth: 0,
        filter: 'drop-shadow(0 0 0.5px rgba(0, 238, 255, 0.3))',
        repeat: -1,
        yoyo: true,
        duration: 1,
        delay: delay + i * step,
        ease: 'power2.inOut',
      });
    });
  });
});
</script>
