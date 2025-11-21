/*
 * ZAKAT & TAX CALCULATOR - JAVASCRIPT FRONTEND
 * All CALCULATIONS are done in C (via preload.js)
 */

let cBackend = null;

function initCBackend() {
    try {
        if (window.cCalculator) {
            cBackend = window.cCalculator;
            updateBackendStatus(true);
            console.log('C Backend connected!');
            return true;
        }
    } catch (e) {
        console.log('C Backend not available:', e);
    }
    updateBackendStatus(false);
    return false;
}

function updateBackendStatus(connected) {
    const statusEl = document.getElementById('backendStatus');
    const textEl = statusEl.querySelector('.status-text');
    
    if (connected) {
        statusEl.classList.add('connected');
        textEl.textContent = 'C Backend Connected ✓';
    } else {
        statusEl.classList.remove('connected');
        textEl.textContent = 'Using JavaScript (C not loaded)';
    }
}

window.addEventListener('DOMContentLoaded', initCBackend);

// Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle');
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');

const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        localStorage.setItem('darkMode', 'disabled');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
});

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const zakatSection = document.getElementById('zakatSection');
const taxSection = document.getElementById('taxSection');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (tab === 'zakat') {
            zakatSection.classList.add('active');
            taxSection.classList.remove('active');
        } else {
            taxSection.classList.add('active');
            zakatSection.classList.remove('active');
        }
    });
});

// Zakat Calculator
const zakatForm = document.getElementById('zakatForm');
const zakatResults = document.getElementById('zakatResults');

zakatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cash = parseFloat(document.getElementById('cash').value) || 0;
    const bankBalance = parseFloat(document.getElementById('bankBalance').value) || 0;
    const gold = parseFloat(document.getElementById('gold').value) || 0;
    const silver = parseFloat(document.getElementById('silver').value) || 0;
    const investments = parseFloat(document.getElementById('investments').value) || 0;
    const businessAssets = parseFloat(document.getElementById('businessAssets').value) || 0;
    const loans = parseFloat(document.getElementById('loans').value) || 0;
    
    const result = calculateZakatUsingC(cash, bankBalance, gold, silver, investments, businessAssets, loans);
    displayZakatResults(result);
});

function calculateZakatUsingC(cash, bankBalance, gold, silver, investments, businessAssets, loans) {
    if (cBackend && cBackend.calculateZakat) {
        console.log('Calculating Zakat using C...');
        return cBackend.calculateZakat(cash, bankBalance, gold, silver, investments, businessAssets, loans);
    }
    
    // Fallback JavaScript
    const totalAssets = cash + bankBalance + gold + silver + investments + businessAssets;
    const netAssets = totalAssets - loans;
    const nisabThreshold = 180000;
    let zakatDue = 0;
    let isEligible = false;
    
    if (netAssets >= nisabThreshold) {
        isEligible = true;
        zakatDue = netAssets * 0.025;
    }
    
    return { totalAssets, loans, netAssets, nisabThreshold, zakatDue, isEligible };
}

// Tax Calculator
const taxForm = document.getElementById('taxForm');
const taxResults = document.getElementById('taxResults');

taxForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const salaryIncome = parseFloat(document.getElementById('salaryIncome').value) || 0;
    const businessIncome = parseFloat(document.getElementById('businessIncome').value) || 0;
    const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 0;
    const propertyIncome = parseFloat(document.getElementById('propertyIncome').value) || 0;
    const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
    
    const result = calculateTaxUsingC(salaryIncome, businessIncome, capitalGains, propertyIncome, otherIncome);
    displayTaxResults(result);
});

function calculateTaxUsingC(salaryIncome, businessIncome, capitalGains, propertyIncome, otherIncome) {
    if (cBackend && cBackend.calculateTax) {
        console.log('Calculating Tax using C...');
        return cBackend.calculateTax(salaryIncome, businessIncome, capitalGains, propertyIncome, otherIncome);
    }
    
    // Fallback JavaScript
    const totalIncome = salaryIncome + businessIncome + capitalGains + propertyIncome + otherIncome;
    let taxDue = 0;
    
    if (totalIncome <= 600000) taxDue = 0;
    else if (totalIncome <= 1200000) taxDue = (totalIncome - 600000) * 0.05;
    else if (totalIncome <= 2400000) taxDue = 30000 + (totalIncome - 1200000) * 0.15;
    else if (totalIncome <= 3600000) taxDue = 210000 + (totalIncome - 2400000) * 0.25;
    else if (totalIncome <= 6000000) taxDue = 510000 + (totalIncome - 3600000) * 0.30;
    else taxDue = 1230000 + (totalIncome - 6000000) * 0.35;
    
    const netIncome = totalIncome - taxDue;
    const effectiveRate = totalIncome > 0 ? (taxDue / totalIncome) * 100 : 0;
    
    return { totalIncome, taxDue, netIncome, effectiveRate };
}

