import { LocalStore, categories } from "./data-service.js";

const store = new LocalStore();
const app = document.querySelector("#app");
const liveRegion = document.querySelector("#live-region");
const localDateKey = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  const pad = number => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const state = {
  route: "home",
  query: "",
  category: "Todos",
  cart: [],
  editProductId: null,
  selectedMethod: "Efectivo",
  selectedDate: localDateKey(),
  selectedSeller: "all"
};

const icons = {
  home: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>`,
  sale: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2v4M18 2v4M4 5h16v17l-3-2-3 2-3-2-3 2-4-2z"/><path d="M8 10h8M8 14h5"/></svg>`,
  products: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m3 7 9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/></svg>`,
  inventory: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16v5H4zM5 9h14v11H5zM9 13h6"/></svg>`,
  search: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  plus: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  arrow: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`,
  check: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>`,
  print: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/></svg>`,
  logout: `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M15 3h5v18h-5"/></svg>`
};

const money = value => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
const time = iso => new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
const dateTime = iso => new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
const friendlyDate = date => new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

function announce(message) {
  liveRegion.textContent = "";
  requestAnimationFrame(() => { liveRegion.textContent = message; });
}

function toast(message) {
  document.querySelector(".toast")?.remove();
  const element = document.createElement("div");
  element.className = `toast${state.route === "sale" && state.cart.length ? " toast-above-ticket" : ""}`;
  element.innerHTML = `${icons.check}<span>${escapeHTML(message)}</span>`;
  document.body.append(element);
  announce(message);
  setTimeout(() => element.remove(), 2400);
}

function loginView() {
  return `
    <main class="login-shell" id="main">
      <section class="login-art" aria-hidden="true"></section>
      <section class="login-panel">
        <div class="brand"><span class="brand-mark">F</span> Fiadito</div>
        <p class="eyebrow">Fiadito V2</p>
        <h1>¿Quién está entrando?</h1>
        <p class="lead">Cada persona usa su propio PIN. Así cada venta y movimiento queda registrado.</p>
        <form class="login-form" id="login-form">
          <div class="field">
            <label for="pin">PIN personal</label>
            <input id="pin" name="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="current-password" aria-describedby="pin-hint" required />
            <span class="hint" id="pin-hint">En producción, cada trabajador tendrá un PIN privado.</span>
          </div>
          <button class="btn btn-primary btn-block" type="submit">Entrar a la bodega</button>
        </form>
        <div class="demo-accounts"><p>Accesos para probar esta versión</p><button data-demo-pin="1234"><span class="avatar">C</span><span><strong>Carlos</strong><small>Administrador · PIN 1234</small></span></button><button data-demo-pin="2468"><span class="avatar">R</span><span><strong>Rosa</strong><small>Vendedora · PIN 2468</small></span></button></div>
      </section>
    </main>`;
}

function navButton(route, label, icon) {
  const active = state.route === route;
  return `<button class="nav-button ${active ? "active" : ""}" data-route="${route}" ${active ? 'aria-current="page"' : ""}>${icon}<span>${label}</span></button>`;
}

function appShell(content) {
  const user = store.state.user;
  const isAdmin = user.role === "admin";
  return `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><span class="brand-mark">F</span> Fiadito</div>
        <button class="profile-chip" data-action="profile" aria-label="Opciones de ${escapeHTML(user.name)}">
          <span class="avatar">${escapeHTML(user.name[0].toUpperCase())}</span>
          <span class="profile-label"><strong>${escapeHTML(user.name)}</strong><small>${escapeHTML(user.roleLabel)}</small></span>
        </button>
      </header>
      <nav class="side-nav" aria-label="Secciones principales">
        <button class="side-sell" data-route="sale">${icons.plus} Hacer una venta</button>
        ${navButton("home", "Inicio", icons.home)}
        ${navButton("history", "Ventas", icons.sale)}
        ${navButton("products", "Productos", icons.products)}
        ${navButton("inventory", "Inventario", icons.inventory)}
        <span class="nav-spacer"></span>
        ${isAdmin ? `<button class="nav-button" data-action="reset">↻ <span>Restablecer demo</span></button>` : ""}
        <button class="nav-button" data-action="logout">${icons.logout}<span>Salir</span></button>
      </nav>
      <main class="main" id="main">${content}</main>
      <nav class="bottom-nav" aria-label="Secciones principales">
        ${navButton("home", "Inicio", icons.home)}
        ${navButton("history", "Ventas", icons.sale)}
        <button class="nav-button nav-sell" data-route="sale">${icons.plus}<span>Vender</span></button>
        ${navButton("products", "Productos", icons.products)}
        ${navButton("inventory", "Stock", icons.inventory)}
      </nav>
    </div>`;
}

function statusFor(product) {
  if (product.stock === 0) return `<span class="status-pill status-out">Agotado</span>`;
  if (product.stock <= product.minStock) return `<span class="status-pill status-low">Stock bajo</span>`;
  return `<span class="status-pill">Disponible</span>`;
}

function saleRows(sales, limit) {
  const rows = limit ? sales.slice(0, limit) : sales;
  if (!rows.length) return `<div class="empty-state"><div class="empty-icon">🧾</div><h2>Aún no hay ventas</h2><p>Tu primera venta aparecerá aquí con su ticket y forma de pago.</p><button class="btn btn-primary" data-route="sale">Hacer una venta</button></div>`;
  return `<div class="paper-list">${rows.map(sale => `
    <button class="sale-row ${sale.status === "voided" ? "is-voided" : ""}" data-sale-id="${sale.id}">
      <span class="row-icon">${sale.method === "Efectivo" ? "💵" : sale.method === "Yape" ? "🟣" : sale.method === "Plin" ? "🔵" : "✓"}</span>
      <span class="row-copy"><strong>${sale.id}</strong><small>${time(sale.createdAt)} · ${escapeHTML(sale.sellerName || "Carlos")} · ${sale.items.reduce((sum, item) => sum + item.qty, 0)} productos</small></span>
      <span class="row-total">${money(sale.total)}<small class="payment-pill ${sale.status === "voided" ? "status-out" : ""}">${sale.status === "voided" ? "Anulada" : sale.method}</small></span>
      ${icons.arrow}
    </button>`).join("")}</div>`;
}

