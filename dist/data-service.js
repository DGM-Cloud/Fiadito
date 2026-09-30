const STORAGE_KEY = "fiadito-demo-v1";

export const categories = ["Todos", "Bebidas", "Abarrotes", "Snacks", "Lácteos", "Limpieza"];

export const seedUsers = [
  { id: "u-admin", name: "Carlos", role: "admin", roleLabel: "Administrador", pin: "1234", active: true },
  { id: "u-seller", name: "Rosa", role: "seller", roleLabel: "Vendedora", pin: "2468", active: true }
];

export const seedProducts = [
  { id: "p1", barcode: "7750243052337", name: "Gaseosa Inca Kola", short: "Inca Kola", category: "Bebidas", price: 3.5, stock: 18, minStock: 6, unit: "Botella 500 ml", emoji: "🥤", color: "#f4b63d" },
  { id: "p2", name: "Leche Gloria", short: "Leche Gloria", category: "Lácteos", price: 4.5, stock: 4, minStock: 6, unit: "Lata 400 g", emoji: "🥛", color: "#5f91cd" },
  { id: "p3", barcode: "7751271026000", name: "Chocolate Sublime", short: "Sublime", category: "Snacks", price: 2, stock: 23, minStock: 8, unit: "Unidad", emoji: "🍫", color: "#76513c" },
  { id: "p4", name: "Arroz Costeño", short: "Arroz Costeño", category: "Abarrotes", price: 5.2, stock: 10, minStock: 5, unit: "Bolsa 1 kg", emoji: "🍚", color: "#d6a959" },
  { id: "p5", name: "Aceite Primor", short: "Aceite Primor", category: "Abarrotes", price: 9.9, stock: 2, minStock: 4, unit: "Botella 900 ml", emoji: "🫗", color: "#ef9e32" },
  { id: "p6", barcode: "7751271001014", name: "Galleta Casino", short: "Galleta Casino", category: "Snacks", price: 1.5, stock: 30, minStock: 10, unit: "Paquete", emoji: "🍪", color: "#d87352" },
  { id: "p7", name: "Agua San Luis", short: "Agua San Luis", category: "Bebidas", price: 2, stock: 16, minStock: 6, unit: "Botella 625 ml", emoji: "💧", color: "#5ca8bd" },
  { id: "p8", name: "Detergente Bolívar", short: "Detergente", category: "Limpieza", price: 3.8, stock: 0, minStock: 5, unit: "Bolsa 260 g", emoji: "🫧", color: "#658ac7" },
  { id: "p9", name: "Atún Florida", short: "Atún Florida", category: "Abarrotes", price: 5.5, stock: 7, minStock: 5, unit: "Lata 170 g", emoji: "🐟", color: "#3d8c9e" },
  { id: "p10", name: "Yogurt Gloria", short: "Yogurt Gloria", category: "Lácteos", price: 6.9, stock: 3, minStock: 5, unit: "Botella 1 kg", emoji: "🥣", color: "#d66e8d" },
  { id: "p11", name: "Papel higiénico Elite", short: "Papel Elite", category: "Limpieza", price: 8.5, stock: 12, minStock: 4, unit: "Paquete x4", emoji: "🧻", color: "#71a4b5" },
  { id: "p12", name: "Pan de molde", short: "Pan de molde", category: "Abarrotes", price: 7.5, stock: 5, minStock: 4, unit: "Bolsa", emoji: "🍞", color: "#ba7650" }
];

