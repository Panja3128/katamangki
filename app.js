// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize the app
    initializeApp();
});

// Main app initialization function
function initializeApp() {
    // Initialize calendar
    initializeCalendar();
    
    // Display all quotes
    displayAllQuotes();
    
    // Update favorites display
    updateFavoritesDisplay();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize user profile
    initializeUserProfile();
    
    // Show daily notification
    showDailyNotification();
}

// Database kata-kata motivasi
const quotes = [
    // Kategori: Kesuksesan
    {
        text: "Kesuksesan bukanlah kunci kebahagiaan. Kebahagiaanlah kunci kesuksesan. Jika Anda mencintai apa yang Anda lakukan, Anda akan berhasil.",
        author: "Albert Schweitzer",
        category: "kesuksesan",
        source: "Terkenal"
    },
    {
        text: "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang Anda lakukan.",
        author: "Steve Jobs",
        category: "kesuksesan",
        source: "Terkenal"
    },
    {
        text: "Jangan pernah menyerah. Hari ini adalah kesempatan Anda untuk membangun masa depan yang Anda inginkan.",
        author: "Anonim",
        category: "kesuksesan",
        source: "Terkenal"
    },
    // Tambahkan lebih banyak quote sesuai kebutuhan...
];

// Local storage management
let userQuotes = JSON.parse(localStorage.getItem('userQuotes')) || [];
let favoriteQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
let userData = JSON.parse(localStorage.getItem('userData')) || {
    name: 'User',
    email: '',
    bio: ''
};
let settings = JSON.parse(localStorage.getItem('settings')) || {
    theme: 'light',
    fontSize: 'medium'
};

// Initialize theme
function initializeTheme() {
    if (settings.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Apply font size
    if (settings.fontSize === 'small') {
        document.documentElement.style.fontSize = '14px';
    } else if (settings.fontSize === 'large') {
        document.documentElement.style.fontSize = '18px';
    } else {
        document.documentElement.style.fontSize = '16px';
    }
}

// Initialize user profile
function initializeUserProfile() {
    if (userData.name !== 'User') {
        document.querySelector('.user-name').textContent = userData.name;
        document.querySelector('.user-avatar').textContent = userData.name.charAt(0).toUpperCase();
    }
}

// Initialize calendar
function initializeCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Set calendar month text
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    document.getElementById('calendarMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Generate calendar
    generateCalendar(currentYear, currentMonth);
    
    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', function() {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        document.getElementById('calendarMonth').textContent = `${monthNames[newMonth]} ${newYear}`;
        generateCalendar(newYear, newMonth);
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        document.getElementById('calendarMonth').textContent = `${monthNames[newMonth]} ${newYear}`;
        generateCalendar(newYear, newMonth);
    });
}