function homeView() {
  const isAdmin = store.state.user.role === "admin";
  const sales = store.getSales().filter(sale => sale.status !== "voided" && (isAdmin || sale.sellerId === store.state.user.id));
  const today = new Date().toDateString();
  const todaySales = sales.filter(sale => new Date(sale.createdAt).toDateString() === today);
  const total = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const low = store.getProducts().filter(product => product.stock <= product.minStock);
  const activeShift = store.getActiveShift();
  return `
    <div class="home-grid">
      <section>
        <div class="home-hero">
          <p class="eyebrow">${new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</p>
          <h1>Buenas tardes, ${escapeHTML(store.state.user.name)}.</h1>
          <p style="color:#d9d0c5">¿Qué hacemos en la bodega?</p>
          <button class="hero-sale-button" data-route="sale"><span><strong>${activeShift ? "Hacer una venta" : "Abrir turno para vender"}</strong><span>${activeShift ? "Regístrala en pocos toques" : "Primero registra el fondo de caja"}</span></span><span class="round-icon">${icons.plus}</span></button>
        </div>
        <div class="shift-strip ${activeShift ? "is-open" : ""}"><span class="shift-dot"></span><span><strong>${activeShift ? `Turno abierto por ${escapeHTML(activeShift.userName)}` : "Turno cerrado"}</strong><small>${activeShift ? `Desde ${time(activeShift.openedAt)} · Fondo ${money(activeShift.openingCash)}` : "No se pueden registrar ventas hasta abrir caja."}</small></span><button class="text-button" data-action="${activeShift ? "profile" : "open-shift"}">${activeShift ? "Ver turno" : "Abrir"}</button></div>
        <div class="today-strip">
          <div class="metric"><small>Vendiste hoy</small><span class="display-number">${money(total)}</span></div>
          <div class="metric"><small>Ventas de hoy</small><span class="display-number">${todaySales.length}</span></div>
        </div>
      </section>
      <section>
        <div class="section-title"><h2>Necesitan atención</h2><button class="text-button" data-route="inventory">Ver stock</button></div>
        <button class="restock-banner" data-route="inventory" style="width:100%;text-align:left"><span class="stamp">!</span><span><strong>${low.length} productos por reponer</strong><p>${low.filter(p => p.stock === 0).length} agotados · revísalos antes de vender</p></span></button>
        <div class="section-title"><h2>Últimas ventas</h2><button class="text-button" data-route="history">Ver todas</button></div>
        ${saleRows(sales, 4)}
      </section>
    </div>`;
}

