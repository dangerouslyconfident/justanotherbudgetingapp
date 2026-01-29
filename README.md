# POCKETDEPTH - Budget Tracker

## Description
PocketDepth is a personal finance application designed to help you track your income and expenses efficiently. It allows you to monitor your total balance, analyze your spending habits through visual charts, and track your progress towards savings goals. All data is stored locally in your browser, ensuring privacy and persistence.

## Features
- Dashboard with Real-time Balance
- Income and Expense Tracking
- Daily Spending Tracker
- Savings Goal Progress Bar
- Expenses Pie Chart Visualizer
- Multi-currency Support (USD, EUR, GBP, INR, JPY)
- Transaction History with Delete Option
- Local Storage Data Persistence
- Responsive Design

## How to Use

### Opening the Application
To start the application, simply open the index.html file in any modern web browser. No installation or server is required.

### Adding a Transaction
1. Locate the "Add Transaction" panel on the bottom right.
2. Enter a description for the transaction.
3. Enter the amount. Use a positive number for income and a negative number for expenses. Alternatively, you can select "Expense" categories which will be treated as negative values if you enter a negative number.
4. Select the date and category.
5. Click "Add Transaction".

### Managing Savings Goals
1. In the "Savings Goal" panel, enter your target amount in the input field.
2. The progress bar will automatically update to show your progress percentage based on your current total balance.

### Changing Currency
Use the dropdown menu in the top right corner to switch between different currencies. The application will update all displayed amounts to the selected currency symbol.

### Deleting Transactions
To remove a specific transaction, find it in the "Transaction History" list and click the "X" button next to it.

### Resetting Data
To clear all data and start fresh, click the "Clear All" button in the "Transaction History" panel. This action is permanent.

## Local Deployment
For a better experience or to test on other devices on your network, you can run a local server.

### Using Python
If you have Python installed:
1. Open a terminal in the project folder.
2. Run the command: python -m http.server
3. Open your browser to: http://localhost:8000

### Using Node.js
If you have Node.js installed:
1. Install the serve package: npm install -g serve
2. Run the command: serve .
3. Open your browser to the URL shown (usually http://localhost:3000).

## Technical Details
This project is built using:
- HTML5
- CSS3 (Vanilla CSS with Variables and Flexbox/Grid)
- JavaScript (Vanilla JS, no external libraries)
