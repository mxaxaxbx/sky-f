<template>
  <section class="bg-[#EDF5FF] font-alexandria py-16 px-8">
    <div class="container mx-auto text-center">
      <h2 class="text-5xl md:text-6xl lg:text-8xl text-[#0B77F3] font-bold mb-6 sm:leading-tight">
        Store. Share.<br>Access from Anywhere
      </h2>
      <p class="text-md md:text-md lg:text-lg font-semibold text-[#5E5E5E] mb-10">
        Keep your ideas, memories, and projects safe and accessible <br />anytime, anywhere.
      </p>
      <a
        href="#storage-features"
        class="bg-[#0B77F3] text-lg text-white font-semibold px-10 py-3 rounded-full mb-12
          hover:bg-white hover:text-[#0B77F3] hover:shadow transition duration-300"
      >
        Get Started
        <i class="fas fa-arrow-right pl-2"></i>
      </a>
    </div>
    <div class="relative w-full h-full flex items-center justify-center pt-24 lg:pt-32">
      <object
        id="Icons"
        aria-label="Icons SVG"
        type="image/svg+xml"
        data="iconos.svg"
        class="absolute w-72 md:w-80 lg:w-[450px] h-auto z-30"
      ></object>
      <object
        id="network"
        aria-label="Network SVG"
        type="image/svg+xml"
        data="red.svg"
        class="absolute w-72 md:w-80 lg:w-[450px] h-auto z-20"
      ></object>
      <object
        id="cloud"
        aria-label="Cloud SVG"
        type="image/svg+xml"
        data="nube.svg"
        class="absolute w-72 md:w-80 lg:w-[450px] h-auto z-10"
      ></object>
      <div
        id="wrapper"
        class="translate-y-16 lg:translate-y-28 w-72 md:w-80 lg:w-[450px] h-10 z-0"
        ref="wrapper"
      >
        <canvas ref="canvas" class="center"></canvas>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { debounce } from 'lodash-es';

const canvas = ref(null);

onMounted(() => {
  const canvasEl = canvas.value;
  const ctx = canvasEl.getContext('2d');
  const symbolWidth = 30;
  const symbolHeight = 16;
  const drops = [];

  const getRandomChar = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890!#%&';
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

  const resizeCanvas = debounce(() => {
    const { offsetWidth } = canvasEl.parentElement;
    const width = offsetWidth;
    const height = 220;

    canvasEl.width = width;
    canvasEl.height = height;

    const columns = Math.floor(width / symbolWidth);
    drops.length = 0;

    for (let i = 0; i < columns; i += 1) {
      drops.push({
        y: Math.floor(Math.random() * (height / symbolHeight)),
        letters: Array(5).fill(''),
        frameCount: 0,
      });
    }
  }, 200);

  let animationFrameId;

  const draw = () => {
    const { width, height } = canvasEl;
    ctx.clearRect(0, 0, width, height);

    ctx.font = `200 ${symbolHeight}px alexandria, sans-serif`;

    for (let i = 0; i < drops.length; i += 1) {
      updateLetters(i);
      const drop = drops[i];

      for (let j = drop.letters.length - 1; j >= 0; j -= 1) {
        const char = drop.letters[j];
        const opacity = (j + 1) / drop.letters.length;
        const shouldGlow = Math.random() > 0.6;

        if (shouldGlow) {
          ctx.shadowColor = 'rgba(11, 119, 243, 0.8)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(11, 119, 243, ${Math.min(opacity + 0.2, 1)})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(0, 123, 255, ${opacity})`;
        }

        ctx.fillText(char, i * symbolWidth, (drop.y - j) * symbolHeight);
      }

      const newY = drop.y - 0.11;
      drop.y = newY < 1 && Math.random() > 0.9
        ? Math.floor(height / symbolHeight)
        : newY;
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animationFrameId = requestAnimationFrame(draw);

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeCanvas);
  });
});

const animateSVG = (id, strokeColor, duration, step) => {
  const svgObject = document.getElementById(id);
  svgObject.addEventListener('load', () => {
    const svgDoc = svgObject.contentDocument;
    const paths = svgDoc.querySelectorAll('line, path, circle, polygon, polyline');

    paths.forEach((path, i) => {
      const delay = i * step + Math.random() * 0.5;

      gsap.to(path, {
        stroke: strokeColor,
        strokeWidth: 2,
        filter: 'drop-shadow(0 0 3px rgba(0, 238, 255, 0.3))',
        repeat: -1,
        yoyo: true,
        duration,
        delay,
        ease: 'power2.inOut',
      });
    });
  });
};

onMounted(() => {
  animateSVG('network', '#ffffff', 0.7, 0.3);
  animateSVG('Icons', '#71C4FF', 1, 0.8);
});
</script>