function pageHead(title, subtitle, action = "") {
  return `<div class="page-head"><div><p class="eyebrow">Fiadito</p><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
}

function saleView() {
  const products = store.getProducts().filter(product => {
    const matchText = `${product.name} ${product.category} ${product.barcode || ""}`.toLowerCase().includes(state.query.toLowerCase());
    return matchText && (state.category === "Todos" || product.category === state.category);
  });
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ticket = state.cart.length ? state.cart.map(item => `
    <div class="ticket-item">
      <div class="ticket-item-main"><strong>${escapeHTML(item.short)}</strong><small class="unit-price">Precio unitario: ${money(item.price)}</small><div class="quantity"><span class="quantity-label">Cantidad</span><button class="qty-button" data-cart="minus" data-id="${item.id}" aria-label="Quitar uno de ${escapeHTML(item.name)}">−</button><strong>${item.qty}</strong><button class="qty-button" data-cart="plus" data-id="${item.id}" aria-label="Agregar otro ${escapeHTML(item.name)}">+</button></div></div>
      <strong class="ticket-line-total">${money(item.price * item.qty)}</strong>
    </div>`).join("") : `<div class="empty-state" style="border:0;background:none;padding:2rem .5rem"><div class="empty-icon">🧺</div><h2>Tu venta está vacía</h2><p>Toca un producto para agregarlo.</p></div>`;
  return `
    ${pageHead("Hacer una venta", "Toca cada producto que llevó la persona.")}
    <div class="sale-layout">
      <section class="catalog-panel">
        <div class="search-box">${icons.search}<input type="search" id="sale-search" value="${escapeHTML(state.query)}" placeholder="Buscar o escanear código" aria-label="Buscar o escanear producto para vender" /><span class="scan-hint">Presiona Enter después de escanear</span></div>
        <div class="filter-scroll" aria-label="Filtrar por categoría">${categories.map(category => `<button class="filter-chip ${state.category === category ? "active" : ""}" data-category="${category}">${category}</button>`).join("")}</div>
        ${products.length ? `<div class="product-grid">${products.map(product => `<button class="product-card" data-add="${product.id}" style="--card-color:${product.color}" ${product.stock === 0 ? "disabled" : ""}><span><span class="product-emoji">${product.emoji}</span><strong>${escapeHTML(product.short)}</strong><small>${product.unit}<br>${product.stock === 0 ? "Agotado" : `${product.stock} disponibles`}</small></span><span class="product-price">${money(product.price)}<span class="add-dot">+</span></span></button>`).join("")}</div>` : `<div class="empty-state"><div class="empty-icon">🔎</div><h2>No encontramos ese producto</h2><p>Prueba con otro nombre o cambia la categoría.</p><button class="btn btn-secondary" data-action="clear-search">Limpiar búsqueda</button></div>`}
        ${state.cart.length ? `<button class="mobile-ticket-bar" data-action="checkout"><span class="mobile-ticket-copy"><strong>Ver mi venta</strong><small>${count} ${count === 1 ? "producto" : "productos"}</small></span><strong class="mobile-ticket-total">${money(total)}</strong></button>` : ""}
      </section>
      <aside class="ticket-panel" aria-label="Venta actual">
        <div class="ticket-top"><p class="eyebrow">Ticket abierto</p><h2>Mi venta</h2></div>
        <div class="ticket-lines">${ticket}</div>
        <div class="ticket-summary"><div class="total-line"><strong>Total</strong><strong>${money(total)}</strong></div><button class="btn btn-primary btn-block" data-action="checkout" ${!state.cart.length ? "disabled" : ""}>Cobrar esta venta</button></div>
      </aside>
    </div>`;
}

function historyView() {
  const isAdmin = store.state.user.role === "admin";
  const availableSellers = store.state.users.filter(user => user.active);
  const daySales = store.getSales().filter(sale => localDateKey(sale.createdAt) === state.selectedDate && (isAdmin ? state.selectedSeller === "all" || sale.sellerId === state.selectedSeller : sale.sellerId === store.state.user.id));
  const completedSales = daySales.filter(sale => sale.status !== "voided");
  const sales = daySales.filter(sale => `${sale.id} ${sale.method} ${sale.sellerName} ${sale.items.map(i => i.name).join(" ")}`.toLowerCase().includes(state.query.toLowerCase()));
  const totals = completedSales.reduce((summary, sale) => {
    summary.total += sale.total;
    summary[sale.method] = (summary[sale.method] || 0) + sale.total;
    return summary;
  }, { total: 0, Efectivo: 0, Yape: 0, Plin: 0, Otro: 0 });
  const digital = totals.Yape + totals.Plin + totals.Otro;
  const closing = store.getCashClosing(state.selectedDate);
  const activeShift = store.getActiveShift();
  const isToday = state.selectedDate === localDateKey();
  return `${pageHead("Ventas", "Revisa lo vendido por fecha y cuadra tu caja al terminar el día.", `<button class="btn btn-primary desktop-action" data-route="sale">${icons.plus} Nueva venta</button>`)}
    <section class="day-toolbar" aria-label="Fecha de ventas"><div class="field"><label for="sales-date">Ventas del día</label><input type="date" id="sales-date" value="${state.selectedDate}" max="${localDateKey()}" /></div>${!isToday ? `<button class="btn btn-secondary" data-action="today-sales">Ver hoy</button>` : ""}</section>
    <section class="daily-summary" aria-label="Resumen de ${friendlyDate(state.selectedDate)}">
      <div class="summary-total"><small>Total vendido</small><strong>${money(totals.total)}</strong><span>${completedSales.length} ${completedSales.length === 1 ? "venta" : "ventas"}${daySales.length !== completedSales.length ? ` · ${daySales.length - completedSales.length} anulada` : ""}</span></div>
      <div class="summary-method"><span>💵</span><small>Efectivo</small><strong>${money(totals.Efectivo)}</strong></div>
      <div class="summary-method"><span>📱</span><small>Yape, Plin y otro</small><strong>${money(digital)}</strong></div>
      ${isAdmin ? `<button class="cash-close-card" data-action="cash-closing" ${!completedSales.length ? "disabled" : ""}><span><small>${closing ? "Cuadre guardado" : "Al cerrar el día"}</small><strong>${closing ? closingStatus(closing.difference) : "Cuadrar caja general"}</strong></span><span class="cash-close-icon">${closing ? "✓" : "→"}</span></button>` : `<button class="cash-close-card" data-action="${activeShift ? "close-shift" : "open-shift"}"><span><small>${activeShift ? "Antes de salir" : "Para comenzar a vender"}</small><strong>${activeShift ? "Cerrar mi turno" : "Abrir mi turno"}</strong></span><span class="cash-close-icon">→</span></button>`}
    </section>
    ${isAdmin && closing ? `<div class="closing-note ${Math.abs(closing.difference) < .01 ? "is-balanced" : ""}"><span>${Math.abs(closing.difference) < .01 ? "✓" : "!"}</span><p><strong>${closingStatus(closing.difference)}</strong><small>Esperado ${money(closing.expectedCash)} · Contado ${money(closing.countedCash)}</small></p><button class="text-button" data-action="cash-closing">Revisar</button></div>` : ""}
    <div class="section-title"><h2>Tickets del día</h2><span>${friendlyDate(state.selectedDate)}</span></div>
    ${isAdmin ? `<div class="seller-filter"><label for="seller-filter">Vendedor</label><select id="seller-filter"><option value="all">Todos</option>${availableSellers.map(user => `<option value="${user.id}" ${state.selectedSeller === user.id ? "selected" : ""}>${escapeHTML(user.name)} · ${user.roleLabel}</option>`).join("")}</select><button class="btn btn-secondary" data-action="audit-log">Ver actividad</button></div>` : `<div class="seller-context">Mostrando solamente las ventas de <strong>${escapeHTML(store.state.user.name)}</strong>.</div>`}
    <div class="search-box">${icons.search}<input type="search" id="history-search" value="${escapeHTML(state.query)}" placeholder="Buscar por producto, código o pago" aria-label="Buscar en ventas" /></div>
    ${sales.length ? saleRows(sales) : daySales.length ? `<div class="empty-state"><div class="empty-icon">🔎</div><h2>No encontramos ese ticket</h2><p>No hay resultados para “${escapeHTML(state.query)}” en esta fecha.</p><button class="btn btn-secondary" data-action="clear-search">Limpiar búsqueda</button></div>` : `<div class="empty-state"><div class="empty-icon">🧾</div><h2>No hubo ventas este día</h2><p>Elige otra fecha o registra una nueva venta.</p>${isToday ? `<button class="btn btn-primary" data-route="sale">Hacer una venta</button>` : ""}</div>`}`;
}

function closingStatus(difference) {
  if (Math.abs(difference) < .01) return "La caja cuadra";
  return difference > 0 ? `Sobra ${money(difference)}` : `Falta ${money(Math.abs(difference))}`;
}

function productsView() {
  const isAdmin = store.state.user.role === "admin";
  const products = store.getProducts().filter(product => `${product.name} ${product.category} ${product.barcode || ""}`.toLowerCase().includes(state.query.toLowerCase()));
  return `${pageHead("Productos", isAdmin ? "Administra precios, códigos y datos para vender." : "Consulta precios y disponibilidad. Solo el administrador puede modificarlos.", isAdmin ? `<button class="btn btn-primary desktop-action" data-product-new>${icons.plus} Agregar producto</button>` : "")}
    ${isAdmin ? `<button class="btn btn-primary btn-block mobile-action" data-product-new style="margin-bottom:1rem">${icons.plus} Agregar un producto</button>` : `<div class="permission-banner">🔒 Precios y stock protegidos para vendedores.</div>`}
    <div class="search-box">${icons.search}<input type="search" id="product-search" value="${escapeHTML(state.query)}" placeholder="Buscar por nombre o código" aria-label="Buscar productos" /></div>
    ${products.length ? `<div class="paper-list">${products.map(product => `${isAdmin ? `<button class="product-row" data-product-edit="${product.id}">` : `<div class="product-row">`}<span class="row-icon">${product.emoji}</span><span class="row-copy"><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.category)} · ${escapeHTML(product.unit)}${product.barcode ? ` · ${product.barcode}` : ""}</small></span><span class="row-total">${money(product.price)}${statusFor(product)}</span>${isAdmin ? icons.arrow : ""}${isAdmin ? "</button>" : "</div>"}`).join("")}</div>` : `<div class="empty-state"><div class="empty-icon">📦</div><h2>No encontramos ese producto</h2><p>Revisa el nombre${isAdmin ? " o agrega uno nuevo" : ""}.</p><button class="btn btn-secondary" data-action="clear-search">Limpiar búsqueda</button></div>`}`;
}

function inventoryView() {
  const isAdmin = store.state.user.role === "admin";
  const all = store.getProducts();
  const low = all.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const out = all.filter(p => p.stock === 0);
  const visible = all.filter(product => product.stock <= product.minStock && `${product.name} ${product.category}`.toLowerCase().includes(state.query.toLowerCase()));
  return `${pageHead("Inventario", "Lo que debes reponer, sin revisar todo el almacén.")}
    <div class="inventory-summary"><div class="mini"><strong>${all.length}</strong><small>Productos</small></div><div class="mini"><strong>${low.length}</strong><small>Stock bajo</small></div><div class="mini"><strong>${out.length}</strong><small>Agotados</small></div></div>
    <div class="search-box">${icons.search}<input type="search" id="inventory-search" value="${escapeHTML(state.query)}" placeholder="Buscar en productos por reponer" aria-label="Buscar en inventario" /></div>
    <div class="section-title"><h2>Por reponer</h2><span class="status-pill status-low">${visible.length} productos</span></div>
    ${visible.length ? `<div class="paper-list">${visible.sort((a,b) => a.stock - b.stock).map(product => `${isAdmin ? `<button class="stock-row" data-product-edit="${product.id}">` : `<div class="stock-row">`}<span class="row-icon">${product.emoji}</span><span class="row-copy"><strong>${escapeHTML(product.name)}</strong><small>Mínimo recomendado: ${product.minStock}</small></span><span class="stock-count"><strong>${product.stock} ${product.stock === 1 ? "unidad" : "unidades"}</strong>${statusFor(product)}</span>${isAdmin ? icons.arrow : ""}${isAdmin ? "</button>" : "</div>"}`).join("")}</div>` : `<div class="empty-state"><div class="empty-icon">✨</div><h2>${state.query ? "No hay coincidencias" : "Todo está bien abastecido"}</h2><p>${state.query ? "Prueba buscando otro producto." : "No tienes productos con stock bajo por ahora."}</p></div>`}`;
}

function render({ preserveFocus = false } = {}) {
  const focusedId = preserveFocus ? document.activeElement?.id : null;
  if (!store.state.user) app.innerHTML = loginView();
  else {
    const views = { home: homeView, sale: saleView, history: historyView, products: productsView, inventory: inventoryView };
    app.innerHTML = appShell((views[state.route] || homeView)());
  }
  if (focusedId) {
    const input = document.getElementById(focusedId);
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  }
}

function openDialog(html, onReady) {
  document.querySelector("dialog")?.remove();
  const dialog = document.createElement("dialog");
  dialog.innerHTML = html;
  document.body.append(dialog);
  dialog.addEventListener("click", event => { if (event.target === dialog || event.target.closest("[data-close]")) dialog.close(); });
  dialog.addEventListener("close", () => dialog.remove());
  dialog.showModal();
  onReady?.(dialog);
  return dialog;
}

function checkoutDialog() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const html = `<div class="dialog-head"><div><p class="eyebrow">Total ${money(total)}</p><h2>¿Cómo te pagaron?</h2><p>Elige una forma de pago.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div>
    <div class="dialog-body"><div class="method-grid">${["Efectivo", "Yape", "Plin", "Otro"].map(method => `<button class="method-card ${state.selectedMethod === method ? "active" : ""}" data-method="${method}"><span>${method === "Efectivo" ? "💵" : method === "Yape" ? "🟣" : method === "Plin" ? "🔵" : "✓"}</span>${method}</button>`).join("")}</div>
    <div id="cash-area">${cashArea(total)}</div><button class="btn btn-primary btn-block" id="confirm-payment">Confirmar cobro de ${money(total)}</button></div>`;
  openDialog(html, dialog => {
    dialog.addEventListener("click", event => {
      const methodButton = event.target.closest("[data-method]");
      if (methodButton) {
        state.selectedMethod = methodButton.dataset.method;
        dialog.querySelectorAll("[data-method]").forEach(button => button.classList.toggle("active", button === methodButton));
        dialog.querySelector("#cash-area").innerHTML = cashArea(total);
      }
      const quick = event.target.closest("[data-cash]");
      if (quick) { dialog.querySelector("#received").value = quick.dataset.cash; updateChange(dialog, total); }
      if (event.target.closest("#confirm-payment")) completeSale(dialog, total);
    });
    dialog.addEventListener("input", event => { if (event.target.id === "received") updateChange(dialog, total); });
  });
}

function cashArea(total) {
  if (state.selectedMethod !== "Efectivo") return `<div class="cash-helper"><strong>Cobro listo</strong><p style="margin:.25rem 0 0;color:var(--muted)">Confirma cuando veas el pago.</p></div>`;
  const quickValues = [...new Set([Math.ceil(total), Math.ceil(total / 5) * 5, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20])].filter(value => value >= total).slice(0, 4);
  return `<div class="cash-helper"><div class="field"><label for="received">¿Con cuánto pagó?</label><input id="received" type="number" min="${total}" step="0.10" inputmode="decimal" placeholder="0.00" /></div><div class="quick-cash">${quickValues.map(value => `<button data-cash="${value}">${money(value)}</button>`).join("")}</div><div class="change-box"><span>Vuelto</span><strong id="change">—</strong></div></div>`;
}

function updateChange(dialog, total) {
  const received = Number(dialog.querySelector("#received")?.value || 0);
  dialog.querySelector("#change").textContent = received >= total ? money(received - total) : "Falta " + money(total - received);
}

function completeSale(dialog, total) {
  const received = state.selectedMethod === "Efectivo" ? Number(dialog.querySelector("#received")?.value || 0) : total;
  if (state.selectedMethod === "Efectivo" && received < total) { toast("Ingresa un monto suficiente para cobrar"); dialog.querySelector("#received")?.focus(); return; }
  let sale;
  try { sale = store.createSale({ items: state.cart, method: state.selectedMethod, received }); }
  catch (error) { dialog.close(); toast(error.message); openShiftDialog(); return; }
  state.cart = [];
  dialog.close();
  successDialog(sale);
  render();
}

function successDialog(sale) {
  openDialog(`<div class="dialog-body success-content" style="padding-top:1.8rem"><div class="success-mark">✓</div><p class="eyebrow">Venta ${sale.id}</p><h2>¡Venta guardada!</h2><p>${money(sale.total)} · ${sale.method}</p>${sale.change > 0 ? `<div class="change-box"><span>Entrega de vuelto</span><strong>${money(sale.change)}</strong></div>` : ""}<div style="display:grid;gap:.6rem;margin-top:1.2rem"><button class="btn btn-primary" data-route-dialog="sale">Hacer otra venta</button><button class="btn btn-secondary" data-print-sale="${sale.id}">${icons.print} Imprimir ticket</button><button class="btn btn-ghost" data-sale-id="${sale.id}">Ver detalle del ticket</button><button class="btn btn-ghost" data-route-dialog="home">Volver al inicio</button></div></div>`, dialog => {
    dialog.addEventListener("click", event => {
      const route = event.target.closest("[data-route-dialog]")?.dataset.routeDialog;
      if (route) { dialog.close(); go(route); }
      const printId = event.target.closest("[data-print-sale]")?.dataset.printSale;
      if (printId) printTicket(printId);
      const saleId = event.target.closest("[data-sale-id]")?.dataset.saleId;
      if (saleId) { dialog.close(); saleDetail(saleId); }
    });
  });
}

function saleDetail(id) {
  const sale = store.getSales().find(item => item.id === id);
  if (!sale) return;
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">Ticket ${sale.id}</p><h2>${sale.status === "voided" ? "Venta anulada" : "Detalle de venta"}</h2><p>${dateTime(sale.createdAt)}</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body">${sale.status === "voided" ? `<div class="void-banner"><strong>Este ticket fue anulado</strong><small>${escapeHTML(sale.voidReason || "Sin motivo")} · autorizó ${escapeHTML(sale.authorizedBy || "Administrador")}</small></div>` : ""}<div class="receipt-detail">${sale.items.map(item => `<div class="detail-line"><span>${item.qty} × ${escapeHTML(item.name)}</span><strong>${money(item.qty * item.price)}</strong></div>`).join("")}<div class="detail-line total"><span>Total</span><span>${money(sale.total)}</span></div></div><div class="detail-line"><span>Vendedor</span><strong>${escapeHTML(sale.sellerName || "Carlos")}</strong></div><div class="detail-line"><span>Forma de pago</span><strong>${sale.method}</strong></div>${sale.change > 0 ? `<div class="detail-line"><span>Vuelto entregado</span><strong>${money(sale.change)}</strong></div>` : ""}<div class="dialog-actions">${sale.status !== "voided" ? `<button class="btn btn-primary btn-block" data-print-sale="${sale.id}">${icons.print} Imprimir ticket</button><button class="btn btn-danger btn-block" data-void-sale="${sale.id}">Anular venta</button>` : ""}<button class="btn btn-secondary btn-block" data-close>Cerrar ticket</button></div></div>`, dialog => {
    dialog.addEventListener("click", event => {
      const printId = event.target.closest("[data-print-sale]")?.dataset.printSale;
      if (printId) printTicket(printId);
      const voidId = event.target.closest("[data-void-sale]")?.dataset.voidSale;
      if (voidId) { dialog.close(); voidSaleDialog(voidId); }
    });
  });
}