// Generate calendar
function generateCalendar(year, month) {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this day is today
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add random motivation indicator
        if (Math.random() > 0.7) {
            dayElement.classList.add('has-motivation');
            dayElement.title = 'Ada motivasi untuk hari ini';
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // New quote button
    document.getElementById('newQuoteBtn').addEventListener('click', function() {
        const btnText = document.getElementById('newQuoteBtnText');
        btnText.innerHTML = '<span class="spinner"></span> Memuat...';
        
        setTimeout(() => {
            getRandomQuote();
            btnText.textContent = 'Motivasi Lainnya';
        }, 500);
    });
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', searchQuotes);
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchQuotes();
        }
    });
    
    // Filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.filter-tag').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            searchQuotes();
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Create tabs
    document.querySelectorAll('.create-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.create-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.create-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // User create form
    document.getElementById('userCreateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const quoteText = document.getElementById('userQuoteText').value;
        const userName = document.getElementById('userName').value;
        const category = document.getElementById('userCategory').value;
        
        const newQuote = {
            id: Date.now().toString(),
            text: quoteText,
            author: userName,
            category: category,
            source: 'Pengguna'
        };
        
        userQuotes.push(newQuote);
        localStorage.setItem('userQuotes', JSON.stringify(userQuotes));
        
        showNotification(`Terima kasih ${userName}! Kata motivasi Anda telah ditambahkan.`);
        
        this.reset();
        displayAllQuotes();
    });
    
    // AI generate button
    document.getElementById('generateAiBtn').addEventListener('click', function() {
        const aiResult = document.getElementById('aiResult');
        const aiActions = document.getElementById('aiActions');
        
        aiResult.innerHTML = '<div class="loading"><span class="spinner"></span> Sedang generate kata motivasi...</div>';
        aiActions.style.display = 'none';
        
        const selectedTags = [];
        document.querySelectorAll('.ai-tag.active').forEach(tag => {
            selectedTags.push(tag.getAttribute('data-ai-tag'));
        });
        
        setTimeout(() => {
            const aiQuotes = [
                {
                    text: "Setiap pagi adalah kesempatan baru untuk menulis cerita hidup Anda sendiri.",
                    author: "AI Generator",
                    category: selectedTags.includes('kehidupan') ? 'kehidupan' : 'kesuksesan'
                },
                {
                    text: "Kekuatan sejati tidak datang dari kemampuan fisik, tetapi dari kemauan yang tak terkalahkan.",
                    author: "AI Generator",
                    category: selectedTags.includes('semangat') ? 'kehidupan' : 'kesuksesan'
                }
            ];
            
            const randomIndex = Math.floor(Math.random() * aiQuotes.length);
            const quote = aiQuotes[randomIndex];
            
            aiResult.innerHTML = `
                <div class="ai-result-text">"${quote.text}"</div>
                <div class="generator-author">- ${quote.author}</div>
            `;
            
            aiActions.style.display = 'flex';
            
            document.getElementById('saveAiQuote').onclick = function() {
                const newQuote = {
                    id: Date.now().toString(),
                    text: quote.text,
                    author: quote.author,
                    category: quote.category,
                    source: 'AI Generator'
                };
                
                userQuotes.push(newQuote);
                localStorage.setItem('userQuotes', JSON.stringify(userQuotes));
                
                showNotification('Kata motivasi AI telah disimpan!');
                displayAllQuotes();
            };
            
            document.getElementById('regenerateAiBtn').onclick = function() {
                document.getElementById('generateAiBtn').click();
            };
        }, 1500);
    });
    
    // AI tags
    document.querySelectorAll('.ai-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Contribution form
    document.getElementById('contributionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const contributorName = document.getElementById('contributorName').value;
        const quoteText = document.getElementById('quoteText').value;
        const quoteAuthor = document.getElementById('quoteAuthor').value || 'Anonim';
        const quoteCategory = document.getElementById('quoteCategory').value;
        
        const newQuote = {
            id: Date.now().toString(),
            text: quoteText,
            author: quoteAuthor,
            category: quoteCategory,
            source: 'Kontributor'
        };
        
        userQuotes.push(newQuote);
        localStorage.setItem('userQuotes', JSON.stringify(userQuotes));
        
        showNotification(`Terima kasih ${contributorName}! Kontribusi Anda telah ditambahkan.`);
        
        this.reset();
        displayAllQuotes();
    });
    
    // Generator button
    document.getElementById('generateBtn').addEventListener('click', generateQuote);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            this.innerHTML = '<i class="fas fa-moon"></i>';
            settings.theme = 'light';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
            settings.theme = 'dark';
        }
        localStorage.setItem('settings', JSON.stringify(settings));
    });
    
    // Font controls
    document.getElementById('fontDecrease').addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = `${currentSize - 2}px`;
        settings.fontSize = 'small';
        localStorage.setItem('settings', JSON.stringify(settings));
    });
    
    document.getElementById('fontNormal').addEventListener('click', function() {
        document.documentElement.style.fontSize = '16px';
        settings.fontSize = 'medium';
        localStorage.setItem('settings', JSON.stringify(settings));
    });
    
    document.getElementById('fontIncrease').addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = `${currentSize + 2}px`;
        settings.fontSize = 'large';
        localStorage.setItem('settings', JSON.stringify(settings));
    });
    
    // User profile
    document.getElementById('userProfile').addEventListener('click', function() {
        document.getElementById('userModal').style.display = 'block';
    });
    
    document.getElementById('userModalClose').addEventListener('click', function() {
        document.getElementById('userModal').style.display = 'none';
    });
    
    // User form
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const userBio = document.getElementById('userBio').value;
        
        userData = {
            name: userName,
            email: userEmail,
            bio: userBio
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        document.querySelector('.user-name').textContent = userName;
        document.querySelector('.user-avatar').textContent = userName.charAt(0).toUpperCase();
        
        showNotification('Profil berhasil diperbarui!');
        
        document.getElementById('userModal').style.display = 'none';
    });
    
    // Welcome message close
    document.getElementById('welcomeClose').addEventListener('click', function() {
        document.getElementById('welcomeMessage').style.display = 'none';
    });
    
    // Quote action buttons
    document.getElementById('likeQuote').addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--accent)';
            showNotification('Anda menyukai kata motivasi ini!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
        }
    });
    
    document.getElementById('favoriteQuote').addEventListener('click', function() {
        const icon = this.querySelector('i');
        const quoteText = document.getElementById('dailyQuote').textContent.replace(/"/g, '');
        const quoteAuthor = document.getElementById('dailyAuthor').textContent.replace('- ', '');
        const quoteCategory = document.getElementById('dailyCategory').textContent.toLowerCase();
        const quoteSource = document.getElementById('dailySource').textContent;
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--accent)';
            
            if (!favoriteQuotes.find(fav => fav.text === quoteText)) {
                favoriteQuotes.push({
                    id: Date.now().toString(),
                    text: quoteText,
                    author: quoteAuthor,
                    category: quoteCategory,
                    source: quoteSource
                });
                localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
                updateFavoritesDisplay();
                showNotification('Ditambahkan ke favorit!');
            }
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            
            favoriteQuotes = favoriteQuotes.filter(fav => fav.text !== quoteText);
            localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
            updateFavoritesDisplay();
            showNotification('Dihapus dari favorit!');
        }
    });
    
    document.getElementById('speakQuote').addEventListener('click', function() {
        const quoteText = document.getElementById('dailyQuote').textContent.replace(/"/g, '');
        speakText(quoteText);
    });
    
    // Motivation widget
    document.getElementById('widgetToggle').addEventListener('click', function() {
        const widget = document.getElementById('motivationWidget');
        widget.classList.toggle('show');
    });
    
    // Daily notification
    document.getElementById('dailyNotificationClose').addEventListener('click', function() {
        document.getElementById('dailyNotification').classList.remove('show');
    });
    
    // Notification close
    document.getElementById('notificationClose').addEventListener('click', function() {
        document.getElementById('notification').classList.remove('show');
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mobile menu button
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        const nav = document.querySelector('nav');
        if (nav.style.display === 'block') {
            nav.style.display = '';
        } else {
            nav.style.display = 'block';
        }
    });
}

