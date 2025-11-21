/*
 * ZAKAT & TAX CALCULATOR - C BACKEND
 * Pakistani Tax Law 2024-25 & Islamic Zakat Rules
 */

#include <stdio.h>
#include <stdlib.h>

// Zakat result structure
typedef struct {
    double totalAssets;
    double loans;
    double netAssets;
    double nisabThreshold;
    double zakatDue;
    int isEligible;
} ZakatResult;
// making another structure
// Tax result structure
typedef struct {
    double totalIncome;
    double taxDue;
    double netIncome;
    double effectiveRate;
} TaxResult;

/*
 * Calculate Zakat - Islamic Law
 * Rate: 2.5% on wealth above Nisab (PKR 180,000)
 */
ZakatResult calculateZakat(double cash, double bankBalance, double gold,
                           double silver, double investments, double businessAssets,
                           double loans) {
    ZakatResult result;
    
    result.totalAssets = cash + bankBalance + gold + silver + investments + businessAssets;
    result.loans = loans;
    result.netAssets = result.totalAssets - loans;
    //
    result.nisabThreshold = 180000.0;
    
    if (result.netAssets >= result.nisabThreshold) {
        result.isEligible = 1;
        result.zakatDue = result.netAssets * 0.025;
    } else {
        result.isEligible = 0;
        
        //n
        result.zakatDue = 0.0;
    }
    
    return result;
}

/*
 * Calculate Tax - Pakistani Law 2024-25
 * Progressive slabs from 0% to 35%
 */
TaxResult calculateTax(double salaryIncome, double businessIncome,
                       double capitalGains, double propertyIncome,
                       double otherIncome) {
                       	
    TaxResult result;
    
    result.totalIncome = salaryIncome + businessIncome + capitalGains + propertyIncome + otherIncome;
    double income = result.totalIncome;
    
    if (income <= 600000)
        result.taxDue = 0;
    else if (income <= 1200000)
        result.taxDue = (income - 600000) * 0.05;
    else if (income <= 2400000)
        result.taxDue = 30000 + (income - 1200000) * 0.15;
    else if (income <= 3600000)
        result.taxDue = 210000 + (income - 2400000) * 0.25;
    else if (income <= 6000000)
        result.taxDue = 510000 + (income - 3600000) * 0.30;
    else
        result.taxDue = 1230000 + (income - 6000000) * 0.35;
    
    result.netIncome = result.totalIncome - result.taxDue;
    result.effectiveRate = result.totalIncome > 0 ? (result.taxDue / result.totalIncome) * 100.0 : 0.0;
    
    return result;
}

// Print functions for testing
void printZakatResult(ZakatResult r) {
    printf("\n=== ZAKAT CALCULATION ===\n");
    printf("Total Assets:    PKR %.2f\n", r.totalAssets);
    printf("Loans:           PKR %.2f\n", r.loans);
    printf("Net Assets:      PKR %.2f\n", r.netAssets);
    printf("Nisab:           PKR %.2f\n", r.nisabThreshold);
    printf("Eligible:        %s\n", r.isEligible ? "YES" : "NO");
    printf("Zakat Due:       PKR %.2f\n", r.zakatDue);
}

void printTaxResult(TaxResult r) {
    printf("\n=== TAX CALCULATION ===\n");
    printf("Total Income:    PKR %.2f\n", r.totalIncome);
    printf("Tax Due:         PKR %.2f\n", r.taxDue);
    printf("Net Income:      PKR %.2f\n", r.netIncome);
    printf("Effective Rate:  %.2f%%\n", r.effectiveRate);
}

// Main function for testing
int main() {
    printf("*** ZAKAT & TAX CALCULATOR - C BACKEND ***\n");
    
    // Test Zakat
    ZakatResult z = calculateZakat(50000, 150000, 100000, 0, 50000, 0, 20000);
    printZakatResult(z);
    
    // Test Tax
    TaxResult t = calculateTax(1500000, 0, 0, 0, 0);
    printTaxResult(t);
    
    printf("\n*** C BACKEND WORKING! ***\n");
    return 0;
}
