/* script.js - Niveditha S Wall Art Portfolio */

document.addEventListener("DOMContentLoaded", () => {

    // --- PRELOADER + HERO ANIMATION TRIGGER ---
    // Adding .hero-animate to the section starts all CSS fadeUp animations
    const preloader = document.getElementById("preloader");
    const heroSection = document.getElementById("hero");

    function startHero() {
        if (heroSection) {
            heroSection.classList.add("hero-animate");
        }
    }

    if (preloader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                preloader.classList.add("fade-out");
                startHero(); // kick off CSS animations as preloader fades
            }, 800);
        });

        // Safety timeout if load event is slow
        setTimeout(() => {
            if (!preloader.classList.contains("fade-out")) {
                preloader.classList.add("fade-out");
                startHero();
            }
        }, 3000);
    } else {
        startHero();
    }

    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById("custom-cursor");
    const follower = document.getElementById("custom-cursor-follower");
    
    if (cursor && follower) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediately position core cursor
            cursor.style.left = mouseX + "px";
            cursor.style.top = mouseY + "px";
        });
        
        // Follower delay physics
        function updateFollower() {
            posX += (mouseX - posX) * 0.12;
            posY += (mouseY - posY) * 0.12;
            
            follower.style.left = posX + "px";
            follower.style.top = posY + "px";
            
            requestAnimationFrame(updateFollower);
        }
        updateFollower();
        
        // Add hover effects on all interactive tags
        const interactiveElements = document.querySelectorAll("a, button, input, select, textarea, .style-card, .filter-btn, .icon-trigger");
        
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursor.classList.add("hovered");
                follower.classList.add("hovered");
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove("hovered");
                follower.classList.remove("hovered");
            });
        });
    }

    // --- MAIN HEADER SCROLL & NAVIGATION SPY ---
    const header = document.getElementById("main-header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    const heroContentWrap = document.querySelector(".hero-content-wrap");

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;
        const viewH = window.innerHeight;

        // Toggle Scrolled Header CSS
        if (scrollPos > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Parallax: background position on the section drifts slower than scroll
        if (heroSection && scrollPos < viewH * 1.4) {
            heroSection.style.backgroundPosition = `center calc(0px + ${scrollPos * 0.35}px)`;
        }

        // Fade & lift hero content as user scrolls into page
        if (heroContentWrap && scrollPos < viewH) {
            const progress = scrollPos / viewH;
            heroContentWrap.style.opacity = Math.max(0, 1 - progress * 1.5).toString();
            heroContentWrap.style.transform = `translateY(${scrollPos * 0.09}px)`;
        }

        // Scroll spy active links toggling
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            const secId = sec.getAttribute("id");

            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${secId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, { passive: true });

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        
        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // --- SCROLL REVEAL INTERSECTING OBSERVER ---
    const reveals = document.querySelectorAll(".scroll-reveal, .animate-slide-in-left, .animate-slide-in-right");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                
                // If it is the about section, trigger the stats counter animation
                if (entry.target.id === "about") {
                    startCounters();
                }
                
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    reveals.forEach(rev => {
        revealObserver.observe(rev);
    });

    // Trigger hero stats animation manually on startup
    function startCounters() {
        const counters = document.querySelectorAll(".stat-num");
        counters.forEach(counter => {
            // Guard to prevent double counter runs
            if (counter.classList.contains("counted")) return;
            counter.classList.add("counted");

            const target = +counter.getAttribute("data-val");
            let count = 0;
            const speed = Math.max(1, Math.ceil(target / 50)); // speed control
            
            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = Math.floor(count);
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // --- PORTFOLIO FILTER SYSTEM ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Toggle active filter button
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filterValue = btn.getAttribute("data-filter");
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    item.classList.add("show");
                } else {
                    item.classList.remove("show");
                }
            });
        });
    });

    // --- INTERACTIVE ESTIMATOR & CONFIGURATOR ---
    const widthInput = document.getElementById("wall-width");
    const heightInput = document.getElementById("wall-height");
    const styleCards = document.querySelectorAll(".style-card");
    const visualizerArtwork = document.getElementById("canvas-artwork");
    const visualizerCanvas = document.getElementById("visualizer-canvas");
    const dimensionsTag = document.getElementById("canvas-dimensions-tag");
    
    const summaryArea = document.getElementById("summary-area");
    const summaryPrice = document.getElementById("summary-price");
    
    let selectedRate = 80; // default minimal rate
    
    // Style card click event toggling
    styleCards.forEach(card => {
        card.addEventListener("click", () => {
            styleCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            
            selectedRate = +card.getAttribute("data-rate");
            const style = card.getAttribute("data-style");
            
            // Adjust visualizer artwork mapping to represent selected styles
            if (style === "minimal") {
                visualizerArtwork.style.backgroundImage = "url('Assets/Wall art.png')";
                visualizerArtwork.style.filter = "grayscale(1) contrast(1.2)";
            } else if (style === "detailed") {
                visualizerArtwork.style.backgroundImage = "url('Assets/art in the wash basin.png')";
                visualizerArtwork.style.filter = "none";
            } else if (style === "fantasy") {
                visualizerArtwork.style.backgroundImage = "url('Assets/Harry potter wall art.png')";
                visualizerArtwork.style.filter = "brightness(0.9) saturate(1.1)";
            }
            
            calculateEstimate();
        });
    });
    
    function calculateEstimate() {
        const width = +widthInput.value || 10;
        const height = +heightInput.value || 8;
        
        const area = width * height;
        const price = area * selectedRate;
        
        // Format outputs
        summaryArea.innerText = `${area} Sq. Ft`;
        summaryPrice.innerText = `₹${price.toLocaleString()}`;
        dimensionsTag.innerText = `${width}' x ${height}' (${area} sq.ft)`;
        
        // Dynamically adjust scale ratio of visualizer canvas
        // Reference: Human is static on the left. The mural canvas width/height stretches based on width/height ratio.
        const widthRatio = (width / 30) * 100; // max 30ft width as scale reference
        const heightRatio = (height / 15) * 80 + 10; // max 15ft height as scale reference
        
        visualizerArtwork.style.width = `${Math.min(Math.max(widthRatio, 35), 75)}%`;
        visualizerArtwork.style.height = `${Math.min(Math.max(heightRatio, 40), 95)}%`;
    }
    
    if (widthInput && heightInput) {
        widthInput.addEventListener("input", calculateEstimate);
        heightInput.addEventListener("input", calculateEstimate);
        calculateEstimate(); // initial boot calculation
    }

    // Connect estimator click to Contact Description Form fill
    const applyEstimateBtn = document.getElementById("apply-estimate-btn");
    const contactFormDetails = document.getElementById("mural-details");
    
    if (applyEstimateBtn && contactFormDetails) {
        applyEstimateBtn.addEventListener("click", () => {
            const width = widthInput.value;
            const height = heightInput.value;
            const styleName = document.querySelector(".style-card.active h4").innerText;
            const area = width * height;
            const price = summaryPrice.innerText;
            
            contactFormDetails.value = `Hi Niveditha S, I calculated an estimate using your Wall Configurator! \n- Wall Dimensions: ${width}ft x ${height}ft (${area} sq.ft)\n- Art Style: ${styleName}\n- Estimated Quote: ${price}\n\nLet's discuss my custom concept sketches!`;
            
            // Scroll to contact form smoothly
            document.getElementById("contact").scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- GALLERY LIGHTBOX MODAL ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");
    const lightboxPrev = document.querySelector(".lightbox-prev");
    const lightboxNext = document.querySelector(".lightbox-next");
    const lightboxCat = document.querySelector(".lightbox-cat");
    const lightboxTitle = document.querySelector(".lightbox-title");
    const lightboxDesc = document.querySelector(".lightbox-desc");
    
    // Curate images metadata list corresponding to HTML index
    const galleryItems = [
        {
            id: "img1",
            src: "Assets/Harry potter wall art.png",
            cat: "Residential Mural",
            title: "Harry Potter Wizards Sanctuary",
            desc: "A gorgeous custom mural bringing magical dimensions, dynamic shadows, and high-fidelity wizarding details straight onto a bedroom wall."
        },
        {
            id: "img2",
            src: "Assets/art in the wash basin.png",
            cat: "Washbasin & Accent",
            title: "Botanical Basin Accent",
            desc: "Transforming standard utility spaces. Flowing, elegant hand-painted leaves and vines that frame the washbasin with natural grace."
        },
        {
            id: "img3",
            src: "Assets/Wall art.png",
            cat: "Residential Mural",
            title: "Whispering Meadow",
            desc: "Subtle, minimal yet expansive floral linework that opens up a living space, perfectly balancing light and structure."
        },
        {
            id: "img4",
            src: "Assets/WhatsApp Image 2026-05-19 at 6.50.57 PM.jpeg",
            cat: "Commercial Mural",
            title: "Bespoke Lobby Masterpiece",
            desc: "Intricate, large-scale custom illustration that creates a statement wall, boosting aesthetic identity and social-media-friendly spots."
        },
        {
            id: "img5",
            src: "Assets/WhatsApp Image 2026-05-19 at 7.28.37 PM.jpeg",
            cat: "Washbasin & Accent",
            title: "Cozy Study Vignette",
            desc: "Personalized characters and warm concepts that add playful wonder to a reading nook or a kid's bedroom."
        }
    ];
    
    let currentIdx = 0;
    const triggers = document.querySelectorAll(".lightbox-trigger");
    
    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const targetId = trigger.getAttribute("data-target");
            currentIdx = galleryItems.findIndex(item => item.id === targetId);
            
            if (currentIdx !== -1) {
                openLightbox(galleryItems[currentIdx]);
            }
        });
    });
    
    function openLightbox(item) {
        lightboxImg.src = item.src;
        lightboxCat.innerText = item.cat;
        lightboxTitle.innerText = item.title;
        lightboxDesc.innerText = item.desc;
        
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // disable scroll
    }
    
    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
    }
    
    function navigateLightbox(direction) {
        if (direction === "next") {
            currentIdx = (currentIdx + 1) % galleryItems.length;
        } else {
            currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
        }
        
        // Add a smooth quick transition blink
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            const item = galleryItems[currentIdx];
            lightboxImg.src = item.src;
            lightboxCat.innerText = item.cat;
            lightboxTitle.innerText = item.title;
            lightboxDesc.innerText = item.desc;
            lightboxImg.style.opacity = 1;
        }, 150);
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
        lightboxPrev.addEventListener("click", () => navigateLightbox("prev"));
        lightboxNext.addEventListener("click", () => navigateLightbox("next"));
        
        // Close modal clicking outside
        lightbox.querySelector(".lightbox-overlay").addEventListener("click", closeLightbox);
        
        // Keyboard arrow hooks
        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") navigateLightbox("next");
            if (e.key === "ArrowLeft") navigateLightbox("prev");
        });
    }

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            faqItems.forEach(i => {
                i.classList.remove("open");
                i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });
            if (!isOpen) {
                item.classList.add("open");
                btn.setAttribute("aria-expanded", "true");
            }
        });
    });

    // --- BESPOKE CONSULTATION FORM SUBMISSION (EMAILJS INTEGRATION) ---
    // EmailJS API Credentials Configuration.
    // Replace these placeholders with your actual EmailJS credentials at https://dashboard.emailjs.com/
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";   // e.g. "user_xxxxxxxxxxxxxxxx" or "xxxxxxxxxxxxxxxx"
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";   // e.g. "service_xxxxxxx"
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g. "template_xxxxxxx"

    // Initialize EmailJS browser SDK if it has loaded
    if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
    }

    const contactForm = document.getElementById("contact-form");
    const formFeedback = document.getElementById("form-feedback");
    
    if (contactForm && formFeedback) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;
            
            // Reset feedback style state
            formFeedback.style.display = ""; 
            formFeedback.className = "form-feedback";
            formFeedback.innerText = "";
            
            // Loading feedback
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Scheduling consultation...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            const isEmailJSConfigured = 
                EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" && 
                EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" && 
                EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID";

            if (isEmailJSConfigured && typeof emailjs !== "undefined") {
                // Collect parameters mapped to standard EmailJS placeholders
                const templateParams = {
                    from_name: document.getElementById("client-name").value,
                    from_email: document.getElementById("client-email").value,
                    from_phone: document.getElementById("client-phone").value,
                    mural_type: document.getElementById("mural-type").value,
                    message: document.getElementById("mural-details").value,
                    to_email: "nivisun4@gmail.com"
                };

                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                    .then(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        
                        // Show Success Msg
                        formFeedback.className = "form-feedback success";
                        formFeedback.innerText = "Thank you! Your consultation request has been sent. Niveditha S will review your space sketches and contact you within 24 hours.";
                        
                        // Clear Form
                        contactForm.reset();
                        
                        // Fade feedback after 6 seconds
                        setTimeout(() => {
                            formFeedback.style.display = "none";
                        }, 6000);
                    })
                    .catch((error) => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        
                        // Show Error Msg
                        formFeedback.className = "form-feedback error";
                        formFeedback.innerText = "Oops! Something went wrong while sending your request. Please try again or email directly to nivisun4@gmail.com.";
                        console.error("EmailJS Error details:", error);
                    });
            } else {
                // Fallback to beautiful Mock/Demo Mode if EmailJS credentials are not configured yet
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Show Demo Success Msg
                    formFeedback.className = "form-feedback success";
                    formFeedback.innerText = "Thank you! Niveditha S will review your space sketches and contact you within 24 hours. (Demo Mode: Please configure EmailJS credentials in script.js)";
                    
                    // Clear Form
                    contactForm.reset();
                    
                    // Fade feedback after 6 seconds
                    setTimeout(() => {
                        formFeedback.style.display = "none";
                    }, 6000);
                }, 1800);
            }
        });
    }
});