function printTicket(id) {
  const sale = store.getSales().find(item => item.id === id);
  if (!sale) return;
  document.querySelector("#print-ticket")?.remove();
  const printable = document.createElement("section");
  printable.id = "print-ticket";
  printable.innerHTML = `<div class="print-brand">FIADITO</div><h1>${escapeHTML(store.state.user.store)}</h1><p>Ticket ${sale.id}<br>${dateTime(sale.createdAt)}</p><div class="print-lines">${sale.items.map(item => `<div><span>${item.qty} × ${escapeHTML(item.name)}<small>${money(item.price)} c/u</small></span><strong>${money(item.qty * item.price)}</strong></div>`).join("")}</div><div class="print-total"><span>TOTAL</span><strong>${money(sale.total)}</strong></div><p>Pago: ${sale.method}${sale.change > 0 ? `<br>Vuelto: ${money(sale.change)}` : ""}</p><p class="print-thanks">Gracias por tu compra</p>`;
  document.body.append(printable);
  document.body.classList.add("printing-ticket");
  window.print();
  setTimeout(() => { document.body.classList.remove("printing-ticket"); printable.remove(); }, 500);
}

function cashClosingDialog() {
  if (store.state.user.role !== "admin") { shiftClosingDialog(); return; }
  const daySales = store.getSales().filter(sale => localDateKey(sale.createdAt) === state.selectedDate && sale.status !== "voided");
  const cashSales = daySales.filter(sale => sale.method === "Efectivo").reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = daySales.reduce((sum, sale) => sum + sale.total, 0);
  const existing = store.getCashClosing(state.selectedDate);
  const openingCash = existing?.openingCash ?? 0;
  const countedCash = existing?.countedCash ?? "";
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">${friendlyDate(state.selectedDate)}</p><h2>Cuadre de caja</h2><p>Compara lo esperado con el efectivo contado.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><div class="closing-explainer"><span>Ventas del día</span><strong>${money(totalSales)}</strong><small>De ese total, ${money(cashSales)} ingresaron en efectivo.</small></div><form id="cash-closing-form"><div class="field"><label for="opening-cash">Fondo inicial de caja</label><input id="opening-cash" name="openingCash" type="number" min="0" step="0.10" inputmode="decimal" value="${openingCash}" required /><span class="hint">El dinero que había antes de empezar a vender.</span></div><div class="field"><label for="counted-cash">Efectivo contado al cerrar</label><input id="counted-cash" name="countedCash" type="number" min="0" step="0.10" inputmode="decimal" value="${countedCash}" placeholder="Cuenta billetes y monedas" required /></div><div class="closing-calculation"><div><span>Debería haber</span><strong id="expected-cash">${money(openingCash + cashSales)}</strong></div><div><span>Diferencia</span><strong id="cash-difference">${countedCash === "" ? "—" : closingStatus(Number(countedCash) - openingCash - cashSales)}</strong></div></div><p class="hint">Fiadito calcula: fondo inicial + ventas en efectivo. Yape, Plin y otros pagos se muestran en el resumen, pero no entran a la caja física.</p><button class="btn btn-primary btn-block" type="submit">${existing ? "Actualizar cuadre" : "Guardar cuadre del día"}</button></form></div>`, dialog => {
    const update = () => {
      const opening = Number(dialog.querySelector("#opening-cash").value || 0);
      const countedValue = dialog.querySelector("#counted-cash").value;
      const expected = opening + cashSales;
      dialog.querySelector("#expected-cash").textContent = money(expected);
      dialog.querySelector("#cash-difference").textContent = countedValue === "" ? "—" : closingStatus(Number(countedValue) - expected);
    };
    dialog.addEventListener("input", event => {
      if (["opening-cash", "counted-cash"].includes(event.target.id)) update();
    });
    dialog.querySelector("#cash-closing-form").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const opening = Number(form.get("openingCash"));
      const counted = Number(form.get("countedCash"));
      const expected = opening + cashSales;
      store.saveCashClosing({ date: state.selectedDate, openingCash: opening, cashSales, expectedCash: expected, countedCash: counted, difference: counted - expected });
      dialog.close(); render(); toast("Cuadre de caja guardado");
    });
  });
}