// Display Functions
function displayZakatResults(result) {
    const backend = cBackend ? 'C Backend' : 'JavaScript';
    
    zakatResults.innerHTML = `
        <div class="c-badge">Calculated by ${backend}</div>
        
        <div class="result-box primary">
            <p class="result-label">Total Assets</p>
            <p class="result-value">PKR ${formatNumber(result.totalAssets)}</p>
        </div>
        
        <div class="result-box secondary">
            <p class="result-label">Deductible Loans</p>
            <p class="result-value">PKR ${formatNumber(result.loans)}</p>
        </div>
        
        <div class="result-box tertiary">
            <p class="result-label">Net Zakatable Assets</p>
            <p class="result-value">PKR ${formatNumber(result.netAssets)}</p>
        </div>
        
        <div class="result-box quaternary">
            <p class="result-label">Nisab Threshold</p>
            <p class="result-value">PKR ${formatNumber(result.nisabThreshold)}</p>
        </div>
        
        ${result.isEligible ? `
            <div class="result-box highlight">
                <p class="result-label">Your Zakat Due (2.5%)</p>
                <p class="result-value">PKR ${formatNumber(result.zakatDue)}</p>
            </div>
            <div class="result-box success">
                <p class="success-message">✓ You are eligible to pay Zakat as your assets exceed the Nisab threshold.</p>
            </div>
        ` : `
            <div class="result-box secondary">
                <p class="success-message" style="color: var(--text-secondary);">Your assets are below the Nisab threshold. Zakat is not obligatory at this time.</p>
            </div>
        `}
        
        <div class="result-box tertiary">
            <p class="info-note"><strong>Note:</strong> Zakat is calculated at 2.5% on wealth held for one lunar year above the Nisab threshold.</p>
        </div>
    `;
}

function displayTaxResults(result) {
    const backend = cBackend ? 'C Backend' : 'JavaScript';
    
    taxResults.innerHTML = `
        <div class="c-badge">Calculated by ${backend}</div>
        
        <div class="result-box tertiary">
            <p class="result-label">Total Annual Income</p>
            <p class="result-value">PKR ${formatNumber(result.totalIncome)}</p>
        </div>
        
        <div class="result-box highlight-tax">
            <p class="result-label">Total Tax Due</p>
            <p class="result-value">PKR ${formatNumber(result.taxDue)}</p>
        </div>
        
        <div class="result-box primary">
            <p class="result-label">Net Income After Tax</p>
            <p class="result-value">PKR ${formatNumber(result.netIncome)}</p>
        </div>
        
        <div class="result-box quaternary">
            <p class="result-label">Effective Tax Rate</p>
            <p class="result-value">${result.effectiveRate.toFixed(2)}%</p>
        </div>
        
        <div class="result-box secondary">
            <p class="result-label" style="margin-bottom: 0.75rem; font-weight: 600;">Pakistan Tax Slabs 2024-25</p>
            <div class="tax-slabs">
                <div class="tax-slab-row"><span>Up to PKR 600,000</span><span class="tax-slab-rate">0%</span></div>
                <div class="tax-slab-row"><span>PKR 600,001 - 1,200,000</span><span class="tax-slab-rate">5%</span></div>
                <div class="tax-slab-row"><span>PKR 1,200,001 - 2,400,000</span><span class="tax-slab-rate">15%</span></div>
                <div class="tax-slab-row"><span>PKR 2,400,001 - 3,600,000</span><span class="tax-slab-rate">25%</span></div>
                <div class="tax-slab-row"><span>PKR 3,600,001 - 6,000,000</span><span class="tax-slab-rate">30%</span></div>
                <div class="tax-slab-row"><span>Above PKR 6,000,000</span><span class="tax-slab-rate">35%</span></div>
            </div>
        </div>
    `;
}

function formatNumber(num) {
    return num.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}