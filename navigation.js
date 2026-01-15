// نظام التنقل بين الفصول - النسخة النهائية مع العناوين الصحيحة
class ChapterNavigation {
    constructor() {
        this.totalChapters = 15;
        this.chapterTitles = {
            1: "اللقاء الغامض",
            2: "نهاية النزهة",
            3: "شخصية ضلعية",
            4: "البعد الأبيض",
            5: "محاولات يائسة",
            6: "خيانة",
            7: "تحت أنقاض الصمت",
            8: "صدى الهاوية",
            9: "معزوفة الفوضى",
            10: "أنشودة الجليد والرماد",
            11: "قيامة القرمزي ومنفى العمالقة",
            12: "مقبرة العوالم والعهد القديم",
            13: "سيمفونية التفتت",
            14: "بروتوكول العاصمة العليا",
            15: "سقوط المركز واندثار العهد القديم"
        };
        
        this.currentChapter = this.getCurrentChapter();
        this.init();
    }
    
    // استخراج رقم الفصل من اسم الملف الحالي
    getCurrentChapter() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        const match = filename.match(/(\d+)\.html$/);
        
        if (match) {
            return parseInt(match[1]);
        }
        
        // إذا كان في الصفحة الرئيسية، جلب آخر فصل تم قراءته
        return localStorage.getItem('lastChapter') || 1;
    }
    
    init() {
        // تحديد نوع الصفحة الحالية
        const isChapterPage = window.location.pathname.match(/\d+\.html$/);
        const isHomePage = window.location.pathname.endsWith('index.html') || 
                          window.location.pathname.endsWith('/');
        
        if (isChapterPage) {
            this.setupChapterPage();
        } else if (isHomePage) {
            this.setupHomePage();
        }
        
        // إعداد أحداث التنقل العامة
        this.setupGlobalNavigation();
        
        // تحديث مؤشر التقدم
        this.updateProgress();
    }
    
    setupChapterPage() {
        // تحديث عنوان الصفحة
        this.updatePageTitle();
        
        // تحديث شريط العنوان في الصفحة
        this.updateChapterHeader();
        
        // إعداد أزرار التنقل
        this.setupNavigationButtons();
        
        // تحديث مؤشر التقدم
        this.updateProgressIndicator();
        
        // حفظ التقدم
        this.saveProgress();
        
        // إضافة تأثيرات القراءة
        this.addReadingEffects();
        
        // إضافة أدوات القراءة
        this.addReadingTools();
    }
    
    setupHomePage() {
        // إنشاء بطاقات الفصول
        this.createChapterCards();
        
        // تحديث زر المتابعة
        this.updateContinueButton();
        
        // إعداد أحداث النقر على البطاقات
        this.setupCardEvents();
    }
    
    setupGlobalNavigation() {
        // اختصارات لوحة المفاتيح للتنقل بين الفصول
        document.addEventListener('keydown', (e) => {
            // فقط في صفحات الفصول
            if (!window.location.pathname.match(/\d+\.html$/)) return;
            
            switch(e.key) {
                case 'ArrowRight': // السهم الأيمن ← الفصل السابق
                case 'd':
                case 'D':
                    this.goToPreviousChapter();
                    break;
                    
                case 'ArrowLeft': // السهم الأيسر → الفصل التالي  
                case 'a':
                case 'A':
                    this.goToNextChapter();
                    break;
                    
                case 'Home':
                case 'Escape':
                    window.location.href = 'index.html';
                    break;
                    
                case '1': case '2': case '3': case '4': case '5':
                case '6': case '7': case '8': case '9':
                    const num = parseInt(e.key);
                    if (num <= this.totalChapters) {
                        window.location.href = `${num}.html`;
                    }
                    break;
                    
                case '0':
                    window.location.href = '10.html';
                    break;
            }
        });
        
        // إضافة معلومات التنقل للقارئ
        this.addNavigationHint();
    }
    
    updatePageTitle() {
        const title = `الفصل ${this.currentChapter}: ${this.chapterTitles[this.currentChapter]} - المارد الأعظم`;
        document.title = title;
    }
    
    updateChapterHeader() {
        const titleElement = document.querySelector('.chapter-title');
        const subtitleElement = document.querySelector('.chapter-subtitle');
        
        if (titleElement) {
            titleElement.textContent = `الفصل ${this.currentChapter}: ${this.chapterTitles[this.currentChapter]}`;
        }
        
        if (subtitleElement) {
            subtitleElement.textContent = `رواية المارد الأعظم - الفصل ${this.currentChapter} من ${this.totalChapters}`;
        }
    }
    
    setupNavigationButtons() {
        const prevBtn = document.querySelector('.prev-btn, [data-action="prev"]');
        const nextBtn = document.querySelector('.next-btn, [data-action="next"]');
        const homeBtn = document.querySelector('.home-btn, [data-action="home"]');
        
        // زر الفصل السابق
        if (prevBtn) {
            if (this.currentChapter > 1) {
                prevBtn.href = `${this.currentChapter - 1}.html`;
                prevBtn.style.display = 'flex';
                prevBtn.innerHTML = '<i class="fas fa-arrow-right"></i> الفصل السابق';
                prevBtn.title = `الذهاب إلى الفصل ${this.currentChapter - 1}: ${this.chapterTitles[this.currentChapter - 1]}`;
            } else {
                prevBtn.style.display = 'none';
            }
        }
        
        // زر الفصل التالي
        if (nextBtn) {
            if (this.currentChapter < this.totalChapters) {
                nextBtn.href = `${this.currentChapter + 1}.html`;
                nextBtn.style.display = 'flex';
                nextBtn.innerHTML = 'الفصل التالي <i class="fas fa-arrow-left"></i>';
                nextBtn.title = `الذهاب إلى الفصل ${this.currentChapter + 1}: ${this.chapterTitles[this.currentChapter + 1]}`;
            } else {
                nextBtn.innerHTML = 'النهاية <i class="fas fa-flag-checkered"></i>';
                nextBtn.title = 'نهاية الرواية';
                nextBtn.style.cursor = 'default';
                nextBtn.style.opacity = '0.7';
                nextBtn.onclick = (e) => e.preventDefault();
            }
        }
        
        // زر الرئيسية
        if (homeBtn) {
            homeBtn.href = 'index.html';
            homeBtn.title = 'العودة إلى الصفحة الرئيسية';
        }
    }
    
    updateProgressIndicator() {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        const percentage = (this.currentChapter / this.totalChapters) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            
            // إضافة فئة بناء على التقدم
            progressBar.className = 'progress-bar';
            if (percentage >= 66) progressBar.classList.add('high');
            else if (percentage >= 33) progressBar.classList.add('medium');
            else progressBar.classList.add('low');
        }
        
        if (progressText) {
            progressText.textContent = `الفصل ${this.currentChapter} من ${this.totalChapters} (${Math.round(percentage)}%)`;
        }
    }
    
    saveProgress() {
        if (this.currentChapter >= 1 && this.currentChapter <= this.totalChapters) {
            localStorage.setItem('lastChapter', this.currentChapter);
            localStorage.setItem('lastReadTime', new Date().toISOString());
            
            // إذا كان هذا أول قراءة، حفظ وقت البدء
            if (!localStorage.getItem('readingStartTime')) {
                localStorage.setItem('readingStartTime', new Date().toISOString());
            }
            
            // حفظ عنوان الفصل الأخير
            localStorage.setItem('lastChapterTitle', this.chapterTitles[this.currentChapter]);
            
            // إرسال حدث تحديث التقدم
            this.dispatchProgressEvent();
            
            // تحديث زر المتابعة في الصفحة الرئيسية
            this.updateContinueButton();
        }
    }
    
    createChapterCards() {
        const container = document.getElementById('chaptersGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= this.totalChapters; i++) {
            const card = document.createElement('a');
            card.href = `${i}.html`;
            card.className = 'chapter-card';
            card.dataset.chapter = i;
            card.title = `الفصل ${i}: ${this.chapterTitles[i]}`;
            
            // تحديد حالة الفصل
            let status = 'مستمر';
            if (i === 1) status = 'بداية';
            if (i === this.totalChapters) status = 'نهاية';
            
            // التحقق إذا كان الفصل مقروءاً
            const lastRead = parseInt(localStorage.getItem('lastChapter') || 0);
            const isRead = i <= lastRead;
            const isCurrent = i === lastRead;
            
            if (isRead) {
                card.classList.add('read');
            }
            if (isCurrent) {
                card.classList.add('current');
            }
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="chapter-number">${i}</span>
                    <span class="chapter-status ${isRead ? 'read' : ''}">${status}</span>
                </div>
                <h3 class="chapter-title">${this.chapterTitles[i]}</h3>
                <div class="card-footer">
                    <span class="read-btn">
                        ${isRead ? 'أكمل القراءة' : 'ابدأ القراءة'}
                        <i class="fas fa-arrow-left"></i>
                    </span>
                    <span class="page-count">~${Math.floor(Math.random() * 5) + 10} صفحة</span>
                </div>
                ${isRead ? '<div class="read-badge"><i class="fas fa-check"></i></div>' : ''}
            `;
            
            container.appendChild(card);
        }
    }
    
    updateContinueButton() {
        const continueBtn = document.getElementById('continueReadingBtn');
        const progressBtn = document.getElementById('progressBtn');
        const lastChapterSpan = document.getElementById('lastChapter');
        
        const lastChapter = localStorage.getItem('lastChapter') || 1;
        const lastChapterTitle = localStorage.getItem('lastChapterTitle') || this.chapterTitles[lastChapter];
        
        if (continueBtn) {
            if (lastChapter > 1) {
                continueBtn.style.display = 'flex';
                continueBtn.onclick = () => {
                    window.location.href = `${lastChapter}.html`;
                };
                continueBtn.title = `متابعة القراءة من الفصل ${lastChapter}: ${lastChapterTitle}`;
            } else {
                continueBtn.style.display = 'none';
            }
        }
        
        if (progressBtn && lastChapterSpan) {
            lastChapterSpan.textContent = `الفصل ${lastChapter}`;
            progressBtn.onclick = () => {
                window.location.href = `${lastChapter}.html`;
            };
            progressBtn.title = `الفصل الأخير المقروء: ${lastChapter}: ${lastChapterTitle}`;
        }
    }
    
    setupCardEvents() {
        // استخدام event delegation للبطاقات
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.chapter-card');
            if (card) {
                e.preventDefault();
                const chapter = card.dataset.chapter;
                
                // حفظ الفصل قبل الانتقال
                localStorage.setItem('selectedChapter', chapter);
                
                // الانتقال مع تأثير
                this.navigateWithEffect(chapter);
            }
        });
    }
    
    navigateWithEffect(chapter) {
        // إضافة تأثير انتقال
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = `${chapter}.html`;
        }, 300);
    }
    
    goToPreviousChapter() {
        if (this.currentChapter > 1) {
            this.navigateWithEffect(this.currentChapter - 1);
        }
    }
    
    goToNextChapter() {
        if (this.currentChapter < this.totalChapters) {
            this.navigateWithEffect(this.currentChapter + 1);
        }
    }
    
    addReadingEffects() {
        // تأثير ظهور الفقرات تدريجياً
        const paragraphs = document.querySelectorAll('.text-content p');
        
        paragraphs.forEach((p, index) => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(20px)';
            p.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // إبراز الفقرة الحالية أثناء التمرير
        let currentParagraph = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    currentParagraph = Array.from(paragraphs).indexOf(entry.target);
                    
                    // حفظ مكان القراءة
                    localStorage.setItem(`chapter_${this.currentChapter}_progress`, currentParagraph);
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            threshold: 0.5
        });
        
        paragraphs.forEach(p => observer.observe(p));
        
        // استعادة مكان القراءة السابق
        const savedProgress = localStorage.getItem(`chapter_${this.currentChapter}_progress`);
        if (savedProgress && paragraphs[savedProgress]) {
            setTimeout(() => {
                paragraphs[savedProgress].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 1000);
        }
    }
    
    addReadingTools() {
        // إضافة أدوات قراءة ديناميكية
        const toolsHTML = `
            <div class="reading-tools">
                <button class="tool-btn" id="fontIncrease" title="تكبير الخط (Ctrl + +)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="tool-btn" id="fontDecrease" title="تصغير الخط (Ctrl + -)">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="tool-btn" id="themeToggleBtn" title="تبديل نظام الألوان (T)">
                    <i class="fas fa-palette"></i>
                </button>
                <button class="tool-btn" id="printBtn" title="طباعة الفصل (P)">
                    <i class="fas fa-print"></i>
                </button>
                <button class="tool-btn" id="bookmarkBtn" title="حفظ المكان (B)">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
        `;
        
        // إضافة الأدوات فقط إذا لم تكن موجودة
        if (!document.querySelector('.reading-tools')) {
            document.body.insertAdjacentHTML('beforeend', toolsHTML);
            this.setupReadingTools();
        }
    }
    
    setupReadingTools() {
        // تكبير/تصغير الخط
        const fontIncrease = document.getElementById('fontIncrease');
        const fontDecrease = document.getElementById('fontDecrease');
        const textContent = document.querySelector('.text-content');
        
        let fontSize = localStorage.getItem('preferredFontSize') || 18;
        
        if (textContent) {
            textContent.style.fontSize = `${fontSize}px`;
        }
        
        fontIncrease?.addEventListener('click', () => {
            fontSize = Math.min(fontSize + 1, 24);
            updateFontSize();
        });
        
        fontDecrease?.addEventListener('click', () => {
            fontSize = Math.max(fontSize - 1, 14);
            updateFontSize();
        });
        
        function updateFontSize() {
            if (textContent) {
                textContent.style.fontSize = `${fontSize}px`;
                localStorage.setItem('preferredFontSize', fontSize);
            }
        }
        
        // اختصارات لوحة المفاتيح للأدوات
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '=') {
                e.preventDefault();
                fontSize = Math.min(fontSize + 1, 24);
                updateFontSize();
            }
            
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                fontSize = Math.max(fontSize - 1, 14);
                updateFontSize();
            }
            
            if (e.key === 't' || e.key === 'T') {
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) themeToggle.click();
            }
            
            if (e.key === 'p' || e.key === 'P') {
                window.print();
            }
            
            if (e.key === 'b' || e.key === 'B') {
                this.saveBookmark();
            }
        });
    }
    
    saveBookmark() {
        const paragraphs = document.querySelectorAll('.text-content p');
        const visibleParagraphs = Array.from(paragraphs).filter(p => {
            const rect = p.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= window.innerHeight;
        });
        
        if (visibleParagraphs.length > 0) {
            const index = Array.from(paragraphs).indexOf(visibleParagraphs[0]);
            localStorage.setItem(`bookmark_chapter_${this.currentChapter}`, index);
            
            // عرض إشعار
            this.showNotification('تم حفظ الإشارة المرجعية', 'success');
        }
    }
    
    addNavigationHint() {
        // إضافة تلميح بالاختصارات
        if (window.location.pathname.match(/\d+\.html$/)) {
            const hint = document.createElement('div');
            hint.className = 'navigation-hint';
            hint.innerHTML = `
                <div class="hint-content">
                    <small>
                        <i class="fas fa-keyboard"></i>
                        اختصارات: ← → للتنقل | ESC للرئيسية | رقم للقفز لفصل
                    </small>
                    <button class="hint-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(hint);
            
            // إغلاق التلميح
            hint.querySelector('.hint-close').addEventListener('click', () => {
                hint.remove();
                localStorage.setItem('navigationHintClosed', 'true');
            });
            
            // إخفاء التلميح تلقائياً بعد 8 ثوان
            if (!localStorage.getItem('navigationHintClosed')) {
                setTimeout(() => {
                    if (hint.parentElement) {
                        hint.style.opacity = '0';
                        setTimeout(() => hint.remove(), 1000);
                    }
                }, 8000);
            } else {
                setTimeout(() => hint.remove(), 3000);
            }
        }
    }
    
    updateProgress() {
        // تحديث مؤشر التقدم في الصفحة الرئيسية
        const lastChapter = localStorage.getItem('lastChapter') || 1;
        const progressPercentage = (lastChapter / this.totalChapters) * 100;
        
        // تخزين إحصائيات القراءة
        const stats = {
            currentChapter: parseInt(lastChapter),
            totalChapters: this.totalChapters,
            progress: progressPercentage,
            lastRead: localStorage.getItem('lastReadTime'),
            startTime: localStorage.getItem('readingStartTime'),
            chaptersRead: lastChapter,
            chaptersRemaining: this.totalChapters - lastChapter
        };
        
        localStorage.setItem('readingStats', JSON.stringify(stats));
    }
    
    dispatchProgressEvent() {
        const event = new CustomEvent('readingProgress', {
            detail: {
                chapter: this.currentChapter,
                total: this.totalChapters,
                title: this.chapterTitles[this.currentChapter],
                time: new Date().toISOString()
            }
        });
        
        window.dispatchEvent(event);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-success)' : 'var(--bg-card)'};
            color: ${type === 'success' ? 'white' : 'var(--text-primary)'};
            padding: 12px 20px;
            border-radius: var(--border-radius);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // دالة مساعدة للحصول على إحصائيات القراءة
    static getReadingStats() {
        const stats = JSON.parse(localStorage.getItem('readingStats') || '{}');
        const lastReadTime = stats.lastRead ? new Date(stats.lastRead) : null;
        const startTime = stats.startTime ? new Date(stats.startTime) : new Date();
        
        let readingTime = { hours: 0, minutes: 0 };
        if (lastReadTime && startTime) {
            const diff = lastReadTime - startTime;
            readingTime.hours = Math.floor(diff / (1000 * 60 * 60));
            readingTime.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        }
        
        return {
            ...stats,
            readingTime,
            percentage: stats.progress || 0
        };
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.chapterNav = new ChapterNavigation();
    
    // إضافة أنماط إضافية للتنقل
    const navigationStyles = document.createElement('style');
    navigationStyles.textContent = `
        /* أنماط التنقل */
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes slideInLeft {
            from {
                transform: translateX(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .navigation-hint {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 10px 15px;
            border-radius: var(--border-radius);
            font-size: 12px;
            color: var(--text-secondary);
            z-index: 1000;
            box-shadow: var(--shadow-base);
            transition: opacity 1s ease;
            max-width: 300px;
        }
        
        .hint-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        
        .hint-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        .hint-close:hover {
            background-color: var(--border-color);
        }
        
        .text-content p.active {
            background: rgba(var(--accent-primary-rgb, 142, 68, 173), 0.05);
            border-right: 2px solid var(--accent-primary);
            padding-right: 10px;
            margin-right: -10px;
            transition: all 0.3s ease;
        }
        
        /* أدوات القراءة */
        .reading-tools {
            position: fixed;
            bottom: 80px;
            left: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 90;
            background: var(--bg-card);
            padding: 10px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-base);
        }
        
        .tool-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 16px;
        }
        
        .tool-btn:hover {
            background-color: var(--accent-primary);
            color: white;
            transform: scale(1.1);
            border-color: var(--accent-primary);
        }
        
        /* تقدم القراءة */
        .progress-bar.high {
            background: linear-gradient(90deg, var(--accent-success), #27ae60);
        }
        
        .progress-bar.medium {
            background: linear-gradient(90deg, var(--accent-secondary), #2980b9);
        }
        
        .progress-bar.low {
            background: linear-gradient(90deg, var(--accent-primary), #9b59b6);
        }
        
        /* تنقل سلس بين الصفحات */
        body {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* إشعارات */
        .notification {
            animation: slideIn 0.3s ease forwards;
        }
        
        .notification::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: currentColor;
            border-radius: var(--border-radius) 0 0 var(--border-radius);
        }
    `;
    
    document.head.appendChild(navigationStyles);
    
    // إضافة حدث للتنقل السلس
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href$=".html"]');
        if (link && !e.ctrlKey && !e.metaKey && link.href.includes(location.hostname)) {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // تأثير انتقال
            document.body.style.opacity = '0.8';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// دعم الروابط الخارجية بدون تأثيرات
document.addEventListener('DOMContentLoaded', () => {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

// تصدير الفئة للاستخدام العالمي
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChapterNavigation };
}