function openShiftDialog() {
  if (store.getActiveShift()) return;
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">${escapeHTML(store.state.user.roleLabel)}</p><h2>Abrir turno</h2><p>Registra el efectivo que hay antes de la primera venta.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><form id="open-shift-form"><div class="field"><label for="shift-opening">Fondo inicial de caja</label><input id="shift-opening" name="openingCash" type="number" min="0" step="0.10" inputmode="decimal" value="50" required /></div><button class="btn btn-primary btn-block" type="submit">Abrir mi turno</button></form></div>`, dialog => {
    dialog.querySelector("#open-shift-form").addEventListener("submit", event => {
      event.preventDefault(); store.openShift(new FormData(event.currentTarget).get("openingCash")); dialog.close(); render(); toast("Turno abierto correctamente");
    });
  });
}

function shiftClosingDialog() {
  const shift = store.getActiveShift();
  if (!shift) { openShiftDialog(); return; }
  const shiftSales = store.getSales().filter(sale => sale.shiftId === shift.id && sale.status !== "voided" && sale.method === "Efectivo");
  const cashSales = shiftSales.reduce((sum, sale) => sum + sale.total, 0);
  const movements = store.getCashMovements(shift.id);
  const deposits = movements.filter(item => item.type === "deposit").reduce((sum, item) => sum + item.amount, 0);
  const withdrawals = movements.filter(item => item.type === "withdrawal").reduce((sum, item) => sum + item.amount, 0);
  const expected = shift.openingCash + cashSales + deposits - withdrawals;
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">Turno de ${escapeHTML(shift.userName)}</p><h2>Cerrar turno</h2><p>Cuenta el efectivo antes de salir.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><div class="shift-breakdown"><div><span>Fondo inicial</span><strong>${money(shift.openingCash)}</strong></div><div><span>Ventas en efectivo</span><strong>+ ${money(cashSales)}</strong></div><div><span>Otros movimientos</span><strong>${money(deposits - withdrawals)}</strong></div><div class="total"><span>Efectivo esperado</span><strong>${money(expected)}</strong></div></div><form id="close-shift-form"><div class="field"><label for="shift-counted">Efectivo contado</label><input id="shift-counted" name="countedCash" type="number" min="0" step="0.10" inputmode="decimal" required /></div><div class="change-box"><span>Resultado</span><strong id="shift-difference">—</strong></div><button class="btn btn-primary btn-block" type="submit" style="margin-top:1rem">Cerrar turno</button></form></div>`, dialog => {
    const counted = dialog.querySelector("#shift-counted");
    counted.addEventListener("input", () => { dialog.querySelector("#shift-difference").textContent = counted.value === "" ? "—" : closingStatus(Number(counted.value) - expected); });
    dialog.querySelector("#close-shift-form").addEventListener("submit", event => {
      event.preventDefault(); const value = Number(new FormData(event.currentTarget).get("countedCash")); store.closeShift({ countedCash: value, expectedCash: expected, difference: value - expected }); dialog.close(); render(); toast("Turno cerrado y guardado");
    });
  });
}