// Show daily notification
function showDailyNotification() {
    setTimeout(() => {
        document.getElementById('dailyNotification').classList.add('show');
        
        setTimeout(() => {
            document.getElementById('dailyNotification').classList.remove('show');
        }, 10000);
    }, 3000);
}

// Get random quote
function getRandomQuote() {
    const allQuotes = [...quotes, ...userQuotes];
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    const quote = allQuotes[randomIndex];
    
    document.getElementById('dailyQuote').textContent = `"${quote.text}"`;
    document.getElementById('dailyAuthor').textContent = `- ${quote.author}`;
    document.getElementById('dailyCategory').textContent = quote.category.charAt(0).toUpperCase() + quote.category.slice(1);
    document.getElementById('dailySource').textContent = quote.source;
    
    updateShareButtons(quote);
}

// Update share buttons
function updateShareButtons(quote) {
    const text = encodeURIComponent(`"${quote.text}" - ${quote.author}`);
    const url = encodeURIComponent(window.location.href);
    
    document.querySelector('.share-facebook').onclick = function() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    };
    
    document.querySelector('.share-twitter').onclick = function() {
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };
    
    document.querySelector('.share-whatsapp').onclick = function() {
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    };
    
    document.querySelector('.share-instagram').onclick = function() {
        showNotification('Silakan screenshot dan bagikan ke Instagram!');
    };
    
    document.querySelector('.share-pinterest').onclick = function() {
        window.open(`https://pinterest.com/pin/create/button/?url=${url}&description=${text}`, '_blank');
    };
    
    document.querySelector('.share-linkedin').onclick = function() {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };
    
    document.querySelector('.share-link').onclick = function() {
        navigator.clipboard.writeText(`${window.location.href}`);
        showNotification('Link telah disalin ke clipboard!');
    };
}

// Filter by category
function filterByCategory(category) {
    const allQuotes = [...quotes, ...userQuotes];
    const filteredQuotes = allQuotes.filter(quote => quote.category === category);
    const motivationCards = document.getElementById('motivationCards');
    
    motivationCards.innerHTML = '';
    
    filteredQuotes.forEach(quote => {
        const card = createMotivationCard(quote);
        motivationCards.appendChild(card);
    });
    
    document.getElementById('motivationCards').scrollIntoView({ behavior: 'smooth' });
}

