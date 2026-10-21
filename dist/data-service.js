const STORAGE_KEY = "fiadito-demo-v3";

export const categories = ["Todos", "Campaña", "Bebidas", "Abarrotes", "Snacks", "Lácteos", "Limpieza"];

export const seedProducts = [
  { id:"paneton", name:"Panetón D'Onofrio", short:"Panetón", category:"Campaña", emoji:"🎄", cost:18.2, price:24.9, volumeQty:12, volumePrice:255, stock:34, min:24, velocity:8.4, daysLeft:4, lot:"NAV-2611", expires:"2027-02-10", supplier:"Distribuidora Norte", trend:32 },
  { id:"chocolate", name:"Chocolate para taza", short:"Chocolate taza", category:"Campaña", emoji:"☕", cost:6.1, price:8.5, stock:17, min:20, velocity:5.8, daysLeft:3, lot:"CHO-104", expires:"2027-06-18", supplier:"Alicorp", trend:24 },
  { id:"leche", name:"Leche evaporada Gloria", short:"Leche Gloria", category:"Lácteos", emoji:"🥛", cost:3.45, price:4.6, stock:8, min:18, velocity:6.2, daysLeft:1, lot:"LCH-822", expires:"2027-04-12", supplier:"Gloria", trend:12 },
  { id:"inca", name:"Inca Kola 500 ml", short:"Inca Kola", category:"Bebidas", emoji:"🥤", cost:2.35, price:3.5, stock:21, min:12, velocity:7.1, daysLeft:5, lot:"IK-552", expires:"2027-08-02", supplier:"Arca Continental", trend:8 },
  { id:"arroz", name:"Arroz Costeño 1 kg", short:"Arroz Costeño", category:"Abarrotes", emoji:"🍚", cost:4.15, price:5.5, stock:27, min:14, velocity:4.5, daysLeft:6, lot:"ARR-211", expires:"2027-09-20", supplier:"Costeño", trend:3 },
  { id:"aceite", name:"Aceite Primor 900 ml", short:"Aceite Primor", category:"Abarrotes", emoji:"🫗", cost:8.05, price:10.2, stock:5, min:10, velocity:3.7, daysLeft:1, lot:"ACE-442", expires:"2027-03-22", supplier:"Alicorp", trend:15 },
  { id:"turron", name:"Turrón Doña Pepa 900 g", short:"Turrón 900 g", category:"Campaña", emoji:"🟣", cost:17.5, price:23.9, stock:16, min:4, velocity:.3, daysLeft:52, lot:"TUR-1026", expires:"2027-01-08", supplier:"San José", trend:-72 },
  { id:"galletas", name:"Galletas Casino", short:"Galletas Casino", category:"Snacks", emoji:"🍪", cost:1.05, price:1.7, stock:46, min:12, velocity:2.2, daysLeft:15, lot:"GAL-312", expires:"2026-11-14", supplier:"Mondelez", trend:-18 },
  { id:"yogurt", name:"Yogurt Gloria 1 kg", short:"Yogurt Gloria", category:"Lácteos", emoji:"🥣", cost:5.25, price:7.2, stock:9, min:8, velocity:1.1, daysLeft:8, lot:"YOG-701", expires:"2026-10-27", supplier:"Gloria", trend:-6 },
  { id:"atun", name:"Atún Florida 170 g", short:"Atún Florida", category:"Abarrotes", emoji:"🐟", cost:4.15, price:5.8, stock:20, min:8, velocity:2.9, daysLeft:7, lot:"ATU-210", expires:"2028-03-16", supplier:"G.W. Yichang", trend:4 },
  { id:"agua", name:"Agua San Luis 625 ml", short:"Agua San Luis", category:"Bebidas", emoji:"💧", cost:1.15, price:2, stock:28, min:12, velocity:5.4, daysLeft:5, lot:"AGU-988", expires:"2027-12-05", supplier:"Arca Continental", trend:6 },
  { id:"detergente", name:"Detergente Bolívar 260 g", short:"Detergente", category:"Limpieza", emoji:"🫧", cost:2.75, price:4, stock:3, min:7, velocity:1.8, daysLeft:2, lot:"DET-772", expires:"2028-04-19", supplier:"Alicorp", trend:1 }
];