const seedSales = [
  { id: "V-1042", sellerId: "u-seller", sellerName: "Rosa", status: "completed", createdAt: new Date(Date.now() - 24 * 60000).toISOString(), method: "Yape", total: 14, received: 14, change: 0, items: [{ productId: "p1", name: "Gaseosa Inca Kola", price: 3.5, qty: 2 }, { productId: "p12", name: "Pan de molde", price: 7.5, qty: 1 }] },
  { id: "V-1041", sellerId: "u-admin", sellerName: "Carlos", status: "completed", createdAt: new Date(Date.now() - 68 * 60000).toISOString(), method: "Efectivo", total: 10.5, received: 20, change: 9.5, items: [{ productId: "p3", name: "Chocolate Sublime", price: 2, qty: 3 }, { productId: "p2", name: "Leche Gloria", price: 4.5, qty: 1 }] },
  { id: "V-1040", sellerId: "u-seller", sellerName: "Rosa", status: "completed", createdAt: new Date(Date.now() - 130 * 60000).toISOString(), method: "Plin", total: 9.2, received: 9.2, change: 0, items: [{ productId: "p4", name: "Arroz Costeño", price: 5.2, qty: 1 }, { productId: "p7", name: "Agua San Luis", price: 2, qty: 2 }] }
];

function initialState() {
  return { products: structuredClone(seedProducts), sales: structuredClone(seedSales), users: structuredClone(seedUsers), shifts: [], cashMovements: [], auditLog: [], cashClosings: [], user: null };
}