// Create motivation card
function createMotivationCard(quote) {
    const card = document.createElement('div');
    card.className = 'motivation-card';
    
    let imageUrl = '';
    switch(quote.category) {
        case 'kesuksesan':
            imageUrl = 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'kehidupan':
            imageUrl = 'https://images.unsplash.com/photo-1506126613408-cca07d5b9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'cinta':
            imageUrl = 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'spiritual':
            imageUrl = 'https://images.unsplash.com/photo-1506126613408-cca07d5b9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'persahabatan':
            imageUrl = 'https://images.unsplash.com/photo-1529158868331-599ce30d5fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'keluarga':
            imageUrl = 'https://images.unsplash.com/photo-1529158868331-599ce30d5fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'karir':
            imageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
        case 'kesehatan':
            imageUrl = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
            break;
    }
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${imageUrl}" alt="Motivasi ${quote.category}">
        </div>
        <div class="card-content">
            <div class="card-quote">"${quote.text}"</div>
            <div class="card-author">- ${quote.author}</div>
            <div class="card-category">${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}</div>
            <div class="card-source">${quote.source}</div>
            <div class="card-actions">
                <button class="card-action-btn like-btn" data-id="${quote.id || quote.text}">
                    <i class="far fa-heart"></i>
                </button>
                <button class="card-action-btn favorite-btn" data-id="${quote.id || quote.text}">
                    <i class="far fa-bookmark"></i>
                </button>
                <button class="card-action-btn share-btn">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="card-action-btn speak-btn">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="rating" data-id="${quote.id || quote.text}">
                <span class="star" data-rating="1"><i class="far fa-star"></i></span>
                <span class="star" data-rating="2"><i class="far fa-star"></i></span>
                <span class="star" data-rating="3"><i class="far fa-star"></i></span>
                <span class="star" data-rating="4"><i class="far fa-star"></i></span>
                <span class="star" data-rating="5"><i class="far fa-star"></i></span>
            </div>
            <div class="comments-section" id="comments-${quote.id || quote.text.replace(/\s+/g, '-')}">
                <!-- Comments will be added here -->
            </div>
        </div>
    `;
    
    // Add event listeners for card actions
    setupCardEventListeners(card, quote);
    
    return card;
}

// Setup event listeners for card actions
function setupCardEventListeners(card, quote) {
    // Like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--accent)';
            showNotification('Anda menyukai kata motivasi ini!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
        }
    });
    
    // Favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--accent)';
            
            if (!favoriteQuotes.find(fav => fav.id === quote.id || fav.text === quote.text)) {
                favoriteQuotes.push({
                    id: quote.id || Date.now().toString(),
                    text: quote.text,
                    author: quote.author,
                    category: quote.category,
                    source: quote.source
                });
                localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
                updateFavoritesDisplay();
                showNotification('Ditambahkan ke favorit!');
            }
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '';
            
            favoriteQuotes = favoriteQuotes.filter(fav => fav.id !== (quote.id || quote.text));
            localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
            updateFavoritesDisplay();
            showNotification('Dihapus dari favorit!');
        }
    });
    
    // Share button
    const shareBtn = card.querySelector('.share-btn');
    shareBtn.addEventListener('click', function() {
        updateShareButtons(quote);
        showNotification('Link telah disalin ke clipboard!');
    });
    
    // Speak button
    const speakBtn = card.querySelector('.speak-btn');
    speakBtn.addEventListener('click', function() {
        speakText(quote.text);
    });
    
    // Rating stars
    const stars = card.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            const quoteId = this.closest('.rating').getAttribute('data-id');
            
            for (let i = 0; i < 5; i++) {
                if (i < rating) {
                    stars[i].querySelector('i').classList.remove('far');
                    stars[i].querySelector('i').classList.add('fas');
                } else {
                    stars[i].querySelector('i').classList.remove('fas');
                    stars[i].querySelector('i').classList.add('far');
                }
            }
            
            let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
            ratings[quoteId] = rating;
            localStorage.setItem('ratings', JSON.stringify(ratings));
            
            showNotification(`Anda memberi rating ${rating} bintang untuk kata motivasi ini!`);
        });
    });
    
    // Comment form
    const commentsSection = card.querySelector('.comments-section');
    const commentForm = document.createElement('div');
    commentForm.className = 'comment-form';
    commentForm.innerHTML = `
        <input type="text" class="comment-input" placeholder="Tambahkan komentar...">
        <button class="comment-btn">Kirim</button>
    `;
    
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const commentInput = this.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        
        if (commentText) {
            const comment = document.createElement('div');
            comment.className = 'comment';
            comment.innerHTML = `
                <div class="comment-author">Anda</div>
                <div class="comment-text">${commentText}</div>
            `;
            
            commentsSection.insertBefore(comment, commentsSection.firstChild);
            commentInput.value = '';
            
            let comments = JSON.parse(localStorage.getItem('comments')) || {};
            const quoteId = this.closest('.comments-section').id.replace('comments-', '');
            
            if (!comments[quoteId]) {
                comments[quoteId] = [];
            }
            
            comments[quoteId].push({
                author: 'Anda',
                text: commentText,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('comments', JSON.stringify(comments));
        }
    });
    
    commentsSection.appendChild(commentForm);
    
    // Load existing comments
    const quoteId = quote.id || quote.text.replace(/\s+/g, '-');
    const comments = JSON.parse(localStorage.getItem('comments')) || {};
    
    if (comments[quoteId]) {
        comments[quoteId].forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsSection.insertBefore(commentEl, commentsSection.firstChild);
        });
    }
}

// Update favorites display
function updateFavoritesDisplay() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (favoriteQuotes.length === 0) {
        favoritesGrid.innerHTML = '<p style="text-align: center; width: 100%;">Belum ada kata motivasi favorit. Klik ikon bookmark pada kata motivasi untuk menambahkan ke sini.</p>';
        return;
    }
    
    favoritesGrid.innerHTML = '';
    
    favoriteQuotes.forEach(quote => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        
        card.innerHTML = `
            <div class="card-quote">"${quote.text}"</div>
            <div class="card-author">- ${quote.author}</div>
            <div class="card-category">${quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}</div>
            <div class="card-source">${quote.source}</div>
            <button class="favorite-remove" data-id="${quote.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const removeBtn = card.querySelector('.favorite-remove');
        removeBtn.addEventListener('click', function() {
            favoriteQuotes = favoriteQuotes.filter(fav => fav.id !== quote.id);
            localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
            updateFavoritesDisplay();
            showNotification('Dihapus dari favorit!');
        });
        
        favoritesGrid.appendChild(card);
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    notificationMessage.textContent = message;
    
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--success)';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--accent)';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Search quotes
function searchQuotes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-tag.active').getAttribute('data-filter');
    
    if (searchTerm === '' && activeFilter === 'all') {
        displayAllQuotes();
        return;
    }
    
    const allQuotes = [...quotes, ...userQuotes];
    let filteredQuotes = allQuotes;
    
    if (activeFilter !== 'all') {
        filteredQuotes = filteredQuotes.filter(quote => quote.category === activeFilter);
    }
    
    if (searchTerm !== '') {
        filteredQuotes = filteredQuotes.filter(quote => 
            quote.text.toLowerCase().includes(searchTerm) || 
            quote.author.toLowerCase().includes(searchTerm)
        );
    }
    
    const motivationCards = document.getElementById('motivationCards');
    
    motivationCards.innerHTML = '';
    
    if (filteredQuotes.length === 0) {
        motivationCards.innerHTML = '<p style="text-align: center; width: 100%;">Tidak ditemukan kata motivasi yang sesuai dengan pencarian Anda.</p>';
        return;
    }
    
    filteredQuotes.forEach(quote => {
        const card = createMotivationCard(quote);
        motivationCards.appendChild(card);
    });
    
    document.getElementById('motivationCards').scrollIntoView({ behavior: 'smooth' });
}

