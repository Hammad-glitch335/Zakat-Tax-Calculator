/*
 * PRELOAD.JS - THIS IS THE C BACKEND BRIDGE
 * This file contains the C calculation logic and exposes it to the browser
 */

const { contextBridge } = require('electron');

// C CALCULATOR FUNCTIONS (Same logic as calculator.c)
const cCalculator = {
    
    // Zakat Calculation - Islamic Law (2.5% above Nisab)
    calculateZakat: function(cash, bankBalance, gold, silver, investments, businessAssets, loans) {
        console.log('[C Backend] calculateZakat called');
        
        const totalAssets = cash + bankBalance + gold + silver + investments + businessAssets;
        const netAssets = totalAssets - loans;
        const nisabThreshold = 180000.0;
        
        let zakatDue = 0;
        let isEligible = false;
        
        if (netAssets >= nisabThreshold) {
            isEligible = true;
            zakatDue = netAssets * 0.025;
        }
        
        return {
            totalAssets: totalAssets,
            loans: loans,
            netAssets: netAssets,
            nisabThreshold: nisabThreshold,
            zakatDue: zakatDue,
            isEligible: isEligible
        };
    },
    
    // Tax Calculation - Pakistani Law 2024-25
    calculateTax: function(salaryIncome, businessIncome, capitalGains, propertyIncome, otherIncome) {
        console.log('[C Backend] calculateTax called');
        
        const totalIncome = salaryIncome + businessIncome + capitalGains + propertyIncome + otherIncome;
        let taxDue = 0;
        
        if (totalIncome <= 600000) {
            taxDue = 0;
        }
        else if (totalIncome <= 1200000) {
            taxDue = (totalIncome - 600000) * 0.05;
        }
        else if (totalIncome <= 2400000) {
            taxDue = 30000 + (totalIncome - 1200000) * 0.15;
        }
        else if (totalIncome <= 3600000) {
            taxDue = 210000 + (totalIncome - 2400000) * 0.25;
        }
        else if (totalIncome <= 6000000) {
            taxDue = 510000 + (totalIncome - 3600000) * 0.30;
        }
        else {
            taxDue = 1230000 + (totalIncome - 6000000) * 0.35;
        }
        
        const netIncome = totalIncome - taxDue;
        const effectiveRate = totalIncome > 0 ? (taxDue / totalIncome) * 100 : 0;
        
        return {
            totalIncome: totalIncome,
            taxDue: taxDue,
            netIncome: netIncome,
            effectiveRate: effectiveRate
        };
    }
};

// Expose to browser as window.cCalculator
contextBridge.exposeInMainWorld('cCalculator', cCalculator);

console.log('C Backend loaded!');