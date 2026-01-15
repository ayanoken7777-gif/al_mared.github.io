// نظام تبديل أنظمة الألوان
class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'night'];
        this.currentTheme = this.getSavedTheme();
        this.init();
    }
    
    init() {
        // تطبيق الموضوع المحفوظ
        this.applyTheme(this.currentTheme);
        
        // إعداد حدث النقر على زر التبديل
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.nextTheme());
        }
        
        // تحديث أيقونة الزر
        this.updateToggleIcon();
        
        // إضافة أنماط ديناميكية للزر
        this.addButtonStyles();
        
        // إضافة تحسينات للواجهة
        this.addEnhancements();
    }
    
    getSavedTheme() {
        // محاولة الحصول من localStorage
        const saved = localStorage.getItem('novel_theme');
        
        // إذا كان هناك موضوع محفوظ وكان صالحاً
        if (saved && this.themes.includes(saved)) {
            return saved;
        }
        
        // التحقق من تفضيلات النظام
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        // الافتراضي
        return 'light';
    }
    
    saveTheme(theme) {
        localStorage.setItem('novel_theme', theme);
    }
    
    applyTheme(theme) {
        // إزالة جميع الفئات القديمة
        this.themes.forEach(t => {
            document.body.classList.remove(`theme-${t}`);
        });
        
        // إضافة الفئة الجديدة
        document.body.classList.add(`theme-${theme}`);
        
        // تعيين سمة البيانات
        document.body.setAttribute('data-theme', theme);
        
        // تحديث التيار
        this.currentTheme = theme;
        
        // الحفظ
        this.saveTheme(theme);
        
        // تحديث الأيقونة
        this.updateToggleIcon();
        
        // إرسال حدث للتغيير
        this.dispatchThemeChange();
        
        // تطبيق تأثيرات خاصة بالنظام
        this.applyThemeEffects(theme);
    }
    
    nextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        const nextTheme = this.themes[nextIndex];
        
        // تأثير التحول
        document.body.style.opacity = '0.9';
        
        setTimeout(() => {
            this.applyTheme(nextTheme);
            document.body.style.opacity = '1';
        }, 200);
    }
    
    updateToggleIcon() {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;
        
        const iconMap = {
            'light': 'fa-moon',
            'dark': 'fa-star',
            'night': 'fa-sun'
        };
        
        const currentIcon = toggleBtn.querySelector('i');
        if (currentIcon) {
            currentIcon.className = `fas ${iconMap[this.currentTheme]}`;
        }
        
        // تحديث title
        const themeNames = {
            'light': 'الفاتح',
            'dark': 'الداكن', 
            'night': 'الليلي'
        };
        
        toggleBtn.title = `النظام ${themeNames[this.currentTheme]} - انقر للتبديل`;
    }
    
    applyThemeEffects(theme) {
        // تطبيق تأثيرات خاصة بكل نظام
        const effects = {
            'light': () => {
                // تأثيرات للنظام الفاتح
                document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.08)');
            },
            'dark': () => {
                // تأثيرات للنظام الداكن
                document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
            },
            'night': () => {
                // تأثيرات للنظام الليلي
                document.documentElement.style.setProperty('--shadow-color', 'rgba(2, 12, 27, 0.7)');
            }
        };
        
        if (effects[theme]) {
            effects[theme]();
        }
    }
    
    dispatchThemeChange() {
        // إرسال حدث مخصص يمكن للمكونات الأخرى الاستماع إليه
        const event = new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }
    
    addButtonStyles() {
        // إضافة أنماط ديناميكية للزر بناء على النظام
        const style = document.createElement('style');
        style.textContent = `
            [data-theme="light"] .theme-toggle {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
            }
            
            [data-theme="dark"] .theme-toggle {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                border: none;
            }
            
            [data-theme="night"] .theme-toggle {
                background: linear-gradient(135deg, #0f2027 0%, #203a43 100%);
                color: #64ffda;
                border: none;
            }
            
            .theme-toggle {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease !important;
            }
            
            .theme-toggle::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }
            
            .theme-toggle:active::after {
                width: 200px;
                height: 200px;
            }
            
            .theme-toggle:hover {
                transform: translateY(-2px) scale(1.05) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    addEnhancements() {
        // إضافة أنماط إضافية للواجهة
        const style = document.createElement('style');
        style.textContent = `
            /* تأثيرات انتقال سلسة */
            .chapter-card,
            .meta-item,
            .nav-btn,
            .primary-btn,
            .secondary-btn {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            /* تحسينات للنصوص في الأنظمة المختلفة */
            [data-theme="dark"] .text-content {
                color: #e0e0e0;
            }
            
            [data-theme="night"] .text-content {
                color: #e6f1ff;
            }
            
            /* تحسين التباين */
            [data-theme="dark"] a,
            [data-theme="night"] a {
                color: var(--accent-secondary);
            }
            
            [data-theme="dark"] a:hover,
            [data-theme="night"] a:hover {
                color: var(--accent-primary);
            }
            
            /* تأثيرات خاصة للقراءة */
            [data-theme="light"] .reading-tips {
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            }
            
            [data-theme="dark"] .reading-tips {
                background: linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%);
            }
            
            [data-theme="night"] .reading-tips {
                background: linear-gradient(135deg, #1a3a5f 0%, #112240 100%);
            }
        `;
        document.head.appendChild(style);
    }
    
    // وظائف مساعدة
    static getCurrentTheme() {
        return document.body.getAttribute('data-theme') || 'light';
    }
    
    static isDarkTheme() {
        const theme = this.getCurrentTheme();
        return theme === 'dark' || theme === 'night';
    }
    
    static getThemeInfo() {
        const theme = this.getCurrentTheme();
        const info = {
            'light': { name: 'فاتح', icon: '☀️', description: 'مناسب للقراءة النهارية' },
            'dark': { name: 'داكن', icon: '🌙', description: 'مريح للعين في الإضاءة المنخفضة' },
            'night': { name: 'ليلي', icon: '🌌', description: 'مثالي للقراءة الليلية' }
        };
        return info[theme] || info.light;
    }
}

// تهيئة نظام الألوان عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // تحديث عنوان الصفحة بناء على النظام
    function updatePageTitle() {
        const themeInfo = ThemeManager.getThemeInfo();
        document.title = `المارد الأعظم ${themeInfo.icon}`;
    }
    
    // تحديث عند تغيير النظام
    document.addEventListener('themechange', updatePageTitle);
    updatePageTitle();
    
    // إضافة تلميح بالنظام الحالي
    function showThemeHint() {
        if (!localStorage.getItem('themeHintShown')) {
            const themeInfo = ThemeManager.getThemeInfo();
            setTimeout(() => {
                const hint = document.createElement('div');
                hint.className = 'theme-hint';
                hint.innerHTML = `
                    <div class="hint-content">
                        <i class="fas fa-palette"></i>
                        <span>النظام الحالي: ${themeInfo.name} - ${themeInfo.description}</span>
                        <button onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                hint.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    padding: 10px 15px;
                    border-radius: var(--border-radius);
                    font-size: 14px;
                    color: var(--text-secondary);
                    z-index: 1000;
                    box-shadow: var(--shadow-base);
                    animation: slideInLeft 0.5s ease;
                `;
                
                document.body.appendChild(hint);
                
                // إخفاء التلميح بعد 5 ثواني
                setTimeout(() => {
                    if (hint.parentElement) {
                        hint.style.opacity = '0';
                        hint.style.transform = 'translateX(-20px)';
                        setTimeout(() => hint.remove(), 300);
                    }
                }, 5000);
                
                localStorage.setItem('themeHintShown', 'true');
            }, 1000);
        }
    }
    
    // استدعاء بعد ثانيتين
    setTimeout(showThemeHint, 2000);
});

// دعم التبديل من أي مكان
window.toggleTheme = function() {
    if (window.themeManager) {
        window.themeManager.nextTheme();
    }
};