function cashMovementDialog() {
  if (!store.getActiveShift()) { openShiftDialog(); return; }
  const needsPin = store.state.user.role !== "admin";
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">Caja del turno</p><h2>Registrar movimiento</h2><p>Todo ingreso o retiro queda en el historial.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><form id="movement-form"><div class="field"><label for="movement-type">Tipo</label><select id="movement-type" name="type"><option value="deposit">Ingreso de efectivo</option><option value="withdrawal">Retiro de efectivo</option></select></div><div class="field"><label for="movement-amount">Monto</label><input id="movement-amount" name="amount" type="number" min="0.10" step="0.10" inputmode="decimal" required /></div><div class="field"><label for="movement-reason">Motivo</label><input id="movement-reason" name="reason" placeholder="Ej. pago de movilidad" required /></div>${needsPin ? `<div class="field" id="movement-pin-field"><label for="movement-pin">PIN del administrador</label><input id="movement-pin" name="adminPin" type="password" inputmode="numeric" maxlength="4" /><span class="hint">Obligatorio para retirar efectivo.</span></div>` : ""}<button class="btn btn-primary btn-block" type="submit">Guardar movimiento</button></form></div>`, dialog => {
    dialog.querySelector("#movement-form").addEventListener("submit", event => {
      event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); let authorizer = store.state.user.name;
      if (data.type === "withdrawal" && needsPin) { const admin = store.verifyAdminPin(data.adminPin); if (!admin) { toast("El PIN del administrador no es válido"); return; } authorizer = admin.name; }
      store.addCashMovement({ type: data.type, amount: data.amount, reason: data.reason, authorizedBy: authorizer }); dialog.close(); toast("Movimiento registrado");
    });
  });
}

