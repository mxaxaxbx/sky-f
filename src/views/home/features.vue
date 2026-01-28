<template>
  <section class="bg-[var(--bg)] font-alexandria font-sans py-2  pt-40 pb-8">
    <div class="w-full flex items-center justify-center">
    </div>
      <!-- Animación SVG bienvenida -->
    <div class="reltive w-full h-full flex items-left justify-left pt-12">
      <div class="relative overflow-hidden w-full bg-slide">

        <object
          id="Welcome"
          aria-label="Welcome SVG"
          type="image/svg+xml"
          data="Welcome.svg"
          class="w-auto lg:h-52 h-16 animate-slide-in-left">
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
            text-2xl text-left mb-4 font-semibold

            md:text-3xl lg:text-5xl">
            We built a private cloud<br>
            that puts you in control,<br>
            with a fast, intuitive,<br>
            and hassle-free
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
        <a
          href="/app"
          ref="lockContainer"
          class="
            group
            animated-card
            flex flex-col items-center
            bg-[var(--bg-secondary)]
            border border-[var(--border)]
            h-96 w-80 sm:w-72 pt-6
            rounded-lg
            cursor-pointer
            overflow-hidden

            hover:border-[var(--color-primary)]
            hover:bg-[var(--hover-bg)]
            hover:shadow-[0_0_10px_5px_rgba(10,119,243,0.2)]
            transition-all duration-300
          ">
          <div class="flex flex-col gap-6 w-full px-6">
            <h3 class="
              text-[var(--text)] text-xl font-semibold
              ">Secure Storage
            </h3>
            <p class="text-[var(--text-terceary)] text-sm font-light leading-tight">
              Store your files securely with<br />end-to-end encryption.
            </p>
          </div>
          <!-- seguridad animacion-->
          <div
            class="relative flex items-center justify-center
              mt-6 w-64 h-64 opacity-50 group-hover:opacity-100
              transition-all duration-300
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
        </a>

          <!-- Organize Files -->
          <a
            href="/app"
            ref="cloudRef"
            @mouseenter="isHover = true"
            @mouseleave="isHover = false"
            @focus="isHover = true"
            @blur="isHover = false"
            class="
              group
              animated-card
              flex flex-col
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              h-96 w-80 sm:w-72 pt-6
              rounded-lg
              cursor-pointer
              overflow-hidden

              hover:border-[var(--color-primary)]
              hover:bg-[var(--hover-bg)]
              hover:shadow-[0_0_10px_5px_rgba(10,119,243,0.2)]
              transition-all duration-300
            ">
            <div class="flex flex-col gap-6 mx-6">
              <h3 class="
                text-[var(--text)] text-xl font-semibold
                "> Organize Files
              </h3>
              <p class="text-[var(--text-terceary)] text-sm font-light leading-tight">
                Keep your files organized with<br />folders and tags for easy access.
              </p>
            </div>
            <div
              class="
                icon-cloud
                relative flex mt-8
                transition-all duration-300
                ">
              <div
                v-for="(icon, index) in icons"
                :key="index"
                ref="iconRefs"
                class="icon-item absolute flex flex-col gap-2"
                :data-type="icon.type"
                >
                <!-- Audio -->
                <svg v-if="icon.type === 'audio'" width="45" height="45" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="bg-path" d="M0 16C0 7.16344 7.16344 0 16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50H16C7.16344 50 0 42.8366 0 34V16Z" fill="var(--bg)"/>
                  <path id="line-path" d="M34 49V50H16V49H34ZM49 34V16C49 7.84502 42.4923 1.21 34.3867 1.00488L34 1H16C7.84502 1 1.21 7.50774 1.00488 15.6133L1 16V34C1 42.2843 7.71573 49 16 49V50L15.5869 49.9951C6.94127 49.776 0 42.6984 0 34V16C0 7.30155 6.94127 0.22398 15.5869 0.00488281L16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50V49C42.2843 49 49 42.2843 49 34Z" fill="var(--border)"/>
                  <path id="line-path" d="M30.7773 12C34.7661 12 38 15.2339 38 19.2227V30.7773C38 34.7661 34.7661 38 30.7773 38H19.2227C15.2339 38 12 34.7661 12 30.7773V19.2227C12 15.2339 15.2339 12 19.2227 12H30.7773ZM21.5605 19.3828V26.2441C21.3199 26.0971 21.0693 25.9866 20.8086 25.9131C20.5478 25.8395 20.2636 25.8027 19.9561 25.8027C19.0735 25.8027 18.318 26.1168 17.6895 26.7451C17.0609 27.3737 16.7461 28.13 16.7461 29.0127C16.7461 29.8953 17.0609 30.6507 17.6895 31.2793C18.318 31.9078 19.0734 32.2227 19.9561 32.2227C20.8387 32.2226 21.5941 31.9078 22.2227 31.2793C22.8512 30.6507 23.166 29.8953 23.166 29.0127V22.5928L29.5859 21.3291V24.6387C29.3452 24.4916 29.0938 24.3812 28.833 24.3076C28.5723 24.2341 28.2879 24.1973 27.9805 24.1973C27.0979 24.1973 26.3424 24.5121 25.7139 25.1406C25.0853 25.7692 24.7706 26.5246 24.7705 27.4072C24.7705 28.2899 25.0853 29.0462 25.7139 29.6748C26.3424 30.3032 27.098 30.6171 27.9805 30.6172C28.8632 30.6172 29.6194 30.3034 30.248 29.6748C30.8766 29.0462 31.1904 28.2899 31.1904 27.4072V17.7783L21.5605 19.3828Z" fill="var(--border)"/>
                </svg>
                <!-- Documents -->
                <svg v-else-if="icon.type === 'doc'" width="45" height="45" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="bg-path" d="M0 16C0 7.16344 7.16344 0 16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50H16C7.16344 50 0 42.8366 0 34V16Z" fill="var(--bg)"/>
                  <path id="line-path" d="M34 49V50H16V49H34ZM49 34V16C49 7.84502 42.4923 1.21 34.3867 1.00488L34 1H16C7.84502 1 1.21 7.50774 1.00488 15.6133L1 16V34C1 42.2843 7.71573 49 16 49V50L15.5869 49.9951C6.94127 49.776 0 42.6984 0 34V16C0 7.30155 6.94127 0.22398 15.5869 0.00488281L16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50V49C42.2843 49 49 42.2843 49 34Z" fill="var(--border)"/>
                  <path id="line-path" d="M27.8906 12C29.97 12.0002 31.9234 12.9961 33.1465 14.6777L35.1572 17.4414C35.9648 18.5522 36.4004 19.8903 36.4004 21.2637V31.5C36.4004 35.0897 33.4901 37.9998 29.9004 38H19.5C15.9102 38 13 35.0898 13 31.5V18.5C13 14.9101 15.9101 12 19.5 12H27.8906ZM19.5 14.5996C17.3461 14.5996 15.5996 16.3461 15.5996 18.5V31.5C15.5996 33.6539 17.3461 35.4004 19.5 35.4004H29.9004C32.0541 35.4002 33.7998 33.6538 33.7998 31.5V23.7002H29.9004C27.7465 23.7002 26 21.9537 26 19.7998V14.5996H19.5ZM28.5996 19.7998C28.5996 20.5178 29.1824 21.0996 29.9004 21.0996H33.7939C33.7616 20.3334 33.5062 19.5919 33.0537 18.9697L31.0439 16.2061C30.4513 15.3913 29.5728 14.8452 28.5996 14.665V19.7998Z" fill="var(--border)"/>
                </svg>

                <!-- Images -->
                <svg v-else-if="icon.type === 'image'" width="45" height="45" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="bg-path" d="M0 16C0 7.16344 7.16344 0 16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50H16C7.16344 50 0 42.8366 0 34V16Z" fill="var(--bg)"/>
                  <path id="line-path" d="M34 49V50H16V49H34ZM49 34V16C49 7.84502 42.4923 1.21 34.3867 1.00488L34 1H16C7.84502 1 1.21 7.50774 1.00488 15.6133L1 16V34C1 42.2843 7.71573 49 16 49V50L15.5869 49.9951C6.94127 49.776 0 42.6984 0 34V16C0 7.30155 6.94127 0.22398 15.5869 0.00488281L16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50V49C42.2843 49 49 42.2843 49 34Z" fill="var(--border)"/>
                  <path id="line-path" d="M30.7773 12C34.7661 12 38 15.2339 38 19.2227V30.7773C38 34.7661 34.7661 38 30.7773 38H19.2227C15.2339 38 12 34.7661 12 30.7773V19.2227C12 15.2339 15.2339 12 19.2227 12H30.7773ZM28.4775 22.9336C28.1895 22.5307 27.5899 22.5308 27.3018 22.9336L22.8555 29.1572L20.5371 25.8447C20.2497 25.4343 19.6412 25.4345 19.3535 25.8447L15.6855 31.085C15.3505 31.5636 15.693 32.2227 16.2773 32.2227H33.709C34.2955 32.2218 34.6363 31.5577 34.2959 31.0801L28.4775 22.9336ZM19 17C17.8954 17 17 17.8954 17 19C17 20.1046 17.8954 21 19 21C20.1046 21 21 20.1046 21 19C21 17.8954 20.1046 17 19 17Z" fill="var(--border)"/>
                </svg>

                <!-- Videos -->
                <svg v-else-if="icon.type === 'video'" width="45" height="45" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="bg-path" d="M0 16C0 7.16344 7.16344 0 16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50H16C7.16344 50 0 42.8366 0 34V16Z" fill="var(--bg)"/>
                  <path id="line-path" d="M34 49V50H16V49H34ZM49 34V16C49 7.84502 42.4923 1.21 34.3867 1.00488L34 1H16C7.84502 1 1.21 7.50774 1.00488 15.6133L1 16V34C1 42.2843 7.71573 49 16 49V50L15.5869 49.9951C6.94127 49.776 0 42.6984 0 34V16C0 7.30155 6.94127 0.22398 15.5869 0.00488281L16 0H34C42.8366 0 50 7.16344 50 16V34C50 42.8366 42.8366 50 34 50V49C42.2843 49 49 42.2843 49 34Z" fill="var(--border)"/>
                  <path id="line-path" d="M30.7773 12C31.2723 12 31.7557 12.0497 32.2227 12.1445V14.8887H35.1113V13.4443C36.8654 14.7621 38 16.86 38 19.2227V30.7773C38 33.1398 36.8651 35.2369 35.1113 36.5547V35.1113H32.2227V37.8545C31.7556 37.9494 31.2724 38 30.7773 38H19.2227C18.7276 38 18.2444 37.9494 17.7773 37.8545V35.1113H14.8887V36.5547C13.1349 35.2369 12 33.1398 12 30.7773V19.2227C12 16.86 13.1346 14.7621 14.8887 13.4443V14.8887H17.7773V12.1445C18.2443 12.0497 18.7277 12 19.2227 12H30.7773ZM14.8887 32.2227H17.7773V29.333H14.8887V32.2227ZM32.2227 32.2227H35.1113V29.333H32.2227V32.2227ZM14.8887 26.4443H17.7773V23.5557H14.8887V26.4443ZM32.2227 26.4443H35.1113V23.5557H32.2227V26.4443ZM14.8887 20.667H17.7773V17.7773H14.8887V20.667ZM32.2227 20.667H35.1113V17.7773H32.2227V20.667Z" fill="var(--border)"/>
                </svg>
              </div>
            </div>
          </a>

        <!-- Unlimited Access -->
        <a
          href="/app"
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
            rounded-lg w-80 sm:w-auto
            cursor-pointer

            hover:border-[var(--color-primary)]
            hover:bg-[var(--hover-bg)]
            hover:shadow-[0_0_10px_5px_rgba(10,119,243,0.2)]
            transition-all duration-300
          ">
          <div class="flex flex-col gap-6 mx-6 w-full">
            <h3 class="
              text-[var(--text)] text-xl font-semibold
              ">Unlimited Access
            </h3>
            <p class="text-[var(--text-terceary)] w-48 text-sm font-light">
              Collaborate instantly with your friends and colleagues.
            </p>
            <div class="mt-auto mb-4 jutify-self-end">
              <span
                class="
                  inline-flex items-center gap-1
                  text-[var(--text-terceary)] text-sm font-regular
                  transition-colors duration-300
                  group-hover:text-[var(--text)]
                  cursor-pointer
                ">Try it now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="
                    w-4 h-4 ml-2
                    text-[var(--text-terceary)]
                    transition-all duration-150
                    group-hover:text-[var(--text)]
                    arrow-move
                  ">
                  <g mask="url(#mask0_1358_7)">
                    <path
                      fill-rule="evenodd"
                      d="M5.65005 10.0251L7.60005 10.8501C7.83338 10.3834 8.07505 9.93344 8.32505 9.50011C8.57505 9.06677 8.85005 8.63344 9.15005 8.20011L7.75005 7.92511L5.65005 10.0251ZM9.20005 12.1001L12.05 14.9251C12.75 14.6584 13.5 14.2501 14.3 13.7001C15.1 13.1501 15.85 12.5251 16.55 11.8251C17.7167 10.6584 18.6292 9.36261 19.2875 7.93761C19.9459 6.51261 20.2334 5.20011 20.15 4.00011C18.95 3.91677 17.6334 4.20427 16.2 4.86261C14.7667 5.52094 13.4667 6.43344 12.3 7.60011C11.6 8.30011 10.975 9.05011 10.425 9.85011C9.87505 10.6501 9.46672 11.4001 9.20005 12.1001ZM13.65 10.4751C13.2667 10.0918 13.075 9.62094 13.075 9.06261C13.075 8.50427 13.2667 8.03344 13.65 7.65011C14.0334 7.26677 14.5084 7.07511 15.075 7.07511C15.6417 7.07511 16.1167 7.26677 16.5 7.65011C16.8834 8.03344 17.075 8.50427 17.075 9.06261C17.075 9.62094 16.8834 10.0918 16.5 10.4751C16.1167 10.8584 15.6417 11.0501 15.075 11.0501C14.5084 11.0501 14.0334 10.8584 13.65 10.4751ZM14.125 18.5001L16.225 16.4001L15.95 15.0001C15.5167 15.3001 15.0834 15.5709 14.65 15.8126C14.2167 16.0543 13.7667 16.2918 13.3 16.5251L14.125 18.5001ZM21.95 2.17511C22.2667 4.19177 22.0709 6.15427 21.3625 8.06261C20.6542 9.97094 19.4334 11.7918 17.7 13.5251L18.2 16.0001C18.2667 16.3334 18.25 16.6584 18.15 16.9751C18.05 17.2918 17.8834 17.5668 17.65 17.8001L13.45 22.0001L11.35 17.0751L7.07505 12.8001L2.15005 10.7001L6.32505 6.50011C6.55838 6.26677 6.83755 6.10011 7.16255 6.00011C7.48755 5.90011 7.81672 5.88344 8.15005 5.95011L10.625 6.45011C12.3584 4.71677 14.175 3.49177 16.075 2.77511C17.975 2.05844 19.9334 1.85844 21.95 2.17511ZM3.92505 15.9751C4.50838 15.3918 5.22088 15.0959 6.06255 15.0876C6.90422 15.0793 7.61672 15.3668 8.20005 15.9501C8.78338 16.5334 9.07088 17.2459 9.06255 18.0876C9.05422 18.9293 8.75838 19.6418 8.17505 20.2251C7.75838 20.6418 7.06255 21.0001 6.08755 21.3001C5.11255 21.6001 3.76672 21.8668 2.05005 22.1001C2.28338 20.3834 2.55005 19.0376 2.85005 18.0626C3.15005 17.0876 3.50838 16.3918 3.92505 15.9751ZM5.35005 17.3751C5.18338 17.5418 5.01672 17.8459 4.85005 18.2876C4.68338 18.7293 4.56672 19.1751 4.50005 19.6251C4.95005 19.5584 5.39588 19.4459 5.83755 19.2876C6.27922 19.1293 6.58338 18.9668 6.75005 18.8001C6.95005 18.6001 7.05838 18.3584 7.07505 18.0751C7.09172 17.7918 7.00005 17.5501 6.80005 17.3501C6.60005 17.1501 6.35838 17.0543 6.07505 17.0626C5.79172 17.0709 5.55005 17.1751 5.35005 17.3751Z" clip-rule="evenodd"/>
                  </g>
                </svg>
              </span>
            </div>
          </div>
          <!-- solar system -->
          <div class="relative flex w-56">
          <div
            class="w-48  h-96 top-4 -left-4 sm:w-96 sm:-left-12
              absolute flex items-center justify-center
              opacity-50 group-hover:opacity-100 transition-opacity duration-300
            ">
            <svg
              :width="size"
              :height="size"
              viewBox="0 0 800 800"
              class="overflow-visible rotate-20"
              >
              <!-- Órbitas planetas -->
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
        </a>
    </div>
  </section>
