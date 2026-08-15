/* =========================================================
   ركن العمارية - سكربت المتجر
   نسخة مُأمّنة: بلا innerHTML ديناميكي، بلا سكربتات مضمّنة،
   تحقق كامل من بيانات السلة المخزنة محلياً.
   ========================================================= */
'use strict';

/* =========================================================
   الإعدادات العامة
   ========================================================= */

var CONFIG = {
    WA_PHONE: '966553108707'
};

/* =========================================================
   تخزين آمن (حماية من خطأ الأمان في الملفات المحلية)
   ========================================================= */

function storageGet(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (e) {
        return null;
    }
}

function storageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
        /* تجاهل: التخزين غير متاح */
    }
}

/* =========================================================
   إدارة الوضع الليلي
   ========================================================= */

var themeToggle = document.getElementById('themeToggle');
var themeToggleMobile = document.getElementById('themeToggleMobile');
var htmlEl = document.documentElement;
var sunIcons = document.querySelectorAll('.sun-icon');
var moonIcons = document.querySelectorAll('.moon-icon');

function updateThemeIcons(isDark) {
    sunIcons.forEach(function (icon) {
        icon.classList.toggle('hidden', isDark);
    });
    moonIcons.forEach(function (icon) {
        icon.classList.toggle('hidden', !isDark);
    });
}

