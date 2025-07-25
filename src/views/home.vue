<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-[#EDF5FF] font-alexandria py-24 pb-[90px] px-10">
      <div class="container mx-auto text-center">
        <h2 class="text-8xl text-[#0B77F3] font-bold mb-6">
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
      <div class="reltive w-full h-full flex items-center justify-center pt-12">
        <object id="Icons"
          aria-label="Icons SVG"
          type="image/svg+xml"
          data="iconos.svg"
          class="absolute w-[450px] h-auto z-30"></object>
        <!-- red plano medio -->
        <object id="network"
          aria-label="Network SVG"
          type="image/svg+xml"
          data="red.svg"
          class="absolute w-[450px] h-auto z-20"></object>
          <!-- Nube fondo -->
        <object id="cloud"
          aria-label="cloud SVG"
          type="image/svg+xml"
          data="nube.svg"
          class="w-[450px] h-auto z-10"></object>
          <!-- Lluvia de datos -->
        <div id="wrapper"
          class="absolute top-2/3 h-auto"
          ref="wrapper">
          <canvas ref="canvas" class="block z-0"></canvas>
        </div>
      </div>
    </section>
    <!-- Features Section -->
    <section class="bg-[#EDF5FF] font-alexandria py-2 pb-[160px]">
      <div class="reltive w-full h-full flex items-left justify-left pt-12">
        <div class="absolute w-full h-[210px]
          bg-gradient-to-r from-transparent to-[#EDF5FF]/100">
        </div>
        <div class="absolute w-full h-[210px]
          bg-gradient-to-r from-transparent to-[#EDF5FF]/50">
        </div>
        <object id="Welcome"
              aria-label="Welcome SVG"
              type="image/svg+xml"
              data="Welcome.svg"
              class="w-auto h-[210px]"></object>
      </div>
      <div class="w-[65%] mx-auto flex flex-row items-center justify-between pt-24">
        <h2 class="text-6xl font-bold text-left mb-12 pt-12">
          We built a private cloud<br>
          that puts you in control,<br>
          with a fast, intuitive, and<br>
          hassle-free <span class="text-[#0B77F3]">Experience.</span></h2>
        <div id="wrapper2"
            class="block opacity-50"
            ref="wrapper2">
            <canvas ref="canvas2" class="block"></canvas>
        </div>
      </div>
      <div class="w-[75%] mx-auto flex flex-row items-center justify-between">
        <div class="grid md:grid-cols-4 gap-8 text-center pt-36">
          <div class="bg-[#ffffff] rounded-2xl h-[400px]">
            <svg 
              class="w-12 h-12 mx-auto text-purple-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v8m4-4H8" />
            </svg>
            <h3 class="text-xl font-semibold mt-4"> Secure Storage </h3>
            <p class="mt-2 text-gray-600">
              Store your files securely and access them from any device, anywhere.
            </p>
          </div>
          <div class="bg-[#ffffff] rounded-xl h-[400px]">
            <svg class="w-12 h-12 mx-auto text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
            </svg>
            <h3 class="text-xl font-semibold mt-4"> Secure Storage </h3>
            <p class="mt-2 text-gray-600">
              Store your files securely and access them from any device, anywhere.
            </p>
          </div>
          <div class="bg-[#ffffff] rounded-xl h-[400px]">
            <svg class="w-12 h-12 mx-auto text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
            </svg>
            <h3 class="text-xl font-semibold mt-4"> Secure Storage </h3>
            <p class="mt-2 text-gray-600">
              Store your files securely and access them from any device, anywhere.
            </p>
          </div>
          <div class="bg-[#ffffff] rounded-xl h-[400px]">
            <svg class="w-12 h-12 mx-auto text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
            </svg>
            <h3 class="text-xl font-semibold mt-4"> Secure Storage </h3>
            <p class="mt-2 text-gray-600">
              Store your files securely and access them from any device, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Storage Features Section -->
    <section id="storage-features" class="bg-gray-100 py-16">
      <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Storage Features</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Feature Card -->
        <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Secure Storage</h3>
        <p class="text-gray-600 mb-4">
          Store your files securely with end-to-end encryption.</p>
        <a href="#" class="bg-purple-600 text-white px-4 py-2 rounded">Learn More</a>
        </div>
        <!-- Feature Card -->
        <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Easy Sharing</h3>
        <p class="text-gray-600 mb-4">
          Share your files with friends and colleagues with just a few clicks.</p>
        <a href="#" class="bg-purple-600 text-white px-4 py-2 rounded">Learn More</a>
        </div>
        <!-- Feature Card -->
        <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Access Anywhere</h3>
        <p class="text-gray-600 mb-4">
          Access your files from any device, anywhere in the world.</p>
        <a href="#" class="bg-purple-600 text-white px-4 py-2 rounded">Learn More</a>
        </div>
      </div>
      </div>
    </section>
    <!-- Users Section -->
    <section class="container mx-auto py-16">
      <div class="bg-purple-600 text-white p-12 rounded-lg text-center">
      <h2 class="text-3xl font-bold mb-6"> Join thousands of users who trust our platform </h2>
      <p class="text-lg mb-8">
        Sign up and start storing your files securely.
        Access them from anywhere and share with ease!
      </p>
      <a
        href="#"
        class="bg-white text-purple-600 px-8 py-3 rounded-full shadow hover:bg-gray-100"
      >Get Started</a>
      </div>
    </section>
  </div>
</template>
<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

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
onMounted(() => {
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

onMounted(() => {
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
<style scoped>
</style>
