#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// ---------- COLORS ----------
#define RESET   "\033[0m"
#define RED     "\033[1;31m"
#define GREEN   "\033[1;32m"
#define YELLOW  "\033[1;33m"
#define BLUE    "\033[1;34m"
#define CYAN    "\033[1;36m"
#define MAGENTA "\033[1;35m"
#define WHITE   "\033[1;37m"

// ---------- STRUCTS ----------
typedef struct {
    double totalAssets;
    double loans;
    double netAssets;
    double nisabThreshold;
    double zakatDue;
    int isEligible;
} ZakatResult;

typedef struct {
    double totalIncome;
    double taxDue;
    double netIncome;
    double effectiveRate;
} TaxResult;

// ---------- UTILS ----------
void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void pauseScreen() {
    printf(YELLOW "\nPress ENTER to continue..." RESET);
    getchar();
}

void loadingAnimation(const char *msg) {
    printf(CYAN "\n%s" RESET, msg);
    fflush(stdout);
	int i=0;
    for (i = 0; i < 3; i++) {
        printf(".");
        fflush(stdout);
        usleep(400000);
    }
    printf("\n");
}

// ---------- FILE SAVE ----------
void saveToFile(const char *filename, const char *content) {
    FILE *f = fopen(filename, "a");
    if (f == NULL) {
        printf(RED "Error: Could not save file.\n" RESET);
        return;
    }
    fprintf(f, "%s\n\n", content);
    fclose(f);
    printf(GREEN "\nSaved to '%s' successfully!\n" RESET, filename);
}

// ---------- CALCULATIONS ----------
ZakatResult calculateZakat(double cash, double bankBalance, double gold,
                           double silver, double investments, double businessAssets,
                           double loans) {
    ZakatResult result;

    result.totalAssets = cash + bankBalance + gold + silver +
                         investments + businessAssets;

    result.loans = loans;
    result.netAssets = result.totalAssets - loans;
    result.nisabThreshold = 180000.0;

    if (result.netAssets >= result.nisabThreshold) {
        result.isEligible = 1;
        result.zakatDue = result.netAssets * 0.025;
    } else {
        result.isEligible = 0;
        result.zakatDue = 0.0;
    }

    return result;
}

TaxResult calculateTax(double salaryIncome, double businessIncome,
                       double capitalGains, double propertyIncome,
                       double otherIncome) {
    TaxResult result;

    result.totalIncome = salaryIncome + businessIncome +
                         capitalGains + propertyIncome + otherIncome;

    double income = result.totalIncome;

    if (income <= 600000) {
        result.taxDue = 0;
    } else if (income <= 1200000) {
        result.taxDue = (income - 600000) * 0.05;
    } else if (income <= 2400000) {
        result.taxDue = 30000 + (income - 1200000) * 0.15;
    } else if (income <= 3600000) {
        result.taxDue = 210000 + (income - 2400000) * 0.25;
    } else if (income <= 6000000) {
        result.taxDue = 510000 + (income - 3600000) * 0.30;
    } else {
        result.taxDue = 1230000 + (income - 6000000) * 0.35;
    }

    result.netIncome = result.totalIncome - result.taxDue;

    if (result.totalIncome > 0)
        result.effectiveRate = (result.taxDue / result.totalIncome) * 100.0;
    else
        result.effectiveRate = 0;

    return result;
}

// ---------- PRINTERS ----------
void printZakatResult(ZakatResult r) {
    printf(GREEN "\n========== ZAKAT CALCULATION ==========\n" RESET);

    printf(WHITE "Total Assets:        PKR %.2f\n", r.totalAssets);
    printf("Loans:               PKR %.2f\n", r.loans);
    printf("Net Assets:          PKR %.2f\n", r.netAssets);
    printf("Nisab Threshold:     PKR %.2f\n", r.nisabThreshold);
    printf("---------------------------------------\n");

    if (r.isEligible) {
        printf(GREEN "Status: ELIGIBLE\n" RESET);
        printf(YELLOW "Zakat Due (2.5%%):    PKR %.2f\n" RESET, r.zakatDue);
    } else {
        printf(RED "Status: NOT ELIGIBLE\n" RESET);
        printf(YELLOW "Zakat Due:           PKR 0.00\n" RESET);
    }
}

