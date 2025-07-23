document.addEventListener('DOMContentLoaded', () => {
    // Implementación de ShootingStars
    const shootingStarsSvg = document.getElementById('shooting-stars-svg');
    
    // Configuración de la animación de estrellas
    const shootingStarsConfig = {
        minSpeed: 10,
        maxSpeed: 30,
        minDelay: 400,    // Reducido de 1200 para generar estrellas más rápido
        maxDelay: 1500,   // Reducido de 4200 para generar estrellas más rápido
        starColor: "#9E00FF",
        trailColor: "#2EB9DF",
        starWidth: 10,
        starHeight: 1
    };
    
    // Función para obtener un punto de inicio aleatorio
    const getRandomStartPoint = () => {
        const side = Math.floor(Math.random() * 4);
        const offset = Math.random() * window.innerWidth;
        
        switch (side) {
            case 0:
                return { x: offset, y: 0, angle: 45 };
            case 1:
                return { x: window.innerWidth, y: offset, angle: 135 };
            case 2:
                return { x: offset, y: window.innerHeight, angle: 225 };
            case 3:
                return { x: 0, y: offset, angle: 315 };
            default:
                return { x: 0, y: 0, angle: 45 };
        }
    };
    
    // Función para crear una estrella
    const createStar = () => {
        const { x, y, angle } = getRandomStartPoint();
        const id = Date.now();
        const speed = Math.random() * (shootingStarsConfig.maxSpeed - shootingStarsConfig.minSpeed) + shootingStarsConfig.minSpeed;
        
        // Crear el elemento rect para la estrella
        const star = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        star.setAttribute("id", `star-${id}`);
        star.setAttribute("x", x);
        star.setAttribute("y", y);
        star.setAttribute("width", shootingStarsConfig.starWidth);
        star.setAttribute("height", shootingStarsConfig.starHeight);
        star.setAttribute("fill", "url(#star-gradient)");
        star.setAttribute("transform", `rotate(${angle}, ${x + shootingStarsConfig.starWidth / 2}, ${y + shootingStarsConfig.starHeight / 2})`);
        
        shootingStarsSvg.appendChild(star);
        
        // Animar la estrella
        let scale = 1;
        let distance = 0;
        
        const moveStar = () => {
            const newX = parseFloat(star.getAttribute("x")) + speed * Math.cos((angle * Math.PI) / 180);
            const newY = parseFloat(star.getAttribute("y")) + speed * Math.sin((angle * Math.PI) / 180);
            distance += speed;
            scale = 1 + distance / 100;
            
            star.setAttribute("x", newX);
            star.setAttribute("y", newY);
            star.setAttribute("width", shootingStarsConfig.starWidth * scale);
            star.setAttribute("transform", `rotate(${angle}, ${newX + (shootingStarsConfig.starWidth * scale) / 2}, ${newY + shootingStarsConfig.starHeight / 2})`);
            
            // Eliminar la estrella si sale de la pantalla
            if (
                newX < -20 ||
                newX > window.innerWidth + 20 ||
                newY < -20 ||
                newY > window.innerHeight + 20
            ) {
                star.remove();
                return;
            }
            
            requestAnimationFrame(moveStar);
        };
        
        requestAnimationFrame(moveStar);
        
        // Programar la creación de la siguiente estrella
        const randomDelay = Math.random() * (shootingStarsConfig.maxDelay - shootingStarsConfig.minDelay) + shootingStarsConfig.minDelay;
        setTimeout(createStar, randomDelay);
    };
    
    // Iniciar la animación de estrellas
    createStar();
    
    // Implementación de GooeyText
    const introAnimation = document.getElementById('intro-animation');
    const mainContent = document.getElementById('main-content');
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    
    // Configuración de la animación
    const texts = ["Llegado.", "Tu", "Asistente", "De", "Trading ", "Ha"];
    const morphTime = 1;
    const cooldownTime = 0.25;
    
    // Cambio aquí: comenzamos desde el índice 0 en lugar de texts.length - 1
    let textIndex = 0;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let animationComplete = false;
    let animationCycles = 0;
    // Aumentamos el número de ciclos para que se muestren todas las palabras
    const maxCycles = 1;
    // Contador para rastrear cuántas palabras se han mostrado
    let wordsShown = 0;
    
    // Función para aplicar el efecto de morphing
    const setMorph = (fraction) => {
        text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
        
        fraction = 1 - fraction;
        text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    };
    
    // Función para el estado de enfriamiento
    const doCooldown = () => {
        morph = 0;
        text2.style.filter = "";
        text2.style.opacity = "100%";
        text1.style.filter = "";
        text1.style.opacity = "0%";
    };
    
    // Función para el estado de morphing
    const doMorph = () => {
        morph -= cooldown;
        cooldown = 0;
        let fraction = morph / morphTime;
        
        if (fraction > 1) {
            cooldown = cooldownTime;
            fraction = 1;
        }
        
        setMorph(fraction);
    };
    
    // Función de animación
    function animate() {
        if (animationComplete) return;
        
        requestAnimationFrame(animate);
        const newTime = new Date();
        const shouldIncrementIndex = cooldown > 0;
        const dt = (newTime.getTime() - time.getTime()) / 1000;
        time = newTime;
        
        cooldown -= dt;
        
        if (cooldown <= 0) {
            if (shouldIncrementIndex) {
                // Incrementamos el contador de palabras mostradas
                wordsShown++;
                
                textIndex = (textIndex + 1) % texts.length;
                
                // Verificar si hemos mostrado todas las palabras (texts.length palabras)
                if (wordsShown >= texts.length) {
                    animationCycles++;
                    
                    // Si hemos completado el número deseado de ciclos, mostrar el contenido principal
                    if (animationCycles >= maxCycles) {
                        showMainContent();
                        animationComplete = true;
                        return;
                    }
                }
                
                text1.textContent = texts[textIndex % texts.length];
                text2.textContent = texts[(textIndex + 1) % texts.length];
            }
            doMorph();
        } else {
            doCooldown();
        }
    }
    
    // Función para mostrar el contenido principal
    function showMainContent() {
        // Desvanecer la animación
        introAnimation.style.opacity = '0';
        
        // Después de la transición, ocultar la animación y mostrar el contenido principal
        setTimeout(() => {
            introAnimation.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Inicializar la animación de las secciones
            initSectionAnimations();
        }, 500); // Tiempo igual a la duración de la transición en CSS
    }
    
    // Inicializar la animación GooeyText
    text1.textContent = texts[textIndex];
    text2.textContent = texts[(textIndex + 1) % texts.length];
    animate();
    
    // Función para inicializar las animaciones de las secciones (código original)
    function initSectionAnimations() {
        const sections = document.querySelectorAll('section');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = 0;
                    entry.target.style.transform = 'translateY(20px)';
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            section.style.opacity = 0;
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(section);
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Ajustar el tamaño del SVG cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        // No es necesario hacer nada específico, ya que el SVG se ajusta automáticamente
        // gracias a los estilos CSS (width: 100%, height: 100%)
    });
    
    // Implementación del toggle de precios (Mensual/Anual)
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const fase1Price = document.getElementById('fase1-price');
    const fase1Period = document.getElementById('fase1-period');
    const fase1Link = document.getElementById('fase1-link');
    const popularBadge = document.querySelector('.popular-badge'); // Añadir esta línea
    
    // Configuración de precios y enlaces
    const pricingConfig = {
        mensual: {
            price: '17 US$',
            period: 'Por mes/usuario',
            link: 'https://link-mensual.com'
        },
        anual: {
            price: '173 US$',
            period: 'Por año/usuario',
            link: 'https://link-anual.com'
        }
    };
    
    // Función para actualizar los precios y enlaces
    function updatePricing(planType) {
        if (fase1Price && fase1Period && fase1Link) {
            fase1Price.textContent = pricingConfig[planType].price;
            fase1Period.textContent = pricingConfig[planType].period;
            fase1Link.href = pricingConfig[planType].link;
            
            // Controlar la visibilidad del popular-badge
            if (popularBadge) {
                if (planType === 'anual') {
                    popularBadge.style.display = 'none';
                } else {
                    popularBadge.style.display = 'block';
                }
            }
        }
    }
    
    // Añadir event listeners a las opciones de toggle
    toggleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Quitar la clase active de todas las opciones
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            
            // Añadir la clase active a la opción seleccionada
            option.classList.add('active');
            
            // Actualizar los precios según la opción seleccionada
            const planType = option.textContent.trim().toLowerCase();
            if (planType === 'mensual' || planType === 'anual') {
                updatePricing(planType);
            }
        });
    });
});