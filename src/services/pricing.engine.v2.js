/**
 * pricing.engine.v2.js — محرك التسعير الكامل
 *
 * يُجيب على سؤال واحد بدقة:
 *   "ما الحد الأقصى الذي نستطيع دفعه للمورد (CJ/AliExpress)
 *    مقابل صندوق بسعر X، بعد حساب الربح والإحالة والمطورين؟"
 *
 * ─────────────────────────────────────────────────────────────
 * تفكيك سعر الصندوق:
 *
 *  boxPrice
 *  ├── supplierCost        ← ندفعه لـCJ/AliExpress
 *  ├── estimatedShipping   ← شحن للعميل
 *  ├── paymentFee          ← 2.9% + $0.30 (Stripe/Binance)
 *  ├── referralCommission  ← % للمُحيل (حسب الـtier)
 *  ├── developerFee        ← % إذا جاء الطلب عبر API مطور
 *  ├── csReserve           ← احتياطي خدمة عملاء وإرجاع
 *  └── profit              ← ما يتبقى للشركة ✅
 *
 * ─────────────────────────────────────────────────────────────
 * الفرق الجوهري عن pricing.engine.js القديم:
 *   القديم: يقارن marketValue بـboxPrice
 *   الجديد: يحسب maxSupplierCost ← يُستخدم لفلترة CJ/AliExpress
 *
 *   marketValue = سعر المنتج على Amazon (للشفافية مع المستخدم)
 *   supplierCost = ما ندفعه للمورد (للربحية الداخلية)
 */

// ══════════════════════════════════════════════════════════════════════════════
// الإعدادات الافتراضية — تُعدَّل من .env أو من لوحة الأدمن
// ══════════════════════════════════════════════════════════════════════════════
const DEFAULTS = {
  // هامش الربح الصافي المستهدف (بعد كل التكاليف)
  targetProfitPct:    0.22,   // 22%

  // رسوم بوابة الدفع (Stripe: 2.9% + 0.30, Binance: ~0.5%)
  paymentPct:         0.029,
  paymentFlat:        0.30,

  // عمولة الإحالة — حسب tier المُحيل
  referralTiers: {
    bronze:  0.05,   // 5%
    silver:  0.08,   // 8%
    gold:    0.10,   // 10%
    diamond: 0.12,   // 12%
  },
  // في حسابات التسعير نستخدم المتوسط المتوقع
  avgReferralPct: 0.08,    // 8% متوسط
  noReferralPct:  0.35,    // 35% من المبيعات بلا إحالة

  // رسوم المطورين (API external developers)
  developerFeePct:  0.05,   // 5% إذا جاء الطلب من API مطور
  devApiSharePct:   0.20,   // 20% من المبيعات تأتي عبر API مطورين

  // احتياطي خدمة عملاء + إرجاع
  csReservePct:    0.03,    // 3%
  returnReservePct:0.02,    // 2% احتياطي إرجاع

  // الشحن الافتراضي إذا لم يُحدَّد
  defaultShipping: 0.90,
};

// ══════════════════════════════════════════════════════════════════════════════
// الدالة الرئيسية: تفكيك سعر الصندوق
// ══════════════════════════════════════════════════════════════════════════════

/**
 * يُحلِّل سعر الصندوق ويحسب كل مكوّن
 *
 * @param {number} boxPrice     - سعر الصندوق للمستخدم
 * @param {number} shipping     - تكلفة الشحن
 * @param {object} overrides    - لتغيير أي إعداد افتراضي
 * @returns {BoxBreakdown}
 */