export class LocalStore {
  constructor() { this.state = this.load(); }
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return initialState();
      const defaults = initialState();
      return {
        ...defaults,
        ...saved,
        user: saved.user?.id ? saved.user : null,
        users: saved.users || defaults.users,
        shifts: saved.shifts || [],
        cashMovements: saved.cashMovements || [],
        auditLog: saved.auditLog || [],
        cashClosings: saved.cashClosings || [],
        products: (saved.products || defaults.products).map(product => ({ ...product, barcode: product.barcode || seedProducts.find(seed => seed.id === product.id)?.barcode || "" })),
        sales: (saved.sales || defaults.sales).map(sale => ({ sellerId: "u-admin", sellerName: "Carlos", status: "completed", ...sale }))
      };
    }
    catch { return initialState(); }
  }
  save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); }
  loginWithPin(pin) {
    const account = this.state.users.find(user => user.pin === String(pin) && user.active);
    if (!account) return null;
    this.state.user = { id: account.id, name: account.name, role: account.role, roleLabel: account.roleLabel, store: "Bodega San Carlos" };
    this.addAudit("Inicio de sesión", account.name);
    this.save();
    return this.state.user;
  }
  logout() { if (this.state.user) this.addAudit("Cierre de sesión", this.state.user.name); this.state.user = null; this.save(); }
  verifyAdminPin(pin) { return this.state.users.find(user => user.role === "admin" && user.pin === String(pin) && user.active) || null; }
  addAudit(action, detail = "", user = this.state.user) {
    this.state.auditLog.unshift({ id: `a${Date.now()}${Math.random()}`, createdAt: new Date().toISOString(), userId: user?.id || "system", userName: user?.name || "Sistema", action, detail });
    this.state.auditLog = this.state.auditLog.slice(0, 100);
  }
  getAuditLog() { return [...this.state.auditLog]; }
  getActiveShift(userId = this.state.user?.id) { return this.state.shifts.find(shift => shift.userId === userId && shift.status === "open") || null; }
  openShift(openingCash) {
    if (this.getActiveShift()) return this.getActiveShift();
    const shift = { id: `t${Date.now()}`, userId: this.state.user.id, userName: this.state.user.name, openedAt: new Date().toISOString(), openingCash: Number(openingCash), status: "open" };
    this.state.shifts.unshift(shift); this.addAudit("Apertura de turno", `Fondo inicial S/ ${Number(openingCash).toFixed(2)}`); this.save(); return shift;
  }
  closeShift({ countedCash, expectedCash, difference }) {
    const shift = this.getActiveShift();
    if (!shift) return null;
    Object.assign(shift, { status: "closed", closedAt: new Date().toISOString(), countedCash: Number(countedCash), expectedCash: Number(expectedCash), difference: Number(difference) });
    this.addAudit("Cierre de turno", `Diferencia S/ ${Number(difference).toFixed(2)}`); this.save(); return shift;
  }
  addCashMovement({ type, amount, reason, authorizedBy }) {
    const movement = { id: `m${Date.now()}`, shiftId: this.getActiveShift()?.id || null, userId: this.state.user.id, userName: this.state.user.name, createdAt: new Date().toISOString(), type, amount: Number(amount), reason, authorizedBy };
    this.state.cashMovements.unshift(movement); this.addAudit(type === "withdrawal" ? "Retiro de caja" : "Ingreso de caja", `${reason} · S/ ${Number(amount).toFixed(2)}`); this.save(); return movement;
  }
  getCashMovements(shiftId) { return this.state.cashMovements.filter(item => item.shiftId === shiftId); }
  getProducts() { return this.state.products; }
  getSales() { return [...this.state.sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
  getCashClosing(date) { return this.state.cashClosings.find(closing => closing.date === date) || null; }
  saveCashClosing(closing) {
    const normalized = {
      ...closing,
      openingCash: Number(closing.openingCash),
      cashSales: Number(closing.cashSales),
      expectedCash: Number(closing.expectedCash),
      countedCash: Number(closing.countedCash),
      difference: Number(closing.difference),
      savedAt: new Date().toISOString()
    };
    const index = this.state.cashClosings.findIndex(item => item.date === normalized.date);
    if (index >= 0) this.state.cashClosings[index] = normalized;
    else this.state.cashClosings.unshift(normalized);
    this.addAudit(index >= 0 ? "Cuadre diario actualizado" : "Cuadre diario guardado", `${normalized.date} · diferencia S/ ${normalized.difference.toFixed(2)}`);
    this.save();
    return normalized;
  }
  saveProduct(product) {
    const normalized = { ...product, price: Number(product.price), stock: Number(product.stock), minStock: Number(product.minStock) };
    const index = this.state.products.findIndex(item => item.id === normalized.id);
    const previous = index >= 0 ? this.state.products[index] : null;
    if (index >= 0) this.state.products[index] = normalized;
    else this.state.products.unshift({ ...normalized, id: `p${Date.now()}`, emoji: normalized.emoji || "📦", color: normalized.color || "#e87545" });
    const detail = previous
      ? `${normalized.name} · precio S/ ${previous.price.toFixed(2)} → S/ ${normalized.price.toFixed(2)} · stock ${previous.stock} → ${normalized.stock}`
      : `${normalized.name} · precio S/ ${normalized.price.toFixed(2)} · stock ${normalized.stock}`;
    this.addAudit(index >= 0 ? "Producto actualizado" : "Producto creado", detail);
    this.save();
  }
  createSale({ items, method, received }) {
    if (!this.getActiveShift()) throw new Error("Debes abrir un turno antes de vender");
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const sale = {
      id: `V-${1043 + this.state.sales.length - seedSales.length}`,
      sellerId: this.state.user.id, sellerName: this.state.user.name, shiftId: this.getActiveShift()?.id || null, status: "completed",
      createdAt: new Date().toISOString(), method, total,
      received: method === "Efectivo" ? Number(received) : total,
      change: method === "Efectivo" ? Math.max(0, Number(received) - total) : 0,
      items: items.map(item => ({ productId: item.id, name: item.name, price: item.price, qty: item.qty }))
    };
    for (const item of items) {
      const product = this.state.products.find(p => p.id === item.id);
      if (product) product.stock = Math.max(0, product.stock - item.qty);
    }
    this.state.sales.unshift(sale); this.addAudit("Venta registrada", `${sale.id} · S/ ${total.toFixed(2)}`); this.save(); return sale;
  }
  voidSale(id, reason, authorizedBy) {
    const sale = this.state.sales.find(item => item.id === id);
    if (!sale || sale.status === "voided") return null;
    sale.status = "voided"; sale.voidedAt = new Date().toISOString(); sale.voidReason = reason; sale.authorizedBy = authorizedBy;
    for (const item of sale.items) { const product = this.state.products.find(p => p.id === item.productId); if (product) product.stock += item.qty; }
    this.addAudit("Venta anulada", `${sale.id} · ${reason} · autorizó ${authorizedBy}`); this.save(); return sale;
  }
  reset() { this.state = initialState(); this.save(); }
}
