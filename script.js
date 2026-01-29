const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const daily_spend = document.getElementById('daily-spend');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const dateInput = document.getElementById('date');
const clearBtn = document.getElementById('clear-btn');


const expenseChart = document.getElementById('expense-chart');
const chartLegend = document.getElementById('chart-legend');
const savingsGoalInput = document.getElementById('savings-goal');
const savingsProgress = document.getElementById('savings-progress');
const savingsText = document.getElementById('savings-text');
const currencySelector = document.getElementById('currency-selector');


const categoryColors = {
    'Food': '#f87171',
    'Housing': '#3b82f6',
    'Transport': '#eab308',
    'Entertainment': '#a855f7',
    'Shopping': '#ec4899',
    'Other': '#64748b',
    'Income': '#34d399'
};

const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥'
};

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let savingsGoal = localStorage.getItem('savingsGoal') || 1000;
let currentCurrency = localStorage.getItem('currency') || 'USD';


savingsGoalInput.value = savingsGoal;
currencySelector.value = currentCurrency;


const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

function formatMoney(amount) {
    const symbol = currencySymbols[currentCurrency];
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
}

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    const txnAmount = +amount.value;
    const txnCategory = txnAmount > 0 ? 'Income' : category.value;
    const txnDate = dateInput.value || today;

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: txnAmount,
        category: txnCategory,
        date: txnDate
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
    dateInput.value = today;
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const catColor = categoryColors[transaction.category] || categoryColors['Other'];

    const item = document.createElement('li');

    item.innerHTML = `
    <div class="txn-info">
        <span>${transaction.text}</span>
        <div class="txn-meta">
            <span style="color: ${catColor}">${transaction.category}</span>
            <span>${transaction.date || 'No Date'}</span>
        </div>
    </div> 
    <div class="txn-amount">
        <span class="${transaction.amount < 0 ? 'money minus' : 'money plus'}">
            ${sign}${formatMoney(transaction.amount)}
        </span>
        <button class="delete-btn" data-id="${transaction.id}">&times;</button>
    </div>
  `;


    list.appendChild(item);
}

list.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = +e.target.getAttribute('data-id');
        removeTransaction(id);
    }
});

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);

    const currentTotalDate = new Date().toISOString().split('T')[0];
    const dailyTotal = transactions
        .filter(t => t.amount < 0 && (t.date === currentTotalDate))
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    balance.innerText = `${total < 0 ? '-' : ''}${formatMoney(total)}`;
    money_plus.innerText = `+${formatMoney(income)}`;
    money_minus.innerText = `-${formatMoney(expense)}`;
    daily_spend.innerText = `-${formatMoney(dailyTotal)}`;

    updateSavings(total);
    renderChart();
}

function updateSavings(currentBalance) {
    const goal = +savingsGoalInput.value;
    if (goal <= 0) {
        savingsProgress.style.width = '0%';
        savingsText.innerText = 'Set a goal';
        return;
    }

    const progress = Math.max(0, Math.min(100, (currentBalance / goal) * 100));
    savingsProgress.style.width = `${progress}%`;
    savingsText.innerText = `${progress.toFixed(1)}% reached (${formatMoney(currentBalance)} / ${formatMoney(goal)})`;
}

function renderChart() {
    const expenses = transactions.filter(t => t.amount < 0);
    if (expenses.length === 0) {
        expenseChart.style.background = 'conic-gradient(rgba(255,255,255,0.05) 0% 100%)';
        chartLegend.innerHTML = '<span class="legend-item">No expenses yet</span>';
        return;
    }

    const totalsByCategory = {};
    let totalExpense = 0;

    expenses.forEach(t => {
        const cat = t.category || 'Other';
        const amt = Math.abs(t.amount);
        totalsByCategory[cat] = (totalsByCategory[cat] || 0) + amt;
        totalExpense += amt;
    });

    let currentDeg = 0;
    let gradientParts = [];
    let legendHTML = '';

    for (const [cat, amt] of Object.entries(totalsByCategory)) {
        const percent = (amt / totalExpense) * 100;
        const deg = (percent / 100) * 360;
        const color = categoryColors[cat] || categoryColors['Other'];

        gradientParts.push(`${color} ${currentDeg}deg ${currentDeg + deg}deg`);
        currentDeg += deg;

        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background: ${color}"></div>
                <span>${cat} ${Math.round(percent)}%</span>
            </div>
        `;
    }

    expenseChart.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    chartLegend.innerHTML = legendHTML;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function clearAll() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        transactions = [];
        updateLocalStorage();
        init();
    }
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('savingsGoal', savingsGoalInput.value);
    localStorage.setItem('currency', currencySelector.value);
}


form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearAll);

savingsGoalInput.addEventListener('input', () => {
    updateLocalStorage();
    updateValues();
});

currencySelector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updateLocalStorage();
    init();
});

function init() {
    list.innerHTML = '';
    const now = new Date().toISOString().split('T')[0];

    transactions.forEach(t => {
        if (!t.category) t.category = t.amount > 0 ? 'Income' : 'Other';
        if (!t.date) t.date = now;
    });

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
