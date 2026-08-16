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
    WA_PHONE: '966553108707',
    BRANCHES: [
        'الفرع الرئيسي',
        'السادة',
        'الأفق',
        'الرس',
        'المدينة المنورة'
    ],
    BRANCH_PHONES: {
        'الفرع الرئيسي': '966553108707',
        'السادة': '966553108707',
        'الأفق': '966553108707',
        'الرس': '966553108707',
        'المدينة المنورة': '966553108707'
    }
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
        icon.classList.toggle('hidden', !isDark);
    });
    moonIcons.forEach(function (icon) {
        icon.classList.toggle('hidden', isDark);
    });

    var activeThemeLabel = themeToggle ? themeToggle.closest('label') : null;
    if (activeThemeLabel) {
        var label = isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الليلي';
        activeThemeLabel.setAttribute('aria-label', label);
        activeThemeLabel.setAttribute('title', label);
    }
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
        'دجاج': ['#eaf2ff', '#1e40af'],
        'لحوم': ['#fef2f2', '#991b1b'],
        'بحريات': ['#eff6ff', '#1e3a8a'],
        'بطاطس ومقبلات': ['#fff7ed', '#9a3412'],
        'خضار وفواكه': ['#f0fdf4', '#166534'],
        'معجنات': ['#fff7ed', '#9a3412'],
        'حلويات': ['#fdf2f8', '#9d174d'],
        'مواد غذائية': ['#f8fafc', '#334155'],
        'مشروبات': ['#eff6ff', '#1e40af']
    };

    var color = colors[category] || ['#f8fafc', '#334155'];
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">' +
        '<rect width="600" height="450" fill="' + color[0] + '"/>' +
        '<text x="300" y="225" text-anchor="middle" dominant-baseline="middle" fill="' + color[1] + '" font-family="Tahoma,Arial" font-size="30" font-weight="700">' +
        String(name || 'صورة المنتج').replace(/[&<>]/g, '') + '</text></svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
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
    { id: 100, name: 'بيبسي دايت', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/بيبسي دايت كرتون.webp', stock: 10 },
    { id: 101, name: 'ماونتن ديو', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/ماونتن ديو كرتون.jpg', stock: 12 },
    { id: 102, name: 'حمضيات', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/حمضيات.jpg', stock: 8 },
    { id: 103, name: 'سفن دايت', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 55, image: 'images/extra/سفن دايت كرتون.jpg', stock: 0 },
    { id: 104, name: 'كينزا كولا', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 50, image: 'images/extra/كينزا كولا كرتون.webp', stock: 18 },
    { id: 105, name: 'كينزا ليمون', category: 'مشروبات', weight: 'كرتون 24 علبة (330 مل)', price: 50, image: 'images/extra/كينزا ليمون كرتون.png', stock: 0 },
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
var productsSection = document.getElementById('productsNew');
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

var categoryPriority = {
    'دجاج': 1,
    'لحوم': 2,
    'بحريات': 3,
    'بطاطس ومقبلات': 4,
    'خضار وفواكه': 5,
    'معجنات': 6,
    'حلويات': 7,
    'مواد غذائية': 8,
    'مشروبات': 9
};

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
function filterCategory(category, keepProductsNavActive) {
    currentCategory = category;

    document.querySelectorAll('.category-btn').forEach(function (button) {
        button.classList.remove('category-active');
        if (button.dataset.category === category) {
            button.classList.add('category-active');
        }
    });

    if (!keepProductsNavActive) updateNavLinks(null);
    applyFilters();
}

/* ربط أحداث النقر على روابط التنقل العلوي */
navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        updateNavLinks(null);
        link.classList.add('nav-link-active');

        if (link.dataset.category) {
            e.preventDefault();
            filterCategory(link.dataset.category, true);
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* أزرار الفئات في قسم الفلاتر */
document.querySelectorAll('.category-btn').forEach(function (button) {
    button.addEventListener('click', function () {
        filterCategory(button.dataset.category, false);
    });
});

applyFilters();
updateNavLinks(null);

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

    if (sort === 'default') {
        list.sort(function (a, b) {
            var availabilityDifference = Number(!a.stock) - Number(!b.stock);
            if (availabilityDifference !== 0) return availabilityDifference;

            var categoryDifference = (categoryPriority[a.category] || 99) - (categoryPriority[b.category] || 99);
            if (categoryDifference !== 0) return categoryDifference;

            return a.id - b.id;
        });
    }
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

    list.forEach(function (product, index) {
        var isOutOfStock = product.stock === 0 || product.stock === undefined;

        var card = document.createElement('div');
        card.className = 'product-card bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4';

        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-image-wrapper mb-4';

        var img = document.createElement('img');
        var originalImage = product.image || '';
        img.src = 'images/optimized/product-' + product.id + '.webp?v=20260816-5';
        img.alt = product.name || '';
        img.width = 600;
        img.height = 450;
        img.loading = index < 4 ? 'eager' : 'lazy';
        if (index < 4) img.fetchPriority = 'high';
        img.decoding = 'async';
        img.className = 'product-image w-full h-full rounded-xl';
        img.addEventListener('error', function handleImageError() {
            if (img.src.indexOf('/optimized/') !== -1 && originalImage) {
                img.src = originalImage;
                return;
            }
            img.removeEventListener('error', handleImageError);
            img.src = productImage(product.name, product.category);
        });
        imageWrapper.appendChild(img);

        var badge = document.createElement('span');
        badge.className = 'product-badge ' + (isOutOfStock ? 'badge-out-of-stock' : 'badge-in-stock');
        badge.textContent = isOutOfStock ? 'منتهية' : 'متوفر';
        imageWrapper.appendChild(badge);

        card.appendChild(imageWrapper);

        var categoryLabel = document.createElement('span');
        categoryLabel.className = 'inline-block text-xs font-bold bg-sage text-pine px-3 py-1 rounded-full mb-2';
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
        priceEl.className = 'product-price text-xl font-bold text-pine';
        priceEl.textContent = String(product.price);
        var currencyEl = document.createElement('span');
        currencyEl.className = 'text-sm text-gray-500';
        currencyEl.textContent = ' ريال';
        priceBox.appendChild(priceEl);
        priceBox.appendChild(currencyEl);
        priceRow.appendChild(priceBox);

        var addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'bg-gold text-white px-4 py-2 rounded-lg text-sm hover:bg-[#A91F26] transition-colors';
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
    var cleanById = {};
    raw.forEach(function (item) {
        if (!item || typeof item !== 'object') return;

        var id = Number(item.id);
        var product = validIds[id];
        if (!product) return;

        var qty = Math.floor(Number(item.qty));
        if (!qty || qty < 1) qty = 1;
        if (product.stock === 0) return;
        if (qty > product.stock) qty = product.stock;

        if (cleanById[product.id]) {
            cleanById[product.id].qty = Math.min(product.stock, cleanById[product.id].qty + qty);
            return;
        }

        var cleanItem = { id: product.id, qty: qty };
        cleanById[product.id] = cleanItem;
        clean.push(cleanItem);
    });

    return clean;
}

function loadStoredCart() {
    try {
        return JSON.parse(storageGet('cart') || '[]');
    } catch (error) {
        storageSet('cart', '[]');
        return [];
    }
}

var cart = sanitizeCart(loadStoredCart());

function saveCart() {
    storageSet('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var el = document.getElementById('cartCount');
    if (el) el.textContent = String(count);
    var button = document.getElementById('cartButton');
    if (button) {
        button.classList.toggle('cart-has-items', count > 0);
        button.setAttribute('aria-label', count > 0 ? 'السلة، تحتوي على ' + count + ' منتج' : 'السلة فارغة');
    }
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
    saveCart();

    if (cart.length === 0) {
        showToast('السلة فارغة');
        return;
    }

    renderCartDialog();
}

function changeCartQuantity(productId, change) {
    var item = cart.find(function (entry) { return entry.id === productId; });
    var product = products.find(function (entry) { return entry.id === productId; });
    if (!item || !product) return;

    item.qty = Math.max(1, Math.min(product.stock, item.qty + change));
    saveCart();
    renderCartDialog();
}

function removeFromCart(productId) {
    cart = cart.filter(function (item) { return item.id !== productId; });
    saveCart();

    if (cart.length === 0) {
        closeCartDialog();
        showToast('تم حذف جميع المنتجات من السلة');
        return;
    }

    renderCartDialog();
}

function closeCartDialog() {
    var dialog = document.getElementById('cartDialog');
    if (dialog) dialog.remove();
}

function normalizePhone(value) {
    return String(value || '').replace(/[^0-9+]/g, '').slice(0, 16);
}

function sanitizeMessageText(value, maxLength) {
    return String(value || '')
        .replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, ' ')
        .replace(/[\u202a-\u202e\u2066-\u2069]/g, '')
        .replace(/[*_~`]/g, '')
        .replace(/إجمالي\s+الطلب|تفاصيل\s+الطلب|بيانات\s+العميل/gi, '')
        .replace(/[•━=|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

function readOrderDetails() {
    var branchSelect = document.getElementById('cartBranchSelect');
    var nameInput = document.getElementById('customerName');
    var phoneInput = document.getElementById('customerPhone');
    var fulfillmentSelect = document.getElementById('fulfillmentMethod');
    var addressInput = document.getElementById('deliveryAddress');

    return {
        branch: branchSelect ? branchSelect.value : '',
        name: nameInput ? nameInput.value.trim() : '',
        phone: phoneInput ? normalizePhone(phoneInput.value) : '',
        fulfillment: fulfillmentSelect ? fulfillmentSelect.value : 'pickup',
        address: addressInput ? addressInput.value.trim() : ''
    };
}

function validateOrderDetails(details) {
    if (details.name.length < 2) return { message: 'اكتب اسم العميل', field: 'customerName' };
    var phoneDigits = details.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        return { message: 'اكتب رقم جوال صحيح', field: 'customerPhone' };
    }
    if (CONFIG.BRANCHES.indexOf(details.branch) === -1) {
        return { message: 'اختر الفرع أولًا', field: 'cartBranchSelect' };
    }
    if (details.fulfillment !== 'pickup' && details.fulfillment !== 'delivery') {
        return { message: 'اختر طريقة الاستلام', field: 'fulfillmentMethod' };
    }
    if (details.fulfillment === 'delivery' && details.address.length < 5) {
        return { message: 'اكتب عنوان التوصيل بوضوح', field: 'deliveryAddress' };
    }
    return null;
}

function saveOrderDetails(details) {
    storageSet('customerName', details.name);
    storageSet('customerPhone', details.phone);
    storageSet('preferredBranch', details.branch);
    storageSet('fulfillmentMethod', details.fulfillment);
    storageSet('deliveryAddress', details.address);
}

function cartTotal() {
    return cart.reduce(function (sum, item) {
        var product = products.find(function (entry) { return entry.id === item.id; });
        return product ? sum + (product.price * item.qty) : sum;
    }, 0);
}

function buildWhatsAppMessage(details) {
    var safeName = sanitizeMessageText(details.name, 60);
    var safePhone = normalizePhone(details.phone);
    var safeBranch = sanitizeMessageText(details.branch, 40);
    var safeAddress = sanitizeMessageText(details.address, 180);
    var msg = 'السلام عليكم ورحمة الله وبركاته\n\n';
    msg += '*طلب جديد | ركن العمارية*\n\n';
    msg += '*بيانات العميل*\n';
    msg += '• الاسم: ' + safeName + '\n';
    msg += '• الجوال: ' + safePhone + '\n';
    msg += '• الفرع: ' + safeBranch + '\n';
    msg += '• الاستلام: ' + (details.fulfillment === 'delivery' ? 'توصيل' : 'استلام من الفرع') + '\n';
    if (details.fulfillment === 'delivery') msg += '• العنوان: ' + safeAddress + '\n';
    msg += '\n━━━━━━━━━━━━\n';
    msg += '*تفاصيل الطلب*\n\n';
    var total = 0;

    cart.forEach(function (item, index) {
        var product = products.find(function (p) { return p.id === item.id; });
        if (!product) return;
        var lineTotal = product.price * item.qty;
        msg += (index + 1) + '. *' + sanitizeMessageText(product.name, 80) + '* — ' + sanitizeMessageText(product.weight, 40) + '\n';
        msg += '   ' + item.qty + ' × ' + product.price + ' ريال = *' + lineTotal + ' ريال*\n\n';
        total += lineTotal;
    });

    msg += '━━━━━━━━━━━━\n';
    msg += '*إجمالي الطلب: ' + total + ' ريال*\n\n';
    msg += '_الأسعار والتوفر تخضع لتأكيد الفرع._\n\n';
    msg += 'شكرًا لكم.';
    return msg;
}

function sendCartToWhatsApp(details) {
    window.open(getWhatsAppUrl(details), '_blank', 'noopener,noreferrer');
}

function getWhatsAppUrl(details) {
    var phone = CONFIG.BRANCH_PHONES[details.branch] || CONFIG.WA_PHONE;
    var msg = buildWhatsAppMessage(details);
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
}

function addReviewLine(container, label, value) {
    var row = document.createElement('div');
    row.className = 'order-review-line';
    var labelEl = document.createElement('span');
    labelEl.textContent = label;
    var valueEl = document.createElement('strong');
    valueEl.textContent = value;
    row.appendChild(labelEl);
    row.appendChild(valueEl);
    container.appendChild(row);
}

function renderOrderReview(details) {
    var dialog = document.getElementById('cartDialog');
    var panel = dialog ? dialog.querySelector('.cart-panel') : null;
    if (!panel) return;
    panel.textContent = '';

    var header = document.createElement('div');
    header.className = 'cart-panel-header';
    var title = document.createElement('h2');
    title.id = 'cartDialogTitle';
    title.textContent = 'تأكيد الطلب';
    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'cart-close';
    closeButton.setAttribute('aria-label', 'إغلاق السلة');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', closeCartDialog);
    header.appendChild(title);
    header.appendChild(closeButton);
    panel.appendChild(header);

    var review = document.createElement('div');
    review.className = 'order-review';
    var hint = document.createElement('p');
    hint.className = 'order-review-hint';
    hint.textContent = 'راجع البيانات قبل فتح واتساب.';
    review.appendChild(hint);
    addReviewLine(review, 'العميل', details.name);
    addReviewLine(review, 'الجوال', details.phone);
    addReviewLine(review, 'الفرع', details.branch);
    addReviewLine(review, 'الاستلام', details.fulfillment === 'delivery' ? 'توصيل' : 'استلام من الفرع');
    if (details.fulfillment === 'delivery') addReviewLine(review, 'العنوان', details.address);

    var itemsTitle = document.createElement('h3');
    itemsTitle.textContent = 'المنتجات';
    review.appendChild(itemsTitle);
    cart.forEach(function (item) {
        var product = products.find(function (entry) { return entry.id === item.id; });
        if (!product) return;
        addReviewLine(review, product.name, item.qty + ' × ' + product.price + ' ريال');
    });
    addReviewLine(review, 'الإجمالي', cartTotal() + ' ريال');
    panel.appendChild(review);

    var footer = document.createElement('div');
    footer.className = 'cart-panel-footer review-actions';
    var backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'cart-back';
    backButton.textContent = 'رجوع للتعديل';
    backButton.addEventListener('click', renderCartDialog);
    var confirmButton = document.createElement('a');
    confirmButton.className = 'cart-send';
    confirmButton.href = getWhatsAppUrl(details);
    confirmButton.target = '_blank';
    confirmButton.rel = 'noopener noreferrer';
    confirmButton.textContent = 'تأكيد وفتح واتساب';
    confirmButton.addEventListener('click', function () {
        cart = [];
        saveCart();
        closeCartDialog();
        showToast('تم فتح واتساب وإفراغ السلة');
    });
    footer.appendChild(backButton);
    footer.appendChild(confirmButton);
    panel.appendChild(footer);
    confirmButton.focus();
}

function reviewOrderBeforeSending() {
    var details = readOrderDetails();
    var error = validateOrderDetails(details);
    if (error) {
        showToast(error.message);
        var field = document.getElementById(error.field);
        if (field) field.focus();
        return;
    }
    saveOrderDetails(details);
    renderOrderReview(details);
}

function createCartField(labelText, control) {
    var field = document.createElement('div');
    field.className = 'cart-form-field';
    var label = document.createElement('label');
    label.setAttribute('for', control.id);
    label.textContent = labelText;
    field.appendChild(label);
    field.appendChild(control);
    return field;
}

function renderCartDialog() {
    closeCartDialog();

    var dialog = document.createElement('div');
    dialog.id = 'cartDialog';
    dialog.className = 'cart-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'cartDialogTitle');
    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) closeCartDialog();
    });
    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeCartDialog();
    });

    var panel = document.createElement('div');
    panel.className = 'cart-panel';

    var header = document.createElement('div');
    header.className = 'cart-panel-header';
    var title = document.createElement('h2');
    title.id = 'cartDialogTitle';
    title.textContent = 'راجع طلبك';
    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'cart-close';
    closeButton.setAttribute('aria-label', 'إغلاق السلة');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', closeCartDialog);
    header.appendChild(title);
    header.appendChild(closeButton);
    panel.appendChild(header);

    var items = document.createElement('div');
    items.className = 'cart-items';
    var total = 0;

    cart.forEach(function (item) {
        var product = products.find(function (entry) { return entry.id === item.id; });
        if (!product) return;
        total += product.price * item.qty;

        var row = document.createElement('div');
        row.className = 'cart-item';
        var details = document.createElement('div');
        details.className = 'cart-item-details';
        var name = document.createElement('strong');
        name.textContent = product.name;
        var price = document.createElement('span');
        price.textContent = product.price + ' ريال — ' + product.weight;
        details.appendChild(name);
        details.appendChild(price);

        var controls = document.createElement('div');
        controls.className = 'cart-item-controls';
        var increase = document.createElement('button');
        increase.type = 'button';
        increase.className = 'quantity-button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', 'زيادة كمية ' + product.name);
        increase.disabled = item.qty >= product.stock;
        increase.addEventListener('click', function () { changeCartQuantity(product.id, 1); });
        var quantity = document.createElement('span');
        quantity.className = 'quantity-value';
        quantity.textContent = String(item.qty);
        var decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.className = 'quantity-button';
        decrease.textContent = '−';
        decrease.setAttribute('aria-label', 'تقليل كمية ' + product.name);
        decrease.addEventListener('click', function () { changeCartQuantity(product.id, -1); });
        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'cart-remove';
        remove.textContent = 'حذف';
        remove.addEventListener('click', function () { removeFromCart(product.id); });
        controls.appendChild(increase);
        controls.appendChild(quantity);
        controls.appendChild(decrease);
        controls.appendChild(remove);
        row.appendChild(details);
        row.appendChild(controls);
        items.appendChild(row);
    });
    panel.appendChild(items);

    var customerSection = document.createElement('section');
    customerSection.className = 'cart-customer';
    var customerTitle = document.createElement('h3');
    customerTitle.textContent = 'بيانات الطلب';
    customerSection.appendChild(customerTitle);

    var customerName = document.createElement('input');
    customerName.id = 'customerName';
    customerName.type = 'text';
    customerName.autocomplete = 'name';
    customerName.maxLength = 60;
    customerName.placeholder = 'مثال: محمد أحمد';
    customerName.value = storageGet('customerName') || '';
    customerName.addEventListener('input', function () {
        storageSet('customerName', customerName.value);
    });
    customerSection.appendChild(createCartField('اسم العميل', customerName));

    var customerPhone = document.createElement('input');
    customerPhone.id = 'customerPhone';
    customerPhone.type = 'tel';
    customerPhone.inputMode = 'tel';
    customerPhone.autocomplete = 'tel';
    customerPhone.maxLength = 16;
    customerPhone.placeholder = '05xxxxxxxx';
    customerPhone.value = storageGet('customerPhone') || '';
    customerPhone.addEventListener('input', function () {
        customerPhone.value = normalizePhone(customerPhone.value);
        storageSet('customerPhone', customerPhone.value);
    });
    customerSection.appendChild(createCartField('رقم الجوال', customerPhone));

    var fulfillment = document.createElement('select');
    fulfillment.id = 'fulfillmentMethod';
    var pickupOption = document.createElement('option');
    pickupOption.value = 'pickup';
    pickupOption.textContent = 'استلام من الفرع';
    var deliveryOption = document.createElement('option');
    deliveryOption.value = 'delivery';
    deliveryOption.textContent = 'توصيل';
    fulfillment.appendChild(pickupOption);
    fulfillment.appendChild(deliveryOption);
    var savedFulfillment = storageGet('fulfillmentMethod');
    fulfillment.value = savedFulfillment === 'delivery' ? 'delivery' : 'pickup';
    customerSection.appendChild(createCartField('طريقة الاستلام', fulfillment));

    var deliveryAddress = document.createElement('textarea');
    deliveryAddress.id = 'deliveryAddress';
    deliveryAddress.rows = 2;
    deliveryAddress.maxLength = 180;
    deliveryAddress.placeholder = 'المدينة، الحي، الشارع وأقرب معلم';
    deliveryAddress.value = storageGet('deliveryAddress') || '';
    var addressField = createCartField('عنوان التوصيل', deliveryAddress);
    addressField.hidden = fulfillment.value !== 'delivery';
    fulfillment.addEventListener('change', function () {
        storageSet('fulfillmentMethod', fulfillment.value);
        addressField.hidden = fulfillment.value !== 'delivery';
        if (fulfillment.value === 'delivery') deliveryAddress.focus();
    });
    deliveryAddress.addEventListener('input', function () {
        storageSet('deliveryAddress', deliveryAddress.value);
    });
    customerSection.appendChild(addressField);
    panel.appendChild(customerSection);

    var branchField = document.createElement('div');
    branchField.className = 'cart-branch';
    var branchLabel = document.createElement('label');
    branchLabel.setAttribute('for', 'cartBranchSelect');
    branchLabel.textContent = 'اختر الفرع المطلوب';
    var branchSelect = document.createElement('select');
    branchSelect.id = 'cartBranchSelect';
    branchSelect.required = true;
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'حدد الفرع قبل إرسال الطلب';
    branchSelect.appendChild(placeholder);
    CONFIG.BRANCHES.forEach(function (branch) {
        var option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        branchSelect.appendChild(option);
    });
    var savedBranch = storageGet('preferredBranch');
    if (CONFIG.BRANCHES.indexOf(savedBranch) !== -1) branchSelect.value = savedBranch;
    var branchHint = document.createElement('small');
    branchHint.textContent = 'سيُكتب اسم الفرع داخل رسالة واتساب.';
    branchField.appendChild(branchLabel);
    branchField.appendChild(branchSelect);
    branchField.appendChild(branchHint);
    panel.appendChild(branchField);

    var footer = document.createElement('div');
    footer.className = 'cart-panel-footer';
    var totalLine = document.createElement('div');
    totalLine.className = 'cart-total';
    totalLine.textContent = 'المجموع: ' + total + ' ريال';
    var sendButton = document.createElement('button');
    sendButton.type = 'button';
    sendButton.className = 'cart-send';
    sendButton.textContent = 'مراجعة الطلب';
    branchSelect.addEventListener('change', function () {
        if (branchSelect.value) storageSet('preferredBranch', branchSelect.value);
    });
    sendButton.addEventListener('click', reviewOrderBeforeSending);
    footer.appendChild(totalLine);
    footer.appendChild(sendButton);
    panel.appendChild(footer);

    dialog.appendChild(panel);
    document.body.appendChild(dialog);
    closeButton.focus();
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
