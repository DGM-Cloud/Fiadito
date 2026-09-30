const STORAGE_KEY = "fiadito-demo-v1";

export const categories = ["Todos", "Bebidas", "Abarrotes", "Snacks", "Lácteos", "Limpieza"];

export const seedProducts = [
  { id: "p1", name: "Gaseosa Inca Kola", short: "Inca Kola", category: "Bebidas", price: 3.5, stock: 18, minStock: 6, unit: "Botella 500 ml", emoji: "🥤", color: "#f4b63d" },
  { id: "p2", name: "Leche Gloria", short: "Leche Gloria", category: "Lácteos", price: 4.5, stock: 4, minStock: 6, unit: "Lata 400 g", emoji: "🥛", color: "#5f91cd" },
  { id: "p3", name: "Chocolate Sublime", short: "Sublime", category: "Snacks", price: 2, stock: 23, minStock: 8, unit: "Unidad", emoji: "🍫", color: "#76513c" },
  { id: "p4", name: "Arroz Costeño", short: "Arroz Costeño", category: "Abarrotes", price: 5.2, stock: 10, minStock: 5, unit: "Bolsa 1 kg", emoji: "🍚", color: "#d6a959" },
  { id: "p5", name: "Aceite Primor", short: "Aceite Primor", category: "Abarrotes", price: 9.9, stock: 2, minStock: 4, unit: "Botella 900 ml", emoji: "🫗", color: "#ef9e32" },
  { id: "p6", name: "Galleta Casino", short: "Galleta Casino", category: "Snacks", price: 1.5, stock: 30, minStock: 10, unit: "Paquete", emoji: "🍪", color: "#d87352" },
  { id: "p7", name: "Agua San Luis", short: "Agua San Luis", category: "Bebidas", price: 2, stock: 16, minStock: 6, unit: "Botella 625 ml", emoji: "💧", color: "#5ca8bd" },
  { id: "p8", name: "Detergente Bolívar", short: "Detergente", category: "Limpieza", price: 3.8, stock: 0, minStock: 5, unit: "Bolsa 260 g", emoji: "🫧", color: "#658ac7" },
  { id: "p9", name: "Atún Florida", short: "Atún Florida", category: "Abarrotes", price: 5.5, stock: 7, minStock: 5, unit: "Lata 170 g", emoji: "🐟", color: "#3d8c9e" },
  { id: "p10", name: "Yogurt Gloria", short: "Yogurt Gloria", category: "Lácteos", price: 6.9, stock: 3, minStock: 5, unit: "Botella 1 kg", emoji: "🥣", color: "#d66e8d" },
  { id: "p11", name: "Papel higiénico Elite", short: "Papel Elite", category: "Limpieza", price: 8.5, stock: 12, minStock: 4, unit: "Paquete x4", emoji: "🧻", color: "#71a4b5" },
  { id: "p12", name: "Pan de molde", short: "Pan de molde", category: "Abarrotes", price: 7.5, stock: 5, minStock: 4, unit: "Bolsa", emoji: "🍞", color: "#ba7650" }
];

const seedSales = [
  { id: "V-1042", createdAt: new Date(Date.now() - 24 * 60000).toISOString(), method: "Yape", total: 14, received: 14, change: 0, items: [{ productId: "p1", name: "Gaseosa Inca Kola", price: 3.5, qty: 2 }, { productId: "p12", name: "Pan de molde", price: 7.5, qty: 1 }] },
  { id: "V-1041", createdAt: new Date(Date.now() - 68 * 60000).toISOString(), method: "Efectivo", total: 10.5, received: 20, change: 9.5, items: [{ productId: "p3", name: "Chocolate Sublime", price: 2, qty: 3 }, { productId: "p2", name: "Leche Gloria", price: 4.5, qty: 1 }] },
  { id: "V-1040", createdAt: new Date(Date.now() - 130 * 60000).toISOString(), method: "Plin", total: 9.2, received: 9.2, change: 0, items: [{ productId: "p4", name: "Arroz Costeño", price: 5.2, qty: 1 }, { productId: "p7", name: "Agua San Luis", price: 2, qty: 2 }] }
];

function initialState() {
  return { products: structuredClone(seedProducts), sales: structuredClone(seedSales), cashClosings: [], user: null };
}

export class LocalStore {
  constructor() { this.state = this.load(); }
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return initialState();
      return { ...initialState(), ...saved, cashClosings: saved.cashClosings || [] };
    }
    catch { return initialState(); }
  }
  save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); }
  login(name = "Carlos") { this.state.user = { name, store: "Bodega San Carlos" }; this.save(); }
  logout() { this.state.user = null; this.save(); }
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
    this.save();
    return normalized;
  }
  saveProduct(product) {
    const normalized = { ...product, price: Number(product.price), stock: Number(product.stock), minStock: Number(product.minStock) };
    const index = this.state.products.findIndex(item => item.id === normalized.id);
    if (index >= 0) this.state.products[index] = normalized;
    else this.state.products.unshift({ ...normalized, id: `p${Date.now()}`, emoji: normalized.emoji || "📦", color: normalized.color || "#e87545" });
    this.save();
  }
  createSale({ items, method, received }) {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const sale = {
      id: `V-${1043 + this.state.sales.length - seedSales.length}`,
      createdAt: new Date().toISOString(), method, total,
      received: method === "Efectivo" ? Number(received) : total,
      change: method === "Efectivo" ? Math.max(0, Number(received) - total) : 0,
      items: items.map(item => ({ productId: item.id, name: item.name, price: item.price, qty: item.qty }))
    };
    for (const item of items) {
      const product = this.state.products.find(p => p.id === item.id);
      if (product) product.stock = Math.max(0, product.stock - item.qty);
    }
    this.state.sales.unshift(sale); this.save(); return sale;
  }
  reset() { this.state = initialState(); this.save(); }
}