function voidSaleDialog(id) {
  const sale = store.getSales().find(item => item.id === id);
  if (!sale) return;
  const needsPin = store.state.user.role !== "admin";
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">Ticket ${sale.id}</p><h2>Anular venta</h2><p>El stock regresará al inventario y el ticket seguirá en el historial.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><form id="void-sale-form"><div class="field"><label for="void-reason">Motivo de la anulación</label><select id="void-reason" name="reason"><option>Producto equivocado</option><option>Cliente desistió</option><option>Error en forma de pago</option><option>Otro motivo</option></select></div>${needsPin ? `<div class="field"><label for="void-admin-pin">PIN del administrador</label><input id="void-admin-pin" name="adminPin" type="password" inputmode="numeric" maxlength="4" required /></div>` : ""}<button class="btn btn-danger btn-block" type="submit">Confirmar anulación</button></form></div>`, dialog => {
    dialog.querySelector("#void-sale-form").addEventListener("submit", event => {
      event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); let authorizer = store.state.user.name;
      if (needsPin) { const admin = store.verifyAdminPin(data.adminPin); if (!admin) { toast("El PIN del administrador no es válido"); return; } authorizer = admin.name; }
      store.voidSale(id, data.reason, authorizer); dialog.close(); render(); toast("Venta anulada; el stock fue restaurado");
    });
  });
}

function auditLogDialog() {
  if (store.state.user.role !== "admin") return;
  const entries = store.getAuditLog();
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">Solo administrador</p><h2>Actividad del equipo</h2><p>Últimos accesos y movimientos registrados.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><div class="audit-list">${entries.length ? entries.map(item => `<div><span class="audit-mark"></span><p><strong>${escapeHTML(item.action)}</strong><small>${escapeHTML(item.userName)} · ${dateTime(item.createdAt)}${item.detail ? `<br>${escapeHTML(item.detail)}` : ""}</small></p></div>`).join("") : `<p class="hint">Todavía no hay actividad registrada.</p>`}</div></div>`);
}

function productDialog(id = null) {
  if (store.state.user.role !== "admin") { toast("Solo el administrador puede modificar productos"); return; }
  const product = id ? store.getProducts().find(item => item.id === id) : null;
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">${product ? "Editar" : "Nuevo"}</p><h2>${product ? "Datos del producto" : "Agregar producto"}</h2><p>Solo lo necesario para venderlo.</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><form id="product-form">
    <input type="hidden" name="id" value="${product?.id || ""}" />
    <div class="field"><label for="product-name">Nombre del producto</label><input id="product-name" name="name" value="${escapeHTML(product?.name || "")}" placeholder="Ej. Gaseosa 500 ml" required /></div>
    <div class="field"><label for="product-barcode">Código de barras</label><input id="product-barcode" name="barcode" inputmode="numeric" value="${escapeHTML(product?.barcode || "")}" placeholder="Escanea o escribe el código" /><span class="hint">Opcional para productos vendidos sin código.</span></div>
    <div class="field"><label for="product-category">Categoría</label><select id="product-category" name="category">${categories.filter(c => c !== "Todos").map(category => `<option ${product?.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem"><div class="field"><label for="product-price">Precio (S/)</label><input id="product-price" name="price" type="number" inputmode="decimal" min="0.1" step="0.10" value="${product?.price ?? ""}" required /></div><div class="field"><label for="product-stock">Stock actual</label><input id="product-stock" name="stock" type="number" inputmode="numeric" min="0" step="1" value="${product?.stock ?? 0}" required /></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem"><div class="field"><label for="product-min">Avisar cuando queden</label><input id="product-min" name="minStock" type="number" min="0" step="1" value="${product?.minStock ?? 5}" required /></div><div class="field"><label for="product-unit">Presentación</label><input id="product-unit" name="unit" value="${escapeHTML(product?.unit || "Unidad")}" required /></div></div>
    <button class="btn btn-primary btn-block" type="submit">${product ? "Guardar cambios" : "Agregar producto"}</button></form></div>`, dialog => {
      dialog.querySelector("#product-form").addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const duplicatedBarcode = data.barcode && store.getProducts().some(item => item.id !== product?.id && item.barcode === data.barcode.trim());
        if (duplicatedBarcode) { toast("Ese código de barras ya pertenece a otro producto"); dialog.querySelector("#product-barcode").focus(); return; }
        data.barcode = data.barcode.trim();
        store.saveProduct({ ...product, ...data, short: data.name, emoji: product?.emoji || "📦", color: product?.color || "#e87545" });
        dialog.close(); render(); toast(product ? "Producto actualizado" : "Producto agregado");
      });
    });
}