function breakdown(boxPrice, shipping = DEFAULTS.defaultShipping, overrides = {}) {
  const cfg = { ...DEFAULTS, ...overrides };

  // 1. رسوم الدفع (ثابتة + نسبة)
  const paymentFee = +(boxPrice * cfg.paymentPct + cfg.paymentFlat).toFixed(4);

  // 2. عمولة الإحالة المتوقعة (مزيج: بعض المبيعات بإحالة، بعضها بلا)
  const referralCost = +(boxPrice * (1 - cfg.noReferralPct) * cfg.avgReferralPct).toFixed(4);

  // 3. رسوم المطورين المتوقعة
  const devCost = +(boxPrice * cfg.devApiSharePct * cfg.developerFeePct).toFixed(4);

  // 4. احتياطي خدمة عملاء + إرجاع
  const csReserve = +(boxPrice * (cfg.csReservePct + cfg.returnReservePct)).toFixed(4);

  // 5. الربح المستهدف
  const targetProfit = +(boxPrice * cfg.targetProfitPct).toFixed(4);

  // 6. ما يتبقى للمورد + شحن
  const totalDeductions = paymentFee + referralCost + devCost + csReserve + targetProfit;
  const budgetForGoods  = +(boxPrice - totalDeductions).toFixed(4);
  const maxSupplierCost = +(budgetForGoods - shipping).toFixed(4);
  const minSupplierCost = +(maxSupplierCost * 0.65).toFixed(4);

  return {
    boxPrice,
    supplierBudget:  +budgetForGoods.toFixed(2),
    shipping:        +shipping.toFixed(2),
    paymentFee:      +paymentFee.toFixed(2),
    referralCost:    +referralCost.toFixed(2),
    devCost:         +devCost.toFixed(2),
    csReserve:       +csReserve.toFixed(2),
    targetProfit:    +targetProfit.toFixed(2),
    maxSupplierCost: +maxSupplierCost.toFixed(2),
    minSupplierCost: +Math.max(0.50, minSupplierCost).toFixed(2),
    profitPct:       +(cfg.targetProfitPct * 100).toFixed(1),
    totalCostPct:    +(totalDeductions / boxPrice * 100).toFixed(1),
  };
}

/**
 * يُنتج نطاق supplierCost لفلترة منتجات CJ/AliExpress
 */
function catalogFilter(boxPrice, shipping = DEFAULTS.defaultShipping, overrides = {}) {
  const b = breakdown(boxPrice, shipping, overrides);
  return {
    priceMin:        b.minSupplierCost,
    priceMax:        b.maxSupplierCost,
    budgetForGoods:  b.supplierBudget,
    breakdown:       b,
  };
}

/**
 * حساب أسعار الصناديق الأربعة
 */
function buildBoxPricing() {
  const boxes = [
    { name: 'Trial Box',            price: 1.00,  shipping: 0.00, digital: true  },
    { name: 'Daily Tech Box',       price: 6.99,  shipping: 0.90 },
    { name: 'Study & Creativity',   price: 5.49,  shipping: 0.90 },
    { name: 'Golden Box',           price: 49.99, shipping: 2.50 },
  ];

  return boxes.map(b => ({
    name:     b.name,
    price:    b.price,
    digital:  b.digital || false,
    ...breakdown(b.price, b.shipping),
    catalogFilter: b.digital ? null : catalogFilter(b.price, b.shipping),
  }));
}

/**
 * هل تكلفة هذا المنتج تنسجم مع ميزانية الصندوق؟
 */
function validateProductCost(supplierCost, boxPrice, shipping = DEFAULTS.defaultShipping) {
  const f = catalogFilter(boxPrice, shipping);
  const valid = supplierCost >= f.priceMin && supplierCost <= f.priceMax;
  return {
    valid,
    supplierCost: +supplierCost.toFixed(2),
    range: { min: f.priceMin, max: f.priceMax },
    reason: valid
      ? `✅ ضمن الميزانية ($${f.priceMin}–$${f.priceMax})`
      : supplierCost > f.priceMax
        ? `❌ تكلفة المورد $${supplierCost} > الحد $${f.priceMax}`
        : `⚠️ تكلفة المورد $${supplierCost} < الحد الأدنى $${f.priceMin}`,
  };
}

/**
 * يتحقق من أن marketValue المُعروضة للمستخدم معقولة
 */
function validateMarketValue(marketValue, boxPrice) {
  const minV = boxPrice * 0.90;
  const maxV = boxPrice * 2.50;
  return {
    valid: marketValue >= minV && marketValue <= maxV,
    range: { min: +minV.toFixed(2), max: +maxV.toFixed(2) },
    ratio: +(marketValue / boxPrice).toFixed(2),
  };
}

module.exports = {
  breakdown,
  catalogFilter,
  buildBoxPricing,
  validateProductCost,
  validateMarketValue,
  printFullReport,
  DEFAULTS,
};
