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
    
    // تعديل: استخراج الرقم من رابط الـ URL parameter
    getCurrentChapter() {
        const urlParams = new URLSearchParams(window.location.search);
        const ch = parseInt(urlParams.get('ch'));
        if (ch) return ch;
        
        return parseInt(localStorage.getItem('lastChapter')) || 1;
    }
    
    init() {
        // تعديل: طريقة التعرف على الصفحة
        const isChapterPage = window.location.pathname.includes('chapter.html');
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        
        if (isChapterPage) {
            this.setupChapterPage();
        } else if (isHomePage) {
            this.setupHomePage();
        }
        
        this.setupGlobalNavigation();
        this.updateProgress();
    }
    
    setupChapterPage() {
        // العناوين يتم تحديثها بالفعل داخل ملف chapter.html
        // نحن هنا نركز على الاختصارات وحفظ التقدم
        this.saveProgress();
        this.addNavigationHint();
    }
    
    setupHomePage() {
        this.createChapterCards();
        this.updateContinueButton();
        // لا نحتاج setupCardEvents لأننا سنضع الروابط مباشرة في الـ href
    }
    
    setupGlobalNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!window.location.pathname.includes('chapter.html')) return;
            
            switch(e.key) {
                case 'ArrowRight': 
                case 'd':
                    this.goToPreviousChapter();
                    break;
                    
                case 'ArrowLeft': 
                case 'a':
                    this.goToNextChapter();
                    break;
                    
                case 'Home':
                case 'Escape':
                    window.location.href = 'index.html';
                    break;
            }
        });
    }
    
    updateProgress() {
        // تحديث شريط التقدم إذا وجد (في الهيدر مثلاً)
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar && this.currentChapter) {
            const percentage = (this.currentChapter / this.totalChapters) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    saveProgress() {
        if (this.currentChapter >= 1 && this.currentChapter <= this.totalChapters) {
            localStorage.setItem('lastChapter', this.currentChapter);
            localStorage.setItem('lastReadTime', new Date().toISOString());
            if (!localStorage.getItem('readingStartTime')) {
                localStorage.setItem('readingStartTime', new Date().toISOString());
            }
        }
    }
    
    createChapterCards() {
        const container = document.getElementById('chaptersGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= this.totalChapters; i++) {
            const card = document.createElement('a');
            // تعديل جوهري: الرابط أصبح chapter.html?ch=X
            card.href = `chapter.html?ch=${i}`;
            card.className = 'chapter-card';
            
            let status = 'مستمر';
            if (i === 1) status = 'بداية';
            if (i === this.totalChapters) status = 'نهاية';
            
            const lastRead = parseInt(localStorage.getItem('lastChapter') || 0);
            const isRead = i <= lastRead;
            
            if (isRead) card.classList.add('read');
            
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
                    <span class="page-count">~12 صفحة</span>
                </div>
            `;
            
            container.appendChild(card);
        }
    }
    
    updateContinueButton() {
        // هذه الدالة ستعمل فقط إذا وجدت العناصر، وإلا ستتجاهلها
        const continueBtn = document.getElementById('continueReadingBtn');
        const progressBtn = document.getElementById('progressBtn');
        const lastChapterSpan = document.getElementById('lastChapter');
        
        const lastChapter = localStorage.getItem('lastChapter') || 1;
        
        if (continueBtn) {
            continueBtn.style.display = lastChapter > 1 ? 'flex' : 'none';
            continueBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = `chapter.html?ch=${lastChapter}`;
            };
        }
        
        if (progressBtn && lastChapterSpan) {
            lastChapterSpan.textContent = `الفصل ${lastChapter}`;
            progressBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = `chapter.html?ch=${lastChapter}`;
            };
        }
    }
    
    goToPreviousChapter() {
        if (this.currentChapter > 1) {
            window.location.href = `chapter.html?ch=${this.currentChapter - 1}`;
        }
    }
    
    goToNextChapter() {
        if (this.currentChapter < this.totalChapters) {
            window.location.href = `chapter.html?ch=${this.currentChapter + 1}`;
        }
    }
    
    addNavigationHint() {
        // (يمكنك إبقاء دالة التلميح كما هي من الكود السابق إذا أردت، أو حذفها للتبسيط)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chapterNav = new ChapterNavigation();
});
