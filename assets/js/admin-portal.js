/**
 * ATELIER ORA // ENTERPRISE ERP & OPERATIONS ENGINE
 * Full Back-Office Management Suite:
 * - Real-time Business Analytics & Executive KPI Dashboard
 * - Product Catalog & Live Stock Inventory Management (with Add Product)
 * - Orders & Global White-Glove Dispatch Telemetry
 * - Staff Attendance Register & Real-Time Punch Status
 * - Staff Payroll, Overtime, Deductions & Salary Slips
 * - Profit & Loss (P&L) Income Statement & GST / Tax Calculations
 */

(function () {
  'use strict';

  // Storage Keys
  const CUSTOM_PRODUCTS_KEY = 'atelier_custom_products';
  const ORDERS_KEY = 'atelier_orders';
  const ATTENDANCE_KEY = 'atelier_staff_attendance';
  const PAYROLL_KEY = 'atelier_payroll';

  // Base Products Catalog
  const DEFAULT_PRODUCTS = [
    { id: 'hoodie-01', title: '500 GSM Heavyweight Boxy Hoodie', category: 'sweats', price: 260, stock: 45, cogs: 85, image: 'assets/images/garment-hoodie-oatmeal.jpg', status: 'instock' },
    { id: 'bomber-02', title: 'Washed Canvas Flight Bomber Jacket', category: 'outerwear', price: 420, stock: 18, cogs: 140, image: 'assets/images/garment-bomber-olive.jpg', status: 'instock' },
    { id: 'trench-03', title: 'Double-Breasted Heavy Wool Overcoat', category: 'outerwear', price: 780, stock: 8, cogs: 280, image: 'assets/images/garment-trench-camel.jpg', status: 'lowstock' },
    { id: 'tee-04', title: '280 GSM Boxy Drop-Shoulder Tee', category: 'tees', price: 110, stock: 92, cogs: 32, image: 'assets/images/garment-tee-charcoal.jpg', status: 'instock' },
    { id: 'trouser-05', title: 'Wide-Leg Pleated Tailored Trouser', category: 'trousers', price: 320, stock: 24, cogs: 105, image: 'assets/images/garment-trouser-espresso.jpg', status: 'instock' },
    { id: 'boots-06', title: 'Hand-Burnished Suede Chelsea Boots', category: 'footwear', price: 450, stock: 12, cogs: 165, image: 'assets/images/garment-boots-suede.jpg', status: 'lowstock' }
  ];

  // Base Staff Team
  const DEFAULT_STAFF = [
    { id: 'staff-01', name: 'Julian Vance', role: 'Master Pattern Cutter', department: 'Couture Design', baseSalary: 145000, overtime: 12000, deductions: 15000, attendance: 'present', punchIn: '08:45 AM', punchOut: '--' },
    { id: 'staff-02', name: 'Matteo Rossi', role: 'Senior Tailoring Specialist', department: 'Garment Assembly', baseSalary: 120000, overtime: 8500, deductions: 12000, attendance: 'present', punchIn: '08:52 AM', punchOut: '--' },
    { id: 'staff-03', name: 'Elena Gomez', role: 'Textile & Dyeing Director', department: 'Material Provenance', baseSalary: 135000, overtime: 0, deductions: 13500, attendance: 'late', punchIn: '09:35 AM', punchOut: '--' },
    { id: 'staff-04', name: 'Anya Sharma', role: 'Quality & Packaging Inspector', department: 'Quality Assurance', baseSalary: 85000, overtime: 6000, deductions: 8500, attendance: 'present', punchIn: '08:40 AM', punchOut: '--' },
    { id: 'staff-05', name: 'Kabir Mehta', role: 'Lead Concierge & Client Relations', department: 'VIP Client Services', baseSalary: 95000, overtime: 4500, deductions: 9500, attendance: 'present', punchIn: '09:00 AM', punchOut: '--' }
  ];

  // Base Seed Orders
  const DEFAULT_ORDERS = [
    { id: 'AO-9412', customer: 'Julian Vance', email: 'j.vance@oberoigroup.com', items: '500 GSM Boxy Hoodie (L), Tailored Trouser (32)', total: 580, destination: 'New Delhi, India', status: 'dispatched', date: 'Today, 10:15 AM' },
    { id: 'AO-9411', customer: 'Marcus Sterling', email: 'm.sterling@milanfashion.it', items: 'Double-Breasted Wool Overcoat (50)', total: 780, destination: 'Milan, Italy', status: 'processing', date: 'Today, 08:30 AM' },
    { id: 'AO-9410', customer: 'Sophia Chen', email: 'sophia@archnyc.com', items: 'Suede Chelsea Boots (EU 42)', total: 450, destination: 'New York, USA', status: 'delivered', date: 'Yesterday, 04:20 PM' },
    { id: 'AO-9409', customer: 'David Lindqvist', email: 'david@nordicform.se', items: 'Washed Canvas Bomber (M), Boxy Tee (M)', total: 530, destination: 'Stockholm, Sweden', status: 'delivered', date: '12 Sep 2026' }
  ];

  // State
  let products = [];
  let staff = [];
  let orders = [];

  // Load Saved State
  function loadData() {
    try {
      const savedProducts = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
      products = savedProducts ? JSON.parse(savedProducts) : [...DEFAULT_PRODUCTS];

      const savedStaff = localStorage.getItem(ATTENDANCE_KEY);
      staff = savedStaff ? JSON.parse(savedStaff) : [...DEFAULT_STAFF];

      const savedOrders = localStorage.getItem(ORDERS_KEY);
      orders = savedOrders ? JSON.parse(savedOrders) : [...DEFAULT_ORDERS];
    } catch (e) {
      products = [...DEFAULT_PRODUCTS];
      staff = [...DEFAULT_STAFF];
      orders = [...DEFAULT_ORDERS];
    }
  }

  function saveProducts() {
    try { localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products)); } catch (e) {}
  }

  function saveStaff() {
    try { localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(staff)); } catch (e) {}
  }

  function saveOrders() {
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch (e) {}
  }

  // Live IST Clock
  function initClock() {
    const clockEl = document.getElementById('ist-clock-time');
    function update() {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', options) + ' IST';
    }
    update();
    setInterval(update, 1000);
  }

  // Tabs Navigation
  function initTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    window.switchAdminTab = function (tabId) {
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });
      tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId);
      });
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        window.switchAdminTab(tab);
      });
    });
  }

  // Render Dashboard
  function renderDashboard() {
    const totalSales = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
    const presentStaffCount = staff.filter(s => s.attendance === 'present' || s.attendance === 'late').length;
    const activeOrdersCount = orders.filter(o => o.status === 'processing' || o.status === 'dispatched').length;

    // Financial calculations
    const estimatedTax = totalSales * 0.18; // 18% GST / luxury apparel rate
    const estimatedCOGS = orders.reduce((acc, o) => acc + (o.total * 0.35), 0);
    const netProfit = totalSales - estimatedCOGS - estimatedTax;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0;

    // Update KPI Card Elements
    const kpiRev = document.getElementById('kpi-revenue');
    if (kpiRev) kpiRev.textContent = `$${totalSales.toLocaleString('en-US')}`;

    const kpiOrd = document.getElementById('kpi-orders');
    if (kpiOrd) kpiOrd.textContent = activeOrdersCount;

    const kpiAtt = document.getElementById('kpi-attendance');
    if (kpiAtt) kpiAtt.textContent = `${presentStaffCount} / ${staff.length}`;

    const kpiMargin = document.getElementById('kpi-margin');
    if (kpiMargin) kpiMargin.textContent = `${profitMargin}%`;

    const kpiTax = document.getElementById('kpi-tax');
    if (kpiTax) kpiTax.textContent = `$${Math.round(estimatedTax).toLocaleString('en-US')}`;

    // Render Recent Orders in Dashboard
    const recentOrdersContainer = document.getElementById('dashboard-recent-orders-table');
    if (recentOrdersContainer) {
      recentOrdersContainer.innerHTML = orders.slice(0, 4).map(o => `
        <tr>
          <td><strong style="color: #ffffff;">#${o.id}</strong></td>
          <td>${o.customer}</td>
          <td>${o.items}</td>
          <td><strong style="color: #ffffff;">$${o.total}</strong></td>
          <td><span class="status-badge ${o.status}">${o.status.toUpperCase()}</span></td>
        </tr>
      `).join('');
    }

    // Render Top Inventory Alert Items
    const topInvContainer = document.getElementById('dashboard-top-inventory-table');
    if (topInvContainer) {
      topInvContainer.innerHTML = products.slice(0, 4).map(p => `
        <tr>
          <td><strong style="color: #ffffff;">${p.title}</strong></td>
          <td>${p.category.toUpperCase()}</td>
          <td>${p.stock} units</td>
          <td><span class="status-badge ${p.stock < 20 ? 'lowstock' : 'instock'}">${p.stock < 20 ? 'LOW STOCK' : 'OPTIMAL'}</span></td>
        </tr>
      `).join('');
    }
  }

  // Render Inventory Tab
  function renderInventory() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = products.map((p, idx) => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${p.image}" alt="${p.title}" style="width: 38px; height: 38px; border-radius: 3px; object-fit: cover; background: #2a2824;">
            <div>
              <strong style="color: #ffffff; display: block;">${p.title}</strong>
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--admin-text-muted);">SKU: AO-${p.category.substring(0, 3).toUpperCase()}-${idx + 101}</span>
            </div>
          </div>
        </td>
        <td><span style="font-family: var(--font-mono); text-transform: uppercase;">${p.category}</span></td>
        <td><strong style="color: #ffffff; font-family: var(--font-mono);">$${p.price}</strong></td>
        <td><span style="font-family: var(--font-mono); color: var(--admin-text-muted);">$${p.cogs || Math.round(p.price * 0.35)}</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button type="button" class="btn-att" onclick="window.adjustStock('${p.id}', -1)">-</button>
            <strong style="font-family: var(--font-mono); color: #ffffff; min-width: 28px; text-align: center;">${p.stock}</strong>
            <button type="button" class="btn-att" onclick="window.adjustStock('${p.id}', 1)">+</button>
          </div>
        </td>
        <td>
          <span class="status-badge ${p.stock < 15 ? 'lowstock' : 'instock'}">
            ${p.stock < 15 ? 'LOW INVENTORY' : 'IN STOCK'}
          </span>
        </td>
        <td>
          <button type="button" class="btn-att" style="color: var(--admin-accent-rose);" onclick="window.deleteProduct('${p.id}')">REMOVE</button>
        </td>
      </tr>
    `).join('');
  }

  // Stock Adjustment
  window.adjustStock = function (productId, delta) {
    const item = products.find(p => p.id === productId);
    if (item) {
      item.stock = Math.max(0, item.stock + delta);
      saveProducts();
      renderInventory();
      renderDashboard();
    }
  };

  // Delete Product
  window.deleteProduct = function (productId) {
    if (confirm('Confirm removal of garment SKU from active enterprise catalog?')) {
      products = products.filter(p => p.id !== productId);
      saveProducts();
      renderInventory();
      renderDashboard();
    }
  };

  // Add Product Modal
  const addProductModal = document.getElementById('add-product-modal');
  window.openAddProductModal = function () {
    if (addProductModal) addProductModal.classList.add('open');
  };
  window.closeAddProductModal = function () {
    if (addProductModal) addProductModal.classList.remove('open');
  };

  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('prod-title').value.trim();
      const category = document.getElementById('prod-category').value;
      const price = parseFloat(document.getElementById('prod-price').value) || 200;
      const stock = parseInt(document.getElementById('prod-stock').value, 10) || 20;
      const cogs = parseFloat(document.getElementById('prod-cogs').value) || Math.round(price * 0.35);
      const imgUrl = document.getElementById('prod-img').value.trim() || 'assets/images/garment-hoodie-oatmeal.jpg';

      const newId = 'custom-' + Date.now();
      const newGarment = {
        id: newId,
        title: title,
        category: category,
        price: price,
        stock: stock,
        cogs: cogs,
        image: imgUrl,
        badge: 'NEW ARRIVAL // ATELIER',
        status: 'instock'
      };

      products.unshift(newGarment);
      saveProducts();
      renderInventory();
      renderDashboard();
      window.closeAddProductModal();
      addProductForm.reset();
      alert(`Garment "${title}" successfully integrated into production catalog.`);
    });
  }

  // Render Orders Tab
  function renderOrders() {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = orders.map(o => `
      <tr>
        <td><strong style="color: #ffffff; font-family: var(--font-mono);">#${o.id}</strong></td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: #ffffff;">${o.customer}</strong>
            <span style="font-size: 0.68rem; color: var(--admin-text-muted);">${o.email}</span>
          </div>
        </td>
        <td>${o.items}</td>
        <td><strong style="color: #ffffff; font-family: var(--font-mono);">$${o.total}</strong></td>
        <td style="font-size: 0.72rem; color: var(--admin-text-secondary);">${o.destination}</td>
        <td>
          <select class="admin-select" style="padding: 0.35rem 0.5rem; font-size: 0.7rem;" onchange="window.updateOrderStatus('${o.id}', this.value)">
            <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>In Production</option>
            <option value="dispatched" ${o.status === 'dispatched' ? 'selected' : ''}>Dispatched Airfreight</option>
            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td><span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--admin-text-muted);">${o.date}</span></td>
      </tr>
    `).join('');
  }

  window.updateOrderStatus = function (orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      saveOrders();
      renderOrders();
      renderDashboard();
    }
  };

  // Render Attendance Tab
  function renderAttendance() {
    const tableBody = document.getElementById('attendance-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = staff.map(s => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #262a34; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-weight: 700; color: var(--admin-accent-gold);">
              ${s.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <strong style="color: #ffffff; display: block;">${s.name}</strong>
              <span style="font-size: 0.68rem; color: var(--admin-text-muted);">${s.role}</span>
            </div>
          </div>
        </td>
        <td><span style="font-family: var(--font-mono); font-size: 0.72rem;">${s.department}</span></td>
        <td>
          <span class="status-badge ${s.attendance}">
            ${s.attendance.toUpperCase()}
          </span>
        </td>
        <td><span style="font-family: var(--font-mono);">${s.punchIn}</span></td>
        <td><span style="font-family: var(--font-mono);">${s.punchOut}</span></td>
        <td>
          <div class="attendance-toggle-group">
            <button type="button" class="btn-att ${s.attendance === 'present' ? 'active-present' : ''}" onclick="window.markAttendance('${s.id}', 'present')">P</button>
            <button type="button" class="btn-att ${s.attendance === 'late' ? 'active-late' : ''}" onclick="window.markAttendance('${s.id}', 'late')">L</button>
            <button type="button" class="btn-att ${s.attendance === 'absent' ? 'active-absent' : ''}" onclick="window.markAttendance('${s.id}', 'absent')">A</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.markAttendance = function (staffId, newStatus) {
    const member = staff.find(s => s.id === staffId);
    if (member) {
      member.attendance = newStatus;
      if (newStatus === 'present' && member.punchIn === '--') {
        const now = new Date();
        member.punchIn = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      saveStaff();
      renderAttendance();
      renderDashboard();
    }
  };

  // Render Payroll Tab
  function renderPayroll() {
    const tableBody = document.getElementById('payroll-table-body');
    if (!tableBody) return;

    let totalPayrollOutflow = 0;

    tableBody.innerHTML = staff.map(s => {
      const netPayable = s.baseSalary + s.overtime - s.deductions;
      totalPayrollOutflow += netPayable;

      return `
        <tr>
          <td>
            <strong style="color: #ffffff; display: block;">${s.name}</strong>
            <span style="font-size: 0.68rem; color: var(--admin-text-muted); font-family: var(--font-mono);">${s.role}</span>
          </td>
          <td><span style="font-family: var(--font-mono);">₹${s.baseSalary.toLocaleString('en-IN')}</span></td>
          <td><span style="font-family: var(--font-mono); color: var(--admin-accent-emerald);">+₹${s.overtime.toLocaleString('en-IN')}</span></td>
          <td><span style="font-family: var(--font-mono); color: var(--admin-accent-rose);">-₹${s.deductions.toLocaleString('en-IN')}</span></td>
          <td><strong style="color: #ffffff; font-family: var(--font-mono); font-size: 0.85rem;">₹${netPayable.toLocaleString('en-IN')}</strong></td>
          <td>
            <button type="button" class="btn-att" onclick="window.viewPayslip('${s.id}')">PAYSLIP</button>
          </td>
        </tr>
      `;
    }).join('');

    const totalOutflowEl = document.getElementById('total-payroll-outflow');
    if (totalOutflowEl) totalOutflowEl.textContent = `₹${totalPayrollOutflow.toLocaleString('en-IN')}`;
  }

  window.viewPayslip = function (staffId) {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;
    const net = member.baseSalary + member.overtime - member.deductions;
    alert(
      `==========================================\n` +
      `       ATELIER ORA // SALARY VOUCHER      \n` +
      `==========================================\n` +
      `Employee Name: ${member.name}\n` +
      `Designation:   ${member.role}\n` +
      `Department:    ${member.department}\n` +
      `Pay Period:    September 2026\n` +
      `------------------------------------------\n` +
      `Base Pay:      ₹${member.baseSalary.toLocaleString('en-IN')}\n` +
      `Overtime / OT: ₹${member.overtime.toLocaleString('en-IN')}\n` +
      `TDS / Deduct: -₹${member.deductions.toLocaleString('en-IN')}\n` +
      `------------------------------------------\n` +
      `NET PAYABLE:   ₹${net.toLocaleString('en-IN')}\n` +
      `==========================================\n` +
      `Authorized by: Mobpie, Atelier Director`
    );
  };

  window.disbursePayroll = function () {
    alert('Enterprise Direct Bank Transfer initiated for 5 team members. Transaction references dispatched.');
  };

  // Render Financials & Taxes Tab
  function renderFinancials() {
    const totalGrossRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
    const totalCOGS = orders.reduce((acc, o) => acc + (o.total * 0.35), 0);
    const grossProfit = totalGrossRevenue - totalCOGS;

    // Converted to USD
    const staffPayrollUSD = 6800; // equivalent of INR salaries in USD
    const studioRentLogistics = 2400;
    const operatingExpenses = staffPayrollUSD + studioRentLogistics;

    const operatingProfit = grossProfit - operatingExpenses;
    const taxLiability = totalGrossRevenue * 0.18; // 18% GST / luxury standard
    const inputCredit = totalCOGS * 0.12; // Input tax credit
    const netTaxPayable = Math.max(0, taxLiability - inputCredit);
    const finalNetProfit = operatingProfit - netTaxPayable;

    // DOM Updates
    const elRev = document.getElementById('pnl-gross-rev');
    if (elRev) elRev.textContent = `$${totalGrossRevenue.toLocaleString('en-US')}`;

    const elCogs = document.getElementById('pnl-cogs');
    if (elCogs) elCogs.textContent = `-$${totalCOGS.toLocaleString('en-US')}`;

    const elGrossProfit = document.getElementById('pnl-gross-profit');
    if (elGrossProfit) elGrossProfit.textContent = `$${grossProfit.toLocaleString('en-US')}`;

    const elOpex = document.getElementById('pnl-opex');
    if (elOpex) elOpex.textContent = `-$${operatingExpenses.toLocaleString('en-US')}`;

    const elNet = document.getElementById('pnl-net-profit');
    if (elNet) elNet.textContent = `$${finalNetProfit.toLocaleString('en-US')}`;

    const elTaxGross = document.getElementById('tax-gross-collected');
    if (elTaxGross) elTaxGross.textContent = `$${taxLiability.toFixed(2)}`;

    const elTaxCredit = document.getElementById('tax-input-credit');
    if (elTaxCredit) elTaxCredit.textContent = `-$${inputCredit.toFixed(2)}`;

    const elTaxNet = document.getElementById('tax-net-payable');
    if (elTaxNet) elTaxNet.textContent = `$${netTaxPayable.toFixed(2)}`;
  }

  // Initial Boot
  function init() {
    loadData();
    initClock();
    initTabs();
    renderDashboard();
    renderInventory();
    renderOrders();
    renderAttendance();
    renderPayroll();
    renderFinancials();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
