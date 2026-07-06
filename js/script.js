// js/script.js
// Toggle Mobile Menu
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            document.getElementById('navLinks').classList.remove('active');
        }
    });
});

// Create Particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
    }
}

// Mouse Follow Effect
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(mouseX - particleX, 2) + 
            Math.pow(mouseY - particleY, 2)
        );
        
        if (distance < 200) {
            particle.style.transform = `scale(2)`;
            particle.style.opacity = '0.6';
        } else {
            particle.style.transform = 'scale(1)';
            particle.style.opacity = '0.3';
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Initialize
createParticles();

// Ripple Effect on Buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-notify, .btn-discord').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Set Reminder - Download ICS Calendar File
document.getElementById('setReminder').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Format tanggal untuk ICS
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    
    // Kalau udah lewat jam 6 sore, set buat besok
    if (now > today) {
        today.setDate(today.getDate() + 1);
    }
    
    // Format ICS date: YYYYMMDDTHHMMSS
    const formatDate = (date) => {
        return date.getFullYear() + 
               String(date.getMonth() + 1).padStart(2, '0') + 
               String(date.getDate()).padStart(2, '0') + 'T' +
               String(date.getHours()).padStart(2, '0') + 
               String(date.getMinutes()).padStart(2, '0') + 
               '00';
    };
    
    const startDate = formatDate(today);
    const endDate = new Date(today.getTime() + 4 * 60 * 60 * 1000); // 4 jam stream
    const endDateFormat = formatDate(endDate);
    
    // Buat ICS content
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//RISG GAMING//Live Stream Reminder//EN',
        'BEGIN:VEVENT',
        'DTSTART:' + startDate,
        'DTEND:' + endDateFormat,
        'SUMMARY:RISG GAMING Live Stream 🎮',
        'DESCRIPTION:RISG GAMING is live streaming Mobile Legends!\\n\\nJoin the stream: https://youtube.com/@RISGGAMING\\n\\nDaily grind, push rank, mabar bareng! ⚓',
        'LOCATION:YouTube @RISGGAMING',
        'RRULE:FREQ=DAILY',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:RISG GAMING live in 15 minutes! 🚀',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT5M',
        'ACTION:DISPLAY',
        'DESCRIPTION:5 menit lagi! Siapin popcorn! 🍿',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    // Download ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'RISG_GAMING_Reminder.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Animasi sukses
    const btn = document.getElementById('setReminder');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>✅</span> Reminder Downloaded!';
    btn.style.background = 'rgba(34, 197, 94, 0.2)';
    btn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
    btn.style.color = '#4ade80';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = 'rgba(216, 155, 43, 0.2)';
        btn.style.borderColor = 'rgba(216, 155, 43, 0.3)';
        btn.style.color = '#D89B2B';
    }, 3000);
});