const seedCustomers = [
  { id:"maria", name:"María Quispe", phone:"••• 428", debt:86.5, limit:150, lastPayment:"2026-10-12", lastPurchase:"2026-10-17", risk:"Al día", color:"green" },
  { id:"jorge", name:"Jorge Ramos", phone:"••• 905", debt:132, limit:150, lastPayment:"2026-09-28", lastPurchase:"2026-10-04", risk:"Cobrar hoy", color:"red" },
  { id:"bodega-luz", name:"Bodega Luz", phone:"••• 611", debt:255, limit:400, lastPayment:"2026-10-08", lastPurchase:"2026-10-16", risk:"Compra mayorista", color:"amber" },
  { id:"elena", name:"Elena Soto", phone:"••• 183", debt:24.8, limit:80, lastPayment:"2026-10-15", lastPurchase:"2026-10-18", risk:"Al día", color:"green" }
];

const seedSales = [
  { id:"V-2058", date:"2026-10-19T08:18:00-05:00", method:"Yape", total:39.4, margin:10.8, items:[{id:"leche",name:"Leche Gloria",qty:4,price:4.6},{id:"galletas",name:"Galletas Casino",qty:7,price:1.7},{id:"agua",name:"Agua San Luis",qty:3,price:2}] },
  { id:"V-2057", date:"2026-10-19T09:42:00-05:00", method:"Efectivo", total:18.7, margin:5.1, items:[{id:"inca",name:"Inca Kola",qty:3,price:3.5},{id:"aceite",name:"Aceite Primor",qty:1,price:10.2}] },
  { id:"V-2056", date:"2026-10-19T11:05:00-05:00", method:"Plin", total:53.2, margin:14.4, items:[{id:"arroz",name:"Arroz Costeño",qty:5,price:5.5},{id:"atun",name:"Atún Florida",qty:3,price:5.8},{id:"leche",name:"Leche Gloria",qty:2,price:4.6}] },
  { id:"V-2055", date:"2026-10-19T13:12:00-05:00", method:"Fiado", customerId:"maria", total:22.3, margin:6.2, items:[{id:"arroz",name:"Arroz Costeño",qty:2,price:5.5},{id:"yogurt",name:"Yogurt Gloria",qty:1,price:7.2},{id:"galletas",name:"Galletas Casino",qty:2,price:1.7}] },
  { id:"V-2054", date:"2026-10-19T17:48:00-05:00", method:"Efectivo", total:96.5, margin:25.7, items:[{id:"inca",name:"Inca Kola",qty:8,price:3.5},{id:"agua",name:"Agua San Luis",qty:12,price:2},{id:"atun",name:"Atún Florida",qty:5,price:5.8},{id:"galletas",name:"Galletas Casino",qty:5,price:1.7}] }
];

const defaultState = () => ({
  products: structuredClone(seedProducts), customers: structuredClone(seedCustomers), sales: structuredClone(seedSales),
  shopping: [{productId:"leche",qty:24},{productId:"aceite",qty:12}], promotions: [], movements: [], activity: [], demoStartedAt: new Date().toISOString()
});