// Display all quotes
function displayAllQuotes() {
    const allQuotes = [...quotes, ...userQuotes];
    const motivationCards = document.getElementById('motivationCards');
    
    motivationCards.innerHTML = '';
    
    allQuotes.forEach(quote => {
        const card = createMotivationCard(quote);
        motivationCards.appendChild(card);
    });
}

// Text-to-speech
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
    } else {
        showNotification('Browser Anda tidak mendukung fitur text-to-speech.');
    }
}

// Generate quote based on filters
function generateQuote() {
    const category = document.getElementById('generatorCategory').value;
    const emotion = document.getElementById('generatorEmotion').value;
    const situation = document.getElementById('generatorSituation').value;
    
    let filteredQuotes = [...quotes, ...userQuotes];
    
    if (category) {
        filteredQuotes = filteredQuotes.filter(quote => quote.category === category);
    }
    
    if (filteredQuotes.length === 0) {
        document.getElementById('generatorResult').innerHTML = '<div class="generator-quote">Tidak ditemukan kata motivasi yang sesuai dengan filter Anda.</div>';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    
    document.getElementById('generatorResult').innerHTML = `
        <div class="generator-quote">"${quote.text}"</div>
        <div class="generator-author">- ${quote.author}</div>
        <div class="tts-controls">
            <button class="tts-btn" id="speakGenerated">
                <i class="fas fa-volume-up"></i> Dengarkan
            </button>
            <button class="tts-btn" id="copyGenerated">
                <i class="fas fa-copy"></i> Salin
            </button>
        </div>
    `;
    
    document.getElementById('speakGenerated').onclick = function() {
        speakText(quote.text);
    };
    
    document.getElementById('copyGenerated').onclick = function() {
        navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
        showNotification('Teks telah disalin ke clipboard!');
    };
}