function updateTheme(isDark) {
    if (isDark) {
        htmlEl.classList.add('dark');
        storageSet('theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
        if (themeToggleMobile) themeToggleMobile.checked = true;
    } else {
        htmlEl.classList.remove('dark');
        storageSet('theme', 'light');
        if (themeToggle) themeToggle.checked = false;
        if (themeToggleMobile) themeToggleMobile.checked = false;
    }
    updateThemeIcons(isDark);
}

var savedTheme = storageGet('theme');
var isDark = savedTheme === 'dark';
updateTheme(isDark);

if (themeToggle) {
    themeToggle.addEventListener('change', function (event) {
        updateTheme(event.target.checked);
    });
}

if (themeToggleMobile) {
    themeToggleMobile.addEventListener('change', function (event) {
        updateTheme(event.target.checked);
    });
}

/* =========================================================
   الصور الافتراضية (خدمة خارجية احتياطية فقط)
   ========================================================= */

function productImage(name, category) {
    var colors = {
        'دجاج': 'eaf2ff/1e40af',
        'لحوم': 'fef2f2/991b1b',
        'بحريات': 'eff6ff/1e3a8a',
        'بطاطس ومقبلات': 'fff7ed/9a3412',
        'خضار وفواكه': 'f0fdf4/166534',
        'معجنات': 'fff7ed/9a3412',
        'حلويات': 'fdf2f8/9d174d',
        'مواد غذائية': 'f8fafc/334155',
        'مشروبات': 'eff6ff/1e40af'
    };

    var color = colors[category] || 'f8fafc/334155';
    return 'https://placehold.co/600x450/' + color + '?text=' + encodeURIComponent(name);
}

/* =========================================================
   المنتجات
   ========================================================= */

var products = [
    { id: 1, name: 'ستربس دجاج', category: 'دجاج', weight: '750 غرام', price: 18, image: 'images/chicken.jpg', stock: 50 },
    { id: 3, name: 'ناجتس دجاج', category: 'دجاج', weight: '1 كجم', price: 20, image: 'images/chicken-nuggets.jpg', stock: 30 },
    { id: 4, name: 'صدور دجاج', category: 'دجاج', weight: '2 كجم', price: 32, image: 'images/صدور دجاج.png', stock: 0 },
    { id: 12, name: 'دجاج مسحب', category: 'دجاج', weight: '1 كجم', price: 28, image: 'images/مسحب دجاج.webp', stock: 25 },
    { id: 15, name: 'لحم مفروم', category: 'لحوم', weight: '1 كجم', price: 31, image: 'images/لحم مفروم.webp', stock: 40 },
    { id: 21, name: 'سجق بقري', category: 'لحوم', weight: '1 كجم', price: 35, image: 'images/سجق بقري.jpg', stock: 20 },
    { id: 50, name: 'كباب دجاج', category: 'دجاج', weight: '1 كجم', price: 26, image: 'images/altkzeen/كفتة دجاج الكبير 300 غرام.jpg', stock: 15 },
    { id: 51, name: 'سجق دجاج', category: 'دجاج', weight: '1 كجم', price: 20, image: 'images/altkzeen/نقانق دجاج داري 340 غرام 3 حبات.jpg', stock: 0 },
    { id: 52, name: 'شاورما دجاج', category: 'دجاج', weight: '1 كجم', price: 22, image: 'images/altkzeen/شاورما دجاج سيارا 600 غرام.jpg', stock: 18 },
    { id: 53, name: 'لحم غنم مفروم', category: 'لحوم', weight: '1 كجم', price: 45, image: 'images/altkzeen/مفروم غنم ممتاز امريكانا 400غرام.jpg', stock: 12 },
    { id: 56, name: 'كباب لحم', category: 'لحوم', weight: '1 كجم', price: 35, image: 'images/altkzeen/شيش كباب لحم بقري الكبير 320 غرام.jpg', stock: 10 },
    { id: 61, name: 'جمبري بقشره', category: 'بحريات', weight: '1 كجم', price: 50, image: 'images/altkzeen/روبيان الكبير 400 غرام.jpg', stock: 8 },
    { id: 68, name: 'فلافل', category: 'بطاطس ومقبلات', weight: '1 كجم', price: 12, image: 'images/altkzeen/فلافل الكبير 1 كيلو.jpg', stock: 35 },
    { id: 69, name: 'خضار مشكلة', category: 'خضار وفواكه', weight: '1 كجم', price: 7, image: 'images/altkzeen/خضار مشكلة الكبير 400 غرام.jpg', stock: 50 },
    { id: 70, name: 'فاصوليا خضراء', category: 'خضار وفواكه', weight: '1 كجم', price: 9, image: 'images/extra/فاصوليا خضراء.jpg', stock: 30 },
    { id: 71, name: 'بروكلي', category: 'خضار وفواكه', weight: '1 كجم', price: 14, image: 'images/extra/بروكلي-سنبلة.jpg', stock: 22 },
    { id: 73, name: 'فراولة مجمدة', category: 'خضار وفواكه', weight: '500 غرام', price: 12, image: 'images/altkzeen/فراولة الكبير 900 غرام.jpg', stock: 0 },
    { id: 74, name: 'مانجو', category: 'خضار وفواكه', weight: '500 غرام', price: 14, image: 'images/altkzeen/لب مانجو مونتانا 1000 غرام.jpg', stock: 15 },
    { id: 81, name: 'زيت دوار الشمس', category: 'مواد غذائية', weight: '1.5 لتر', price: 14, image: 'images/extra/زيت دوار الشمس.jpg', stock: 60 },
    { id: 82, name: 'طحين أبيض', category: 'مواد غذائية', weight: '5 كجم', price: 12, image: 'images/extra/طحين أبيض.jpg', stock: 40 },
    { id: 85, name: 'عدس', category: 'مواد غذائية', weight: '1 كجم', price: 7, image: 'images/extra/عدس-زين.jpg', stock: 50 },
    { id: 86, name: 'حمص', category: 'مواد غذائية', weight: '1 كجم', price: 8, image: 'images/extra/حمص.jpg', stock: 45 },
    { id: 87, name: 'تونة', category: 'مواد غذائية', weight: '185 غرام', price: 7, image: 'images/extra/تونة.jpg', stock: 80 },
    { id: 88, name: 'حليب مجفف', category: 'مواد غذائية', weight: '2.5 كجم', price: 45, image: 'images/extra/حليب مجفف.jpg', stock: 25 },
    { id: 89, name: 'جبن شرائح', category: 'مواد غذائية', weight: '400 غرام', price: 10, image: 'images/extra/جبن شرائح.jpg', stock: 0 },
    { id: 90, name: 'مايونيز', category: 'مواد غذائية', weight: '500 غرام', price: 12, image: 'images/extra/مايونيز.jpg', stock: 30 },
    { id: 98, name: 'بيبسي', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/بيبسي.jpg', stock: 20 },
    { id: 99, name: 'سفن أب', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/سفن أب.jpg', stock: 15 },
    { id: 100, name: 'بيبسي دايت', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/بيبسي دايت.jpg', stock: 10 },
    { id: 101, name: 'ماونتن ديو', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/ماونتن ديو.jpg', stock: 12 },
    { id: 102, name: 'حمضيات', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/حمضيات.jpg', stock: 8 },
    { id: 103, name: 'سفن دايت', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/سفن دايت.jpg', stock: 0 },
    { id: 104, name: 'كينزا كولا', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 50, image: 'images/extra/كينزا كولا.jpg', stock: 18 },
    { id: 105, name: 'كينزا ليمون', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 50, image: 'images/extra/كينزا ليمون.jpg', stock: 0 },
    { id: 115, name: 'دجاج مجمد كامل', category: 'دجاج', weight: '1 كجم', price: 18, image: 'images/altkzeen/دجاج مجمد الوطنية 1000 غرام.jpg', stock: 30 },
    { id: 116, name: 'دجاج مفروم', category: 'دجاج', weight: '400 غرام', price: 14, image: 'images/altkzeen/دجاج مفروم مجمد رضوي 400 غرام.jpg', stock: 20 },
    { id: 119, name: 'فيليه دجاج بقسماط', category: 'دجاج', weight: '750 غرام', price: 28, image: 'images/altkzeen/فيلية دجاج بقسماط الكبير 750 غرام.jpg', stock: 12 },
    { id: 122, name: 'برجر لحم بقري', category: 'لحوم', weight: '452 غرام', price: 22, image: 'images/altkzeen/امريكانا برجر لحم بقري كيراف 452 غرام.jpg', stock: 15 },
    { id: 124, name: 'كرات لحم بقري', category: 'لحوم', weight: '450 غرام', price: 20, image: 'images/altkzeen/كرات لحم بقري سيارا 450 غرام.jpg', stock: 18 },
    { id: 125, name: 'كباب غنم', category: 'لحوم', weight: '320 غرام', price: 24, image: 'images/altkzeen/كباب غنم رويال امريكانا 320 غرام.jpg', stock: 12 },
    { id: 127, name: 'همبرجر جامبو بقري', category: 'لحوم', weight: '1 كجم', price: 38, image: 'images/altkzeen/همبرجر جامبو بقري امريكانا 1كيلو.jpg', stock: 10 },
    { id: 129, name: 'روبيان مطبوخ', category: 'بحريات', weight: '400 غرام', price: 26, image: 'images/altkzeen/روبيان مجمد مطبوخ رويال 400 غرام.jpg', stock: 12 },
    { id: 132, name: 'سمك فيليه زينج حار', category: 'بحريات', weight: '750 غرام', price: 28, image: 'images/altkzeen/سمك فيليه زينج حار الكبير 750 غرام.jpg', stock: 12 },
    { id: 134, name: 'حلقات البصل', category: 'بطاطس ومقبلات', weight: '1 كجم', price: 12, image: 'images/altkzeen/السنبلة حلقات البصل 1 كيلو.jpg', stock: 25 },
    { id: 136, name: 'بطاطس مقلية امريكانا', category: 'بطاطس ومقبلات', weight: '2.5 كجم', price: 14, image: 'images/altkzeen/بطاطس مقلية امريكانا 2.5 كيلو.jpg', stock: 28 },
    { id: 137, name: 'اصابع جبنة موزريلا', category: 'بطاطس ومقبلات', weight: '250 غرام', price: 13, image: 'images/altkzeen/اصابع جبنة موزريلا الكبير 250 غرام.jpg', stock: 20 },
    { id: 138, name: 'ويدجز البطاطس', category: 'بطاطس ومقبلات', weight: '2.5 كجم', price: 15, image: 'images/altkzeen/لامب ستون بطاطس ويدجز 2.5 كيلو.jpg', stock: 18 },
    { id: 140, name: 'ذرة حلوة', category: 'خضار وفواكه', weight: '840 غرام', price: 8, image: 'images/altkzeen/السنبلة ذرة حلوة 840 غرام.jpg', stock: 25 },
    { id: 141, name: 'بازلاء خضراء', category: 'خضار وفواكه', weight: '400 غرام', price: 7, image: 'images/altkzeen/بازلاء خضراء الكبير 400 غرام.jpg', stock: 30 },
    { id: 142, name: 'بامية', category: 'خضار وفواكه', weight: '400 غرام', price: 9, image: 'images/altkzeen/بامية فاين حياة 400 غرام 4 حبات.jpg', stock: 20 },
    { id: 146, name: 'سبانخ مجمدة', category: 'خضار وفواكه', weight: '400 غرام', price: 6, image: 'images/altkzeen/سبانخ حياة 400 غرام 3 حبات.jpg', stock: 25 },
    { id: 147, name: 'ملوخية مجمدة', category: 'خضار وفواكه', weight: '400 غرام', price: 7, image: 'images/altkzeen/ملوخية رويال 400 غرام.jpg', stock: 25 },
    { id: 149, name: 'قطع أناناس', category: 'خضار وفواكه', weight: '400 غرام', price: 12, image: 'images/extra/اناناس-علبة.jpg', stock: 15 },
    { id: 154, name: 'خبز تورتيلا', category: 'معجنات', weight: '570 غرام', price: 10, image: 'images/altkzeen/لفائف تورتيلا سادة الكبير 570 غرام.jpg', stock: 18 },
    { id: 155, name: 'سبرينج رول', category: 'معجنات', weight: '160 غرام', price: 7, image: 'images/altkzeen/السنبلة رقائق السبرينج رول السنبلة 160 غرام.jpg', stock: 20 },
    { id: 156, name: 'عجينة كنافة', category: 'حلويات', weight: '500 غرام', price: 14, image: 'images/altkzeen/عجينة كنافة السنبلة 500 غرام.jpg', stock: 15 },
    { id: 157, name: 'عجينة بقلاوة', category: 'حلويات', weight: '500 غرام', price: 10, image: 'images/altkzeen/رقائق عجينة البقلاوة السنبلة 500 غرام.jpg', stock: 15 },
    { id: 159, name: 'جبن موزاريلا مبشور', category: 'مواد غذائية', weight: '500 غرام', price: 22, image: 'images/altkzeen/جبن موزاريلا مبشور فرسانا 500 غرام.jpg', stock: 15 },
    { id: 160, name: 'زبدة بلوريفر', category: 'مواد غذائية', weight: '100 غرام', price: 8, image: 'images/altkzeen/زبدة بلوريفر فرسانا 100 غرام.jpg', stock: 25 },
    { id: 161, name: 'زبدة فالي', category: 'مواد غذائية', weight: '2.5 كجم', price: 45, image: 'images/altkzeen/زبدة فالي فرسانا 2.5 كيلو.jpg', stock: 10 }
];

/* إضافة صورة افتراضية إذا لم توجد */
products.forEach(function (product) {
    if (!product.image) {
        product.image = productImage(product.name, product.category);
    }
});

/* =========================================================
   عناصر الصفحة
   ========================================================= */

var productsGrid = document.getElementById('productsGrid');
var searchInput = document.getElementById('searchInput');
var categories = document.getElementById('categories');
var resultCount = document.getElementById('resultCount');
var noResults = document.getElementById('noResults');
var sortSelect = document.getElementById('sortSelect');
var navLinks = document.querySelectorAll('.nav-menu .nav-link');

var currentCategory = 'الكل';

var categoryList = [
    'دجاج', 'لحوم', 'بحريات', 'بطاطس ومقبلات', 'خضار وفواكه',
    'معجنات', 'حلويات', 'مواد غذائية', 'مشروبات'
];

/* تحديث حالة الروابط في القائمة العلوية */
function updateNavLinks(category) {
    navLinks.forEach(function (link) {
        if (link.dataset.category === category) {
            link.classList.add('nav-link-active');
        } else {
            link.classList.remove('nav-link-active');
        }
    });
}

/* تصفية حسب الفئة (بمقارنة مباشرة، بلا إنشاء محددات من قيم) */
function filterCategory(category) {
    currentCategory = category;

    document.querySelectorAll('.category-btn').forEach(function (button) {
        button.classList.remove('category-active');
        if (button.dataset.category === category) {
            button.classList.add('category-active');
        }
    });

    updateNavLinks(category);
    applyFilters();
}

/* ربط أحداث النقر على روابط التنقل العلوي */
navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        filterCategory(link.dataset.category);
        productsGrid.scrollIntoView({ behavior: 'smooth' });
    });
});

/* زر "الكل" في قسم الفلاتر */
var categoryAllBtn = document.querySelector('.category-btn[data-category="الكل"]');
if (categoryAllBtn) {
    categoryAllBtn.addEventListener('click', function () {
        filterCategory('الكل');
    });
}

applyFilters();
updateNavLinks('الكل');

/* =========================================================
   البحث والتصفية
   ========================================================= */

function applyFilters() {
    var search = searchInput.value.trim().toLowerCase();

    var filtered = products.filter(function (product) {
        var matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        var matchesCategory =
            currentCategory === 'الكل' ||
            product.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    sortProducts(filtered);
}

/* =========================================================
   ترتيب المنتجات
   ========================================================= */

function sortProducts(list) {
    var sort = sortSelect.value;

    if (sort === 'name') {
        list.sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
    }
    if (sort === 'priceLow') {
        list.sort(function (a, b) { return a.price - b.price; });
    }
    if (sort === 'priceHigh') {
        list.sort(function (a, b) { return b.price - a.price; });
    }

    renderProducts(list);
}

/* =========================================================
   عرض المنتجات - بناء آمن عبر DOM APIs
   (بدون innerHTML حتى لا يسمح بحقن HTML/JS مستقبلاً)
   ========================================================= */

function renderProducts(list) {
    productsGrid.textContent = '';
    resultCount.textContent = 'عرض ' + list.length + ' من ' + products.length + ' منتج';

    if (list.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    list.forEach(function (product) {
        var isOutOfStock = product.stock === 0 || product.stock === undefined;

        var card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4';

        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-image-wrapper mb-4';

        var img = document.createElement('img');
        img.src = product.image || '';
        img.alt = product.name || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.className = 'product-image w-full h-full rounded-xl';
        imageWrapper.appendChild(img);

        if (isOutOfStock) {
            var badge = document.createElement('span');
            badge.className = 'product-badge badge-out-of-stock';
            badge.textContent = 'منتهية';
            imageWrapper.appendChild(badge);
        }

        card.appendChild(imageWrapper);

        var categoryLabel = document.createElement('span');
        categoryLabel.className = 'inline-block text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-2';
        categoryLabel.textContent = product.category || '';
        card.appendChild(categoryLabel);

        var nameEl = document.createElement('h3');
        nameEl.className = 'font-bold text-lg mb-2';
        nameEl.textContent = product.name || '';
        card.appendChild(nameEl);

        var weightEl = document.createElement('p');
        weightEl.className = 'text-gray-500 text-sm mb-3';
        weightEl.textContent = product.weight || '';
        card.appendChild(weightEl);

        var priceRow = document.createElement('div');
        priceRow.className = 'flex justify-between items-center';

        var priceBox = document.createElement('div');
        var priceEl = document.createElement('span');
        priceEl.className = 'text-xl font-bold text-blue-700';
        priceEl.textContent = String(product.price);
        var currencyEl = document.createElement('span');
        currencyEl.className = 'text-sm text-gray-500';
        currencyEl.textContent = ' ريال';
        priceBox.appendChild(priceEl);
        priceBox.appendChild(currencyEl);
        priceRow.appendChild(priceBox);

        var addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors';
        addBtn.textContent = isOutOfStock ? 'منتهية' : 'أضف للسلة';

        if (isOutOfStock) {
            addBtn.disabled = true;
            addBtn.className += ' opacity-50 cursor-not-allowed';
        } else {
            addBtn.addEventListener('click', function () {
                addToCart(product.id);
            });
        }

        priceRow.appendChild(addBtn);
        card.appendChild(priceRow);

        productsGrid.appendChild(card);
    });
}

/* =========================================================
   زر الطلب عبر واتساب
   ========================================================= */

function contactProduct(name) {
    var message = encodeURIComponent('السلام عليكم، أرغب بطلب: ' + name);
    window.open('https://wa.me/' + CONFIG.WA_PHONE + '?text=' + message, '_blank');
}

/* =========================================================
   سلة المشتريات (بسيطة) - مع تحقق كامل من البيانات
   ========================================================= */

function sanitizeCart(raw) {
    if (!Array.isArray(raw)) return [];

    var validIds = {};
    products.forEach(function (p) { validIds[p.id] = p; });

    var clean = [];
    raw.forEach(function (item) {
        if (!item || typeof item !== 'object') return;

        var id = Number(item.id);
        var product = validIds[id];
        if (!product) return;

        var qty = Math.floor(Number(item.qty));
        if (!qty || qty < 1) qty = 1;
        if (product.stock === 0) return;
        if (qty > product.stock) qty = product.stock;

        clean.push({ id: product.id, qty: qty });
    });

    return clean;
}

var cart = sanitizeCart(JSON.parse(storageGet('cart') || '[]'));

function saveCart() {
    storageSet('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var el = document.getElementById('cartCount');
    if (el) el.textContent = String(count);
}

function addToCart(productId) {
    var product = products.find(function (p) { return p.id === productId; });
    if (!product) return;
    if (product.stock === 0) return;

    var existing = cart.find(function (item) { return item.id === productId; });

    if (existing) {
        if (existing.qty < product.stock) {
            existing.qty++;
        }
    } else {
        cart.push({ id: productId, qty: 1 });
    }

    saveCart();
    showToast('تم إضافة المنتج للسلة');
}

function openCart() {
    cart = sanitizeCart(cart);

    if (cart.length === 0) {
        showToast('السلة فارغة');
        return;
    }

    var msg = 'السلام عليكم، طلباتي:\n\n';
    var total = 0;

    cart.forEach(function (item) {
        var product = products.find(function (p) { return p.id === item.id; });
        if (!product) return;
        msg += product.name + ' × ' + item.qty + ' = ' + (product.price * item.qty) + ' ريال\n';
        total += product.price * item.qty;
    });

    msg += '\nالمجموع: ' + total + ' ريال';

    window.location.href = 'https://wa.me/' + CONFIG.WA_PHONE + '?text=' + encodeURIComponent(msg);
}

var cartButton = document.getElementById('cartButton');
if (cartButton) {
    cartButton.addEventListener('click', openCart);
}

function showToast(msg) {
    var toast = document.createElement('div');
    toast.textContent = msg;
    toast.className = 'fixed bottom-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2500);
}

updateCartCount();

/* =========================================================
   البحث والترتيب
   ========================================================= */

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);

/* =========================================================
   إخفاء الهيدر عند السكرول للأسفل (الجوال فقط)
   ========================================================= */

(function () {
    var header = document.querySelector('.store-header');
    if (!header) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
        var y = window.scrollY;

        if (y > 120 && y > lastY) {
            header.classList.add('header-hidden');
        } else if (y < lastY) {
            header.classList.remove('header-hidden');
        }

        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (window.innerWidth > 1023) {
            header.classList.remove('header-hidden');
            return;
        }

        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
})();

/* =========================================================
   التشغيل الأول
   ========================================================= */

renderProducts(products);