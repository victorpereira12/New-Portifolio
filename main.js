      gsap.registerPlugin(ScrollTrigger);

      window.addEventListener("mousemove", (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 50;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 50;
        gsap.to("#video-follow", {
          x: xPos,
          y: yPos,
          duration: 1.2,
          ease: "power2.out",
        });
      });

      ScrollTrigger.create({
        trigger: ".section-about",
        start: "top 45%",
        onEnter: () => {
          gsap.to(["nav", ".social-sidebar", ".vertical-name"], {
            color: "white",
            duration: 0.3,
          });
          gsap.to(".social-sidebar svg", { fill: "white", duration: 0.3 });
        },
        onLeaveBack: () => {
          gsap.to(["nav", ".social-sidebar", ".vertical-name"], {
            color: "#1a1a1a",
            duration: 0.3,
          });
          gsap.to(".social-sidebar svg", { fill: "#1a1a1a", duration: 0.3 });
        },
      });

      gsap.to(".section-about", {
        borderRadius: "0px",
        scale: 1,
        scrollTrigger: {
          trigger: ".section-about",
          start: "top 98%",
          end: "top 25%",
          scrub: 1.5,
        },
      });

      // Remove o 'if' antigo e usa o matchMedia do GSAP
      let mm = gsap.matchMedia();

      mm.add("(min-width: 901px)", () => {
        // Esse código roda APENAS no Desktop
        ScrollTrigger.create({
          trigger: ".me-photo",
          start: "top 120px",
          // O 'endTrigger' agora é o container do texto completo
          endTrigger: ".me-content",
          // O 'end' diz: pare quando a base da foto atingir a base do texto
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

      const burger = document.getElementById("burger-menu");
      const overlay = document.getElementById("menu-overlay");
      burger.addEventListener("click", () => {
        overlay.classList.toggle("active");
        if (overlay.classList.contains("active")) {
          gsap.to(".menu-overlay a", {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5,
          });
        }
      });

      gsap.to(".timeline-line-progress", {
        height: "100%",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 20%",
          end: "bottom 70%",
          scrub: 1,
        },
      });

      const items = document.querySelectorAll(".timeline-item");
      items.forEach((item) => {
        const content = item.querySelector(".timeline-content");
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.classList.add("active"),
          onLeaveBack: () => item.classList.remove("active"),
        });
        gsap.from(content, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            toggleActions: "restart none restart none",
          },
        });
      });

      gsap.from(".skill-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onComplete: function () {
          gsap.set(".skill-card", { clearProps: "all" });
        },
      });
      // Lógica de Filtragem de Projetos
      // 1. Efeito de Troca de Cor da Tela (Dark -> Light)
      ScrollTrigger.create({
        trigger: "#projects-section",
        start: "top 20%",
        end: "bottom 20%",
        onEnter: () => {
          document
            .getElementById("projects-section")
            .classList.add("light-theme");
          gsap.to(["nav", ".social-sidebar", ".vertical-name"], {
            color: "#000",
            duration: 0.4,
          });
          gsap.to(".social-sidebar svg", { fill: "#000", duration: 0.4 });
        },
        onLeaveBack: () => {
          document
            .getElementById("projects-section")
            .classList.remove("light-theme");
          gsap.to(["nav", ".social-sidebar", ".vertical-name"], {
            color: "#fff",
            duration: 0.4,
          });
          gsap.to(".social-sidebar svg", { fill: "#fff", duration: 0.4 });
        },
      });

      // 2. Lógica de Filtragem
      const filterBtns = document.querySelectorAll(".filter-btn");
      const projectCards = document.querySelectorAll(".project-card");

      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const filter = btn.getAttribute("data-filter");

          gsap.to(projectCards, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
              projectCards.forEach((card) => {
                if (
                  filter === "all" ||
                  card.getAttribute("data-category") === filter
                ) {
                  card.style.display = "block";
                } else {
                  card.style.display = "none";
                }
              });
              gsap.to(".project-card[style*='display: block']", {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1,
              });
            },
          });
        });
      });
      // --- CONFIGURAÇÃO THREE.JS ---
      // --- CONFIGURAÇÃO THREE.JS (VERSÃO FINAL CONSOLIDADA) ---

      // 1. Definições de Cena, Câmera e Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 4); // Câmera fixa para observar o movimento vertical do carro

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;

      document
        .getElementById("canvas-container")
        .appendChild(renderer.domElement);

      // 2. Iluminação
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
      mainLight.position.set(5, 10, 7.5);
      scene.add(mainLight);

      const accentLight = new THREE.PointLight(0xffffff, 1);
      accentLight.position.set(0, 2, 2);
      scene.add(accentLight);

      // 3. Carregamento do Modelo e Animações
      let civic;
      const loader = new THREE.GLTFLoader();

      loader.load(
        "./assets/victor-3d2.glb",
        (gltf) => {
          civic = gltf.scene;

          // Centralização exata do modelo (ajuste de pivô)
          const box = new THREE.Box3().setFromObject(civic);
          const center = box.getCenter(new THREE.Vector3());
          civic.position.sub(center);
          // --- CONFIGURAÇÃO DE ESCALA ---
          // Se quiser mudar o tamanho no mobile, mude o 12 (Mobile) ou o 5 (Desktop)
          const isMobile = window.innerWidth < 768;
          const initialScale = isMobile ? 2 : 5;

          civic.scale.set(initialScale, initialScale, initialScale);
          // ------------------------------

          // POSIÇÃO INICIAL: O carro começa no topo (atropelando a visão inicial)
          civic.position.y = 2;

          scene.add(civic);
          console.log("3D Carregado com Sucesso!");

          // --- TIMELINE DE SCROLL (PIN + MOVIMENTO VERTICAL + TEXTO) ---
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "#showcase-section",
              start: "top top",
              end: "+=300%", // Duração do scroll para suavidade
              pin: true, // Trava a tela
              scrub: 1, // Sincroniza com a rolagem do mouse
            },
          });

          // Passo 1: O carro desce do topo para o fundo e gira
          tl.to(
            civic.position,
            {
              y: -2, // Termina na parte de baixo
              ease: "none",
            },
            0
          );

          tl.to(
            civic.rotation,
            {
              y: Math.PI * 2, // Uma volta completa
              ease: "none",
            },
            0
          );

          // Passo 2: O carro aumenta de tamanho durante a descida (efeito zoom)
          tl.to(
            civic.scale,
            {
              x: initialScale * 1.4,
              y: initialScale * 1.4,
              z: initialScale * 1.4,
              ease: "none",
            },
            0
          );

          // Passo 3: O texto aparece exatamente quando o carro está passando por ele
          tl.from(
            ".sticky-3d-text",
            {
              opacity: 0,
              scale: 0.6,
              y: 30,
              duration: 0.5,
            },
            0.2
          ); // Inicia aos 20% do progresso do scroll

          tl.to(
            ".sticky-3d-text",
            {
              opacity: 1,
              scale: 1.2,
              duration: 0.5,
            },
            0.5
          ); // Fica totalmente visível no meio do scroll

          // Inicializa a interação de hover nas letras
          initInteractiveLetters();
        },
        (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% carregado"),
        (error) => console.error("Erro ao carregar o arquivo .glb:", error)
      );

      // 4. EFEITO DAS LETRAS NO HOVER (SUBIR AO PASSAR MOUSE)
      function initInteractiveLetters() {
        const title = document.querySelector(".hover-reveal");
        if (!title) return;

        const text = title.textContent;
        title.innerHTML = ""; // Limpa para criar spans

        [...text].forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.style.willChange = "transform";
          title.appendChild(span);

          span.addEventListener("mouseenter", () => {
            gsap.to(span, {
              y: -25,
              scale: 1.3,
              color: "#fff",
              duration: 0.3,
              ease: "back.out(2)",
            });
          });

          span.addEventListener("mouseleave", () => {
            gsap.to(span, {
              y: 0,
              scale: 1,
              color: "#d4ff3f",
              duration: 0.4,
              ease: "elastic.out(1, 0.3)",
            });
          });
        });
      }

      // 5. Loop de Renderização Contínua
      function animate() {
        requestAnimationFrame(animate);
        // Rotação suave constante para dar vida ao modelo
        if (civic) {
          civic.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
      }
      animate();

      // 6. Ajuste de Tela (Resize) Responsivo
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (civic) {
          const resScale = window.innerWidth < 768 ? 12 : 20;
          civic.scale.set(resScale, resScale, resScale);
        }
      });

      //FOoter
      const cursor = document.querySelector(".cursor-revelador");
      const footer = document.querySelector(".footer-container");
      const menu = document.querySelector(".seu-menu-fixo"); // Ajuste o nome da sua classe aqui

      document.addEventListener("mousemove", (e) => {
        // 1. Lógica do Rastro (Trail)
        // Só cria as bolinhas se o mouse estiver dentro do footer
        if (e.target.closest(".footer-container")) {
          createTrailDot(e.clientX, e.clientY);
        }

        // 2. Interatividade do Texto (Skew Effect)
        const marqueeContent = document.querySelector(".marquee-content");
        if (marqueeContent) {
          const skew = (window.innerWidth / 2 - e.pageX) / 40;
          marqueeContent.style.transform = `skewX(${skew}deg)`;
        }
      });

      // Função para criar cada bolinha do rastro
      function createTrailDot(x, y) {
        const dot = document.createElement("div");
        dot.className = "trail-dot"; // Esta classe deve estar no seu CSS
        dot.style.left = x + "px";
        dot.style.top = y + "px";

        document.body.appendChild(dot);

        // Remove a bolinha após 600ms (tempo da animação vanish do CSS)
        setTimeout(() => {
          dot.remove();
        }, 600);
      }
      // 3. Sensor de Seção para o Menu ficar Branco
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Quando entra no footer, força o menu a ficar branco
              menu.style.setProperty("color", "#ffffff", "important");
              menu
                .querySelectorAll("a")
                .forEach((link) => (link.style.color = "#ffffff"));
            } else {
              // Cor original do seu menu (ajuste para preto ou o que preferir)
              menu.style.setProperty("color", "#000000");
              menu
                .querySelectorAll("a")
                .forEach((link) => (link.style.color = "#000000"));
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(footer);
 