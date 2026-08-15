/* =========================================================
   فحص أمني آلي ضد app.js (محلي فقط)
   يحاكي هجمات حقيقية ويقيس ما إذا كانت الدفاعات تصمد.
   ========================================================= */
'use strict';

var results = [];
var APP = window; /* app.js يعرّف الدوال على مستوى window */

function assert(name, cond) {
    results.push({ name: name, pass: !!cond });
}

function runTests() {
    results = [];

    /* ---------- 1) حقن XSS في حقل الاسم داخل السلة ---------- */
    var xssCart = APP.sanitizeCart([
        { id: 1, name: '<img src=x onerror=alert(1)>', price: 0, qty: 99 }
    ]);
    assert(
        '1) رفض حمولة XSS في الاسم، والكمية تُقيّد بالمخزون',
        xssCart.length === 1 &&
        xssCart[0].id === 1 &&
        xssCart[0].qty === 50 &&
        xssCart[0].name === undefined &&
        xssCart[0].price === undefined
    );

    /* ---------- 2) معرف منتج غير موجود ---------- */
    var unknown = APP.sanitizeCart([{ id: 99999, qty: 5 }, { id: 1, qty: 2 }]);
    assert(
        '2) معرف منتج غير معروف يُحذف من السلة',
        unknown.length === 1 && unknown[0].id === 1 && unknown[0].qty === 2
    );

    /* ---------- 3) كميات غير صالحة (0 / سالب / نص / كسر) ---------- */
    var badQty = APP.sanitizeCart([
        { id: 1, qty: 0 },
        { id: 1, qty: -3 },
        { id: 1, qty: 'abc' },
        { id: 1, qty: 7.9 }
    ]);
    assert(
        '3) كميات غير صالحة تُصحّح لعدد صحيح >= 1',
        badQty.length === 4 && badQty.every(function (i) {
            return i.qty >= 1 && Number.isInteger(i.qty);
        })
    );

    /* ---------- 4) منتج بمخزون صفر ---------- */
    var zeroStock = APP.sanitizeCart([{ id: 4, qty: 1 }]);
    assert(
        '4) منتج منتهٍ (مخزون 0) لا يبقى في السلة',
        zeroStock.length === 0
    );

    /* ---------- 5) addToCart يخزّن id/qty فقط (بلا حقول قابلة للحقن) ---------- */
    try { localStorage.removeItem('cart'); } catch (e) {}
    APP.cart = [];
    APP.addToCart(1);
    var c = APP.cart;
    assert(
        '5) السلة تخزّن id و qty فقط (لا name/price/image قابل للحقن)',
        c.length === 1 && c[0].id === 1 && c[0].qty === 1 &&
        !('name' in c[0]) && !('price' in c[0]) && !('image' in c[0])
    );

    /* ---------- 6) إضافة متكررة لا تتجاوز المخزون ---------- */
    APP.cart = [];
    for (var i = 0; i < 100; i++) APP.addToCart(1);
    var qty = APP.cart.length ? APP.cart[0].qty : 0;
    assert(
        '6) تكرار الإضافة لا يتجاوز المخزون (سقف 50)',
        qty === 50
    );

    /* ---------- 7) بناء البطاقات بلا حقن HTML ---------- */
    var grid = document.getElementById('productsGrid');
    assert(
        '7) لا `<script>` ولا `onerror` في DOM المبني',
        grid.innerHTML.indexOf('<script') === -1 && grid.innerHTML.indexOf('onerror') === -1
    );

    /* ---------- 8) رسالة الطلب تُبنى من بيانات موثوقة لا من مدخلات ---------- */
    var msg = buildOrderMessageForTest(APP.sanitizeCart([{ id: 1, name: '<script>x</script>', price: 999999, qty: 1 }]));
    assert(
        '8) رسالة الطلب تستخدم الاسم والسعر الحقيقيين (لا المخترقين)',
        msg.indexOf('<script>') === -1 && msg.indexOf('999999') === -1 && msg.indexOf('ستربس دجاج') !== -1 && msg.indexOf('18') !== -1
    );

    renderResults();
}

/* نسخة اختبار من منطق openCart بدون توجيه المتصفح */
function buildOrderMessageForTest(cleanCart) {
    var msg = 'السلام عليكم، طلباتي:\n\n';
    var total = 0;
    cleanCart.forEach(function (item) {
        var product = APP.products.find(function (p) { return p.id === item.id; });
        if (!product) return;
        msg += product.name + ' × ' + item.qty + ' = ' + (product.price * item.qty) + ' ريال\n';
        total += product.price * item.qty;
    });
    msg += '\nالمجموع: ' + total + ' ريال';
    return msg;
}

function renderResults() {
    var host = document.getElementById('testResults');
    var passed = results.filter(function (r) { return r.pass; }).length;

    var summary = document.createElement('div');
    summary.style.cssText = 'font-weight:bold; font-size:18px; margin-bottom:12px;';
    summary.textContent = 'النتيجة: ' + passed + ' / ' + results.length + ' اختبار نجح';

    var list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';

    results.forEach(function (r) {
        var li = document.createElement('li');
        li.style.cssText = 'padding:8px 10px; margin:4px 0; border-radius:6px; color:white;';
        li.style.background = r.pass ? '#15803d' : '#b91c1c';
        li.textContent = (r.pass ? 'PASS ✓ ' : 'FAIL ✗ ') + r.name;
        list.appendChild(li);
    });

    host.appendChild(summary);
    host.appendChild(list);
}

window.addEventListener('load', runTests);