# Bamazon
## Description
This application implements a simple command line based storefront using the npm inquirer package and the MySQL database backend together with the npm mysql package. The application presents two interfaces: **customer** and **manager**.

## bamazonCustomer.js
- Prompt the user if they would like to view the inventory first.
  - If yes, all products are displayed.
  - If no, the next prompt will display.
- The user will be asked for the ID of the product and how many of that product they would like.
- The order will be displayed as follows.
   - Confirms it is in stock.
   - Quanity ordered.
   - Total price.
   - A thank you message.
- The user is then asked to continue shopping or exit.


![Gif customer-buy-product](/images/customer-buy-product.gif)


## bamazonManager.js
- Prompt the user what they would like to do.
  - **View Products for Sale**
    - This will display everything presently in the databse.
  - **View Low Inventory**
    - If there aren't any products with less than 5, it will say "Inventory for all products is good!"
  - **Add to Inventory**
    - The user will be asked for the ID of the product and how many of that product they would like.
  - **Add New Product**
    - The user will be asked what the name is, the department, price, and quantity of the product.
    - An ID will be automatically assigned.
  - **Exit**
    - This will terminate the program, otherwise it will display the menu again after each function is run.


![Gif manager-run-all](/images/manager-run-all.gif)

## After Running
After running either _bamazonCustomer.js_ or _bamazonManager.js_ the _**bamazon**_ database will be updated. It displays in workbench when refreshed.
