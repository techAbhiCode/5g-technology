document.addEventListener('DOMContentLoaded', function() {

    // Page Loader
    const loaderWrapper = document.getElementById('loader-wrapper');
    window.addEventListener('load', () => {
        if (loaderWrapper) {
            loaderWrapper.classList.add('loaded');
        }
        // Page fade-in effect after loader
        document.body.style.opacity = '0'; // Ensure it's initially hidden if not set by CSS
        setTimeout(() => { document.body.style.transition = 'opacity 0.5s ease-in-out'; document.body.style.opacity = '1'; }, 50); // Slight delay for css to apply
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active'); // For hamburger animation
        });
    }

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });


    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a.smooth-scroll-link, .nav-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if it's an on-page anchor
            if (href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    // If on a different page, navigate first then scroll
                    if (window.location.pathname.includes(this.pathname) || this.pathname === '') { // Check if link is for current page
                         targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    } else {
                        // This handles cases where the anchor is on another page.
                        // The browser will navigate, and then we might need a script on the target page
                        // to scroll if the hash is present on load.
                        // For simplicity here, we assume the link is on the same page or handled by browser default for cross-page.
                        // For truly smooth cross-page anchors, more complex logic is needed.
                        window.location.href = this.href;
                    }
                }
            }
        });
    });

    // Handle scrolling to hash on page load (for cross-page anchor links)
    if (window.location.hash) {
        const hashTarget = document.getElementById(window.location.hash.substring(1));
        if (hashTarget) {
            setTimeout(() => { // Timeout to allow page rendering
                hashTarget.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }


    // Tabbed Content
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.tabTarget;
            const targetContent = document.getElementById(targetId);

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    // Activate the first tab by default if exists
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }


    // Accordion Menus
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            const isActive = accordionItem.classList.contains('active');

            // Optional: Close other open accordions
            // document.querySelectorAll('.accordion-item.active').forEach(item => {
            //     if (item !== accordionItem) {
            //         item.classList.remove('active');
            //         item.querySelector('.accordion-content').style.maxHeight = null;
            //         item.querySelector('.accordion-header').classList.remove('active');
            //     }
            // });

            if (isActive) {
                accordionItem.classList.remove('active');
                header.classList.remove('active');
                accordionContent.style.maxHeight = null;
                accordionContent.style.paddingTop = '0';
                accordionContent.style.paddingBottom = '0';

            } else {
                accordionItem.classList.add('active');
                header.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                accordionContent.style.paddingTop = '15px'; // Match CSS
                accordionContent.style.paddingBottom = '15px'; // Match CSS
            }
        });
    });
    // Modal / Popup Windows

    const modals = document.querySelectorAll('.modal');
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-button');

    function openModal(modalElement) { // Renamed parameter to avoid conflict
        if (modalElement) {
            modalElement.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    function closeModal(modalElement) { // Renamed parameter
        if (modalElement) {
            modalElement.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalTarget;
            if (!modalId) {
                console.error('Button is missing data-modal-target attribute:', button);
                return;
            }
            const targetModal = document.getElementById(modalId); // Renamed variable

            if (targetModal) {
                // Populate modal content if data attributes are present (for case studies)
                const modalTitleElement = targetModal.querySelector('#modal-title');
                const modalBodyElement = targetModal.querySelector('#modal-body');
                const modalImageElement = targetModal.querySelector('#modal-image');

                if (button.dataset.title && modalTitleElement) {
                    modalTitleElement.textContent = button.dataset.title;
                } else if (modalTitleElement) {
                    modalTitleElement.textContent = 'Details'; // Default title
                }

                if (button.dataset.content && modalBodyElement) {
                    // Replace newlines with paragraph breaks for better formatting
                    modalBodyElement.innerHTML = `<p>${button.dataset.content.replace(/\n/g, '</p><p>')}</p>`;
                } else if (modalBodyElement) {
                    modalBodyElement.innerHTML = '<p>More information will be available soon.</p>'; // Default content
                }

                // Handle image based on the button's context or another data attribute
                const caseStudyCard = button.closest('.case-study-card');
                if (caseStudyCard && modalImageElement) {
                    const imageInCard = caseStudyCard.querySelector('img');
                    if (imageInCard && imageInCard.src) {
                        modalImageElement.src = imageInCard.src;
                        modalImageElement.alt = button.dataset.title || imageInCard.alt || 'Case study image'; // Use button title or image's original alt
                        modalImageElement.style.display = 'block';
                    } else {
                        modalImageElement.style.display = 'none'; // Hide if no image in card
                    }
                } else if (modalImageElement) {
                    modalImageElement.style.display = 'none'; // Hide if no card or modal image element
                }
                
                openModal(targetModal);
            } else {
                console.error(`Modal with ID "${modalId}" not found.`);
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalToClose = button.closest('.modal'); // Renamed variable
            closeModal(modalToClose);
        });
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        modals.forEach(modalElement => { // Renamed variable
            if (event.target === modalElement) {
                closeModal(modalElement);
            }
        });
    });

    // Infographic Popups (if they use a similar mechanism but different modal IDs)
    const infographicItems = document.querySelectorAll('.infographic-item[data-infographic-target]');
    infographicItems.forEach(item => {
        item.addEventListener('click', () => {
            const modalId = item.dataset.infographicTarget.startsWith('infographic-popup-')
                ? item.dataset.infographicTarget
                : 'infographic-popup-' + item.dataset.infographicTarget; // Ensure full ID
            
            const targetModal = document.getElementById(modalId); // Renamed
            if (targetModal) {
                // You might want to add specific content population for infographic modals here if needed
                // For example, if they also use data-title, data-content from the .infographic-item
                const modalTitleElement = targetModal.querySelector('#modal-title'); // Assuming they might share title/body IDs
                const modalBodyElement = targetModal.querySelector('#modal-body');

                if(item.dataset.title && modalTitleElement) modalTitleElement.textContent = item.dataset.title;
                if(item.dataset.content && modalBodyElement) modalBodyElement.innerHTML = `<p>${item.dataset.content.replace(/\n/g, '</p><p>')}</p>`;

                openModal(targetModal);
            } else {
                console.error(`Infographic modal with ID "${modalId}" not found.`);
            }
        });
    });


    // Scrolling Animations (Fade-ins / Slide-ins)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: stop observing once animated
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });


    // Contact Form Submission (Basic Example - no actual sending)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission
           // You would typically gather form data here and send it via AJAX
            // For example:
            // const name = document.getElementById('name').value;
            // const email = document.getElementById('email').value;
            // const message = document.getElementById('message').value;
            // console.log('Form submitted:', { name, email, message });

            alert('Thank you for your message! (This is a demo - data not sent)');
            contactForm.reset();
        });
    }

    // Active Navigation Link Highlighting
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active'); // Ensure only one is active
        }
    });
    // Special case for home (index.html or /)
     if (currentLocation === 'index.html' || currentLocation === '') {
        const homeLink = document.querySelector('.nav-menu a[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }

});