</template>
<script setup>
import {
  reactive,
  onMounted,
  ref,
  nextTick,
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

// seguriry animation
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

// Solar system
const size = 1150;
const speedMultiplier = ref(1);
const HOVER_MULTIPLIER = 2;

// organize files
const cloudRef = ref(null);
const iconRefs = ref([]);
const isHover = ref(false);
const icons = ref([]);
let rafId = null;

// Welcome animation
onMounted(() => {
  const svgObject = document.getElementById('Welcome');
  if (!svgObject) return;

  let started = false;

  const startAnimation = () => {
    if (started) return;
    started = true;

    const doc = svgObject.contentDocument;
    if (!doc) return;

    const svg = doc.querySelector('svg');
    if (!svg) return;

    // Primera animación rápida
    gsap.fromTo(
      svg,
      { x: '0%' },
      {
        x: '-10%',
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          // Animación infinita lenta
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

  const initSvg = () => {
    if (svgObject.contentDocument?.readyState === 'complete') {
      startAnimation();
    } else {
      svgObject.addEventListener('load', startAnimation, { once: true });
    }
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initSvg();
          obs.unobserve(svgObject);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    },
  );

  observer.observe(svgObject);

  // 🔥 Fallback: por si ya está visible al cargar
  setTimeout(() => {
    const rect = svgObject.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      initSvg();
      observer.unobserve(svgObject);
    }
  }, 100);
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

/* Slide-in-up para tarjetas (hay que arreglarlo) */
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

// animation segurity (hay que mejorarla)
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

// watch theme for heading
watch(isLight, () => {
  const heading = document.getElementById('animated-heading');
  if (!heading) return;

  const spans = heading.querySelectorAll('span');

  const { from } = getHeadingColors();
  gsap.set(spans, { color: from });
});

// animación solar system
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
    color: computed(() => (isLight.value ? '#0077FF' : '#E9F3FF')),
  },
  {
    rx: 120,
    ry: 48,
    angle: 8,
    speed: 0.009,
    size: 4,
    opacity: 0.7,
    color: computed(() => (isLight.value ? '#3A93FF' : '#004CA8')),
  },
  {
    rx: 180,
    ry: 65,
    angle: 2,
    speed: 0.004,
    size: 5,
    opacity: 0.6,
    color: computed(() => (isLight.value ? '#005ECE' : '#84BCFF')),
  },
  {
    rx: 250,
    ry: 80,
    angle: 2.5,
    speed: 0.002,
    size: 8,
    opacity: 0.5,
    color: computed(() => (isLight.value ? '#9FCBFF' : '#3792FF')),
  },
  {
    rx: 310,
    ry: 95,
    angle: 1.5,
    speed: 0.001,
    size: 2,
    opacity: 0.4,
    color: computed(() => (isLight.value ? '#0074FF' : '#E9F3FF')),
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
// end solar system

// animation Organize file
const baseIcons = [
  { type: 'audio' },
  { type: 'video' },
  { type: 'doc' },
  { type: 'image' },
];

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
function organizePositions() {
  const cloud = cloudRef.value;
  if (!cloud) return;

  const gapX = 52;
  const gapY = 52;
  const startX = -10;
  const startY = 25;

  const order = ['audio', 'video', 'doc', 'image'];

  const groups = {
    audio: [],
    video: [],
    doc: [],
    image: [],
  };

  icons.value.forEach((icon, i) => {
    groups[icon.type].push(i);
  });

  order.forEach((type, row) => {
    groups[type].forEach((iconIndex, col) => {
      const el = iconRefs.value[iconIndex];
      if (!el) return;

      const xPos = startX + col * gapX;
      const yPos = startY + row * gapY;

      el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
  });
}

const speeds = ref([-0.12, -0.06, -0.12, -0.06]);
const hoverMultiplier = ref(1);

function animateFlow() {
  const cloud = cloudRef.value;
  if (!cloud) return;

  const rowsRightEdge = [-Infinity, -Infinity, -Infinity, -Infinity];
  const gapX = 10;

  iconRefs.value.forEach((node, i) => {
    const el = node;
    if (!el) return;

    const type = icons.value[i]?.type;

    const rowMap = {
      audio: 0,
      video: 1,
      doc: 2,
      image: 3,
    };

    const row = rowMap[type] ?? 0;

    const transform = el.style.transform || 'translate(0px, 0px)';
    const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    if (!match) return;

    const x = parseFloat(match[1]);
    const { width } = el.getBoundingClientRect();
    const rightEdge = x + width;

    if (rightEdge > rowsRightEdge[row]) {
      rowsRightEdge[row] = rightEdge;
    }
  });

  iconRefs.value.forEach((node, i) => {
    const el = node;
    if (!el) return;

    const type = icons.value[i]?.type;

    const rowMap = {
      audio: 0,
      video: 1,
      doc: 2,
      image: 3,
    };

    const row = rowMap[type] ?? 0;
    const speed = speeds.value[row] * hoverMultiplier.value;

    const transform = el.style.transform || 'translate(0px, 0px)';
    const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    if (!match) return;

    let x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    const { width } = el.getBoundingClientRect();

    x += speed;

    if (x + width < 0) {
      x = rowsRightEdge[row] + gapX;
    }

    el.style.transform = `translate(${x}px, ${y}px)`;
  });

  rafId = requestAnimationFrame(animateFlow);
}

onMounted(async () => {
  const repeated = Array.from({ length: 8 }, () => baseIcons).flat();
  icons.value = shuffle(repeated);

  await nextTick();
  organizePositions();
});

watch(isHover, async (val) => {
  await nextTick();

  if (val) {
    hoverMultiplier.value = 2.5;

    if (!rafId) {
      rafId = requestAnimationFrame(animateFlow);
    }
  } else {
    hoverMultiplier.value = 1;

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
  .group:hover .arrow-move {
    animation: arrowMove 1s ease-in-out;
  }

  @keyframes arrowMove {
    1% {
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
.group:hover #bg-path {
  fill: var(--bg-path);
}
.group:hover #line-path {
  fill: var(--color-primary);
}

</style>