export class DemoStore {
  constructor(){ this.state=this.load(); }
  load(){
    try {
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved ? {...defaultState(),...saved} : defaultState();
    } catch { return defaultState(); }
  }
  save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(this.state)); }
  products(){ return this.state.products; }
  sales(){ return [...this.state.sales].sort((a,b)=>new Date(b.date)-new Date(a.date)); }
  customers(){ return this.state.customers; }
  addProduct(input,actor){
    if(actor?.role!=="admin")throw new Error("Solo un administrador puede crear productos.");
    const clean=value=>String(value||"").replace(/[<>]/g,"").trim();
    const name=clean(input.name);
    const cost=Number(input.cost);const price=Number(input.price);const stock=Number(input.stock);const min=Number(input.min);
    if(!name)throw new Error("El nombre del producto es obligatorio.");
    if([cost,price,stock,min].some(value=>!Number.isFinite(value)||value<0))throw new Error("Revisa costo, precio, stock y mínimo.");
    if(price<cost)throw new Error("El precio de venta no puede ser menor que el costo en esta demo.");
    const baseId=name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"producto";
    const id=`${baseId}-${Date.now().toString(36)}`;
    const product={id,name,short:clean(input.short)||name,category:clean(input.category)||"Abarrotes",emoji:clean(input.emoji)||"📦",cost,price,stock,min,velocity:0,daysLeft:stock>0?999:0,lot:clean(input.lot)||"SIN LOTE",expires:clean(input.expires)||"2027-12-31",supplier:clean(input.supplier)||"Sin proveedor",trend:0,createdAt:new Date().toISOString(),createdBy:actor?.id||"demo-admin"};
    this.state.products.unshift(product);this.log("Producto creado",`${product.name} · ${actor?.name||"Administrador"}`);this.save();return product;
  }
  adjustStock(productId,delta,reason,actor){
    if(actor?.role!=="admin")throw new Error("Solo un administrador puede modificar el inventario.");
    const product=this.state.products.find(item=>item.id===productId);const amount=Number(delta);
    if(!product)throw new Error("El producto ya no está disponible.");
    if(!Number.isFinite(amount)||amount===0)throw new Error("La cantidad debe ser mayor que cero.");
    if(product.stock+amount<0)throw new Error(`Solo hay ${product.stock} unidades disponibles.`);
    const before=product.stock;product.stock+=amount;product.daysLeft=product.velocity>0?Math.ceil(product.stock/product.velocity):999;
    const movement={id:`M-${Date.now()}`,productId,delta:amount,before,after:product.stock,reason:String(reason||"Ajuste manual"),actorId:actor?.id||"demo-admin",actorName:actor?.name||"Administrador",date:new Date().toISOString()};
    this.state.movements.unshift(movement);this.log(amount>0?"Entrada de inventario":"Salida de inventario",`${product.name} · ${Math.abs(amount)} un. · ${movement.reason}`);this.save();return movement;
  }
  addToShopping(productId,qty){
    const item=this.state.shopping.find(entry=>entry.productId===productId);
    if(item) item.qty=Math.max(item.qty,Number(qty)); else this.state.shopping.push({productId,qty:Number(qty)});
    this.log("Producto agregado a la compra"); this.save();
  }
  removeFromShopping(productId){ this.state.shopping=this.state.shopping.filter(item=>item.productId!==productId); this.save(); }
  shoppingList(){ return this.state.shopping.map(item=>({...item,product:this.state.products.find(p=>p.id===item.productId)})).filter(item=>item.product); }
  createPromotion(promotion){ this.state.promotions.unshift({...promotion,id:`P-${Date.now()}`,createdAt:new Date().toISOString()}); this.log("Promoción creada",promotion.title); this.save(); }
  recordPayment(customerId,amount){
    const customer=this.state.customers.find(item=>item.id===customerId); if(!customer)return;
    customer.debt=Math.max(0,customer.debt-Number(amount)); customer.lastPayment=new Date().toISOString().slice(0,10); customer.risk=customer.debt>customer.limit*.8?"Cobrar hoy":"Al día"; customer.color=customer.debt>customer.limit*.8?"red":"green";
    this.log("Abono registrado",`${customer.name} · S/ ${Number(amount).toFixed(2)}`); this.save();
  }
  createSale({items,method,customerId,seller}){
    const unavailable=items.find(item=>{const product=this.state.products.find(p=>p.id===item.id);return !product||product.stock<item.qty;});
    if(unavailable)throw new Error(`No hay stock suficiente de ${unavailable.short}.`);
    const total=items.reduce((sum,item)=>sum+this.unitPrice(item)*item.qty,0);
    const margin=items.reduce((sum,item)=>sum+(this.unitPrice(item)-item.cost)*item.qty,0);
    const sale={id:`V-${2059+this.state.sales.length-seedSales.length}`,date:new Date().toISOString(),method,total,margin,customerId:method==="Fiado"?customerId:null,sellerId:seller?.id||"demo-user",sellerName:seller?.name||"Usuario demo",items:items.map(item=>({id:item.id,name:item.short,qty:item.qty,price:this.unitPrice(item)}))};
    items.forEach(item=>{const product=this.state.products.find(p=>p.id===item.id); if(product)product.stock=Math.max(0,product.stock-item.qty);});
    if(method==="Fiado"){const customer=this.state.customers.find(item=>item.id===customerId); if(customer){customer.debt+=total;customer.lastPurchase=new Date().toISOString().slice(0,10);}}
    this.state.sales.unshift(sale); this.log("Venta registrada",`${sale.id} · S/ ${total.toFixed(2)}`); this.save(); return sale;
  }
  unitPrice(item){ return item.volumeQty&&item.qty>=item.volumeQty ? item.volumePrice/item.volumeQty : item.price; }
  log(action,detail=""){ this.state.activity.unshift({action,detail,date:new Date().toISOString()}); }
  reset(){ this.state=defaultState(); this.save(); }
}