function profileDialog() {
  const shift = store.getActiveShift();
  const isAdmin = store.state.user.role === "admin";
  openDialog(`<div class="dialog-head"><div><p class="eyebrow">${escapeHTML(store.state.user.roleLabel)}</p><h2>${escapeHTML(store.state.user.name)}</h2><p>${escapeHTML(store.state.user.store)}</p></div><button class="close-button" data-close aria-label="Cerrar">×</button></div><div class="dialog-body"><div class="profile-role-card"><span class="avatar">${escapeHTML(store.state.user.name[0])}</span><span><strong>${shift ? "Turno abierto" : "Sin turno activo"}</strong><small>${shift ? `Desde ${time(shift.openedAt)} · Fondo ${money(shift.openingCash)}` : "Abre un turno para comenzar a vender."}</small></span></div><div class="dialog-actions">${shift ? `<button class="btn btn-secondary btn-block" data-action="movement-dialog">Registrar ingreso o retiro</button><button class="btn btn-primary btn-block" data-action="close-shift-dialog">Cerrar mi turno</button>` : `<button class="btn btn-primary btn-block" data-action="open-shift-dialog">Abrir turno</button>`}${isAdmin ? `<button class="btn btn-secondary btn-block" data-action="audit-dialog">Ver actividad del equipo</button><button class="btn btn-secondary btn-block" data-action="reset-dialog">↻ Restablecer datos de demostración</button>` : ""}<button class="btn btn-ghost btn-block" data-action="logout-dialog">${icons.logout} Salir</button></div><p class="security-note">Esta V2 simula permisos en el navegador. La protección real se activará cuando conectemos autenticación y base de datos.</p></div>`, dialog => {
    dialog.addEventListener("click", event => {
      if (event.target.closest("[data-action='open-shift-dialog']")) { dialog.close(); openShiftDialog(); }
      if (event.target.closest("[data-action='close-shift-dialog']")) { dialog.close(); shiftClosingDialog(); }
      if (event.target.closest("[data-action='movement-dialog']")) { dialog.close(); cashMovementDialog(); }
      if (event.target.closest("[data-action='audit-dialog']")) { dialog.close(); auditLogDialog(); }
      if (event.target.closest("[data-action='reset-dialog']")) { store.reset(); dialog.close(); render(); toast("Datos de demostración restablecidos"); }
      if (event.target.closest("[data-action='logout-dialog']")) { dialog.close(); store.logout(); render(); }
    });
  });
}

function go(route) {
  if (route === "sale" && !store.getActiveShift()) { openShiftDialog(); return; }
  state.route = route; state.query = ""; state.category = "Todos"; render(); window.scrollTo({ top: 0, behavior: "smooth" });
}

app.addEventListener("submit", event => {
  if (event.target.id === "login-form") {
    event.preventDefault();
    const data = new FormData(event.target);
    if (!/^\d{4}$/.test(data.get("pin"))) { toast("El PIN debe tener 4 números"); return; }
    const user = store.loginWithPin(data.get("pin"));
    if (!user) { toast("PIN incorrecto o usuario inactivo"); return; }
    go("home"); openShiftDialog();
  }
});

app.addEventListener("input", event => {
  if (["sale-search", "history-search", "product-search", "inventory-search"].includes(event.target.id)) {
    state.query = event.target.value; render({ preserveFocus: true });
  }
});

app.addEventListener("change", event => {
  if (event.target.id === "sales-date") {
    state.selectedDate = event.target.value || localDateKey();
    state.query = "";
    render();
  }
  if (event.target.id === "seller-filter") { state.selectedSeller = event.target.value; state.query = ""; render(); }
});

app.addEventListener("keydown", event => {
  if (event.target.id === "sale-search" && event.key === "Enter") {
    const product = store.getProducts().find(item => item.barcode && item.barcode === event.target.value.trim());
    if (product) { event.preventDefault(); document.querySelector(`[data-add="${product.id}"]`)?.click(); }
  }
});

app.addEventListener("click", event => {
  const demoPin = event.target.closest("[data-demo-pin]")?.dataset.demoPin;
  if (demoPin) { const user = store.loginWithPin(demoPin); if (user) { go("home"); openShiftDialog(); } return; }
  const route = event.target.closest("[data-route]")?.dataset.route;
  if (route) { go(route); return; }
  const category = event.target.closest("[data-category]")?.dataset.category;
  if (category) { state.category = category; render(); return; }
  const addId = event.target.closest("[data-add]")?.dataset.add;
  if (addId) {
    const product = store.getProducts().find(item => item.id === addId);
    const inCart = state.cart.find(item => item.id === addId);
    if (inCart && inCart.qty >= product.stock) { toast("No hay más unidades disponibles"); return; }
    if (inCart) inCart.qty += 1; else state.cart.push({ ...product, qty: 1 });
    render(); toast(`${product.short} agregado`); return;
  }
  const cartAction = event.target.closest("[data-cart]");
  if (cartAction) {
    const item = state.cart.find(entry => entry.id === cartAction.dataset.id);
    const product = store.getProducts().find(entry => entry.id === cartAction.dataset.id);
    if (cartAction.dataset.cart === "plus" && item.qty < product.stock) item.qty += 1;
    if (cartAction.dataset.cart === "minus") item.qty -= 1;
    state.cart = state.cart.filter(entry => entry.qty > 0); render(); return;
  }
  const saleId = event.target.closest("[data-sale-id]")?.dataset.saleId;
  if (saleId) { saleDetail(saleId); return; }
  const editId = event.target.closest("[data-product-edit]")?.dataset.productEdit;
  if (editId) { productDialog(editId); return; }
  if (event.target.closest("[data-product-new]")) { productDialog(); return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "checkout") checkoutDialog();
  if (action === "clear-search") { state.query = ""; render(); }
  if (action === "today-sales") { state.selectedDate = localDateKey(); state.query = ""; render(); }
  if (action === "cash-closing") cashClosingDialog();
  if (action === "open-shift") openShiftDialog();
  if (action === "close-shift") shiftClosingDialog();
  if (action === "audit-log") auditLogDialog();
  if (action === "profile") profileDialog();
  if (action === "logout") { store.logout(); render(); }
  if (action === "reset") { store.reset(); render(); toast("Datos de demostración restablecidos"); }
});

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const tools = [
    {
      name: "list_low_stock_products", title: "Ver productos por reponer", description: "Lista los productos con stock bajo o agotado.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => store.getProducts().filter(p => p.stock <= p.minStock).map(({ id, name, stock, minStock }) => ({ id, name, stock, minStock }))
    },
    {
      name: "start_new_sale", title: "Empezar una venta", description: "Abre y limpia la venta actual para comenzar a registrar productos.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => { state.cart = []; go("sale"); return { status: "ready", route: "sale" }; }
    }
  ];
  tools.forEach(tool => { try { void Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch {} });
}

render();
registerWebMCP();