void printTaxResult(TaxResult r) {
    printf(GREEN "\n========== TAX CALCULATION ==========\n" RESET);

    printf(WHITE "Total Income:        PKR %.2f\n", r.totalIncome);
    printf("Tax Due:             PKR %.2f\n", r.taxDue);
    printf("Net Income:          PKR %.2f\n", r.netIncome);
    printf("Effective Rate:      %.2f%%\n", r.effectiveRate);
}

// ---------- MENUS ----------
void zakatMenu() {
    clearScreen();

    double cash, bank, gold, silver, invest, business, loans;

    printf(MAGENTA "\n----- ZAKAT CALCULATOR -----\n\n" RESET);

    printf("Cash: PKR "); scanf("%lf", &cash);
    printf("Bank Balance: PKR "); scanf("%lf", &bank);
    printf("Gold Value: PKR "); scanf("%lf", &gold);
    printf("Silver Value: PKR "); scanf("%lf", &silver);
    printf("Investments: PKR "); scanf("%lf", &invest);
    printf("Business Assets: PKR "); scanf("%lf", &business);
    printf("Loans: PKR "); scanf("%lf", &loans);
    getchar();

    loadingAnimation("Calculating Zakat");

    ZakatResult r = calculateZakat(cash, bank, gold, silver, invest, business, loans);
    printZakatResult(r);

    char buffer[500];
    sprintf(buffer,
        "ZAKAT RESULT:\nTotal Assets: %.2f\nLoans: %.2f\nNet Assets: %.2f\nZakat Due: %.2f",
        r.totalAssets, r.loans, r.netAssets, r.zakatDue);

    printf(CYAN "\nSave result to file? (y/n): " RESET);
    char ch = getchar();
    getchar();

    if (ch == 'y' || ch == 'Y') saveToFile("results.txt", buffer);

    pauseScreen();
}

void taxMenu() {
    clearScreen();

    double salary, business, gains, property, other;

    printf(MAGENTA "\n----- TAX CALCULATOR -----\n\n" RESET);

    printf("Salary Income: PKR "); scanf("%lf", &salary);
    printf("Business Income: PKR "); scanf("%lf", &business);
    printf("Capital Gains: PKR "); scanf("%lf", &gains);
    printf("Property Income: PKR "); scanf("%lf", &property);
    printf("Other Income: PKR "); scanf("%lf", &other);
    getchar();

    loadingAnimation("Calculating Tax");

    TaxResult r = calculateTax(salary, business, gains, property, other);
    printTaxResult(r);

    char buffer[500];
    sprintf(buffer,
        "TAX RESULT:\nTotal Income: %.2f\nTax Due: %.2f\nNet Income: %.2f",
        r.totalIncome, r.taxDue, r.netIncome);

    printf(CYAN "\nSave result to file? (y/n): " RESET);
    char ch = getchar();
    getchar();

    if (ch == 'y' || ch == 'Y') saveToFile("results.txt", buffer);

    pauseScreen();
}

// ---------- MAIN ----------
int main() {
    int choice;

    while (1) {
        clearScreen();
        printf(CYAN "=========================================\n" RESET);
        printf(GREEN "    ZAKAT & TAX CALCULATOR - ADVANCED     \n" RESET);
        printf(CYAN "=========================================\n" RESET);

        printf(YELLOW "1. Calculate Zakat\n" RESET);
        printf(YELLOW "2. Calculate Tax\n" RESET);
        printf(RED "3. Exit\n" RESET);
        printf(WHITE "-----------------------------------------\n" RESET);
        printf(BLUE "Enter your choice: " RESET);

        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1: zakatMenu(); break;
            case 2: taxMenu(); break;
            case 3:
                printf(GREEN "\nThank you for using the Calculator! Goodbye!\n" RESET);
                return 0;
            default:
                printf(RED "Invalid option, try again.\n" RESET);
                pauseScreen();
        }
    }
}

