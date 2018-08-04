var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    startBamazon();
});

function startBamazon() {
    inquirer.prompt([
    {
        name: "display",
        type: "confirm",
        message: "Would you like to view inventory?"
    }
    ]).then(function(answer) {
        if (answer.display === true) {
            displayInventory();
        } else {
            shopBamazon();
        }
    })
}

function shopBamazon() {
    inquirer.prompt([
    {
        name: "productID",
        type: "input",
        message: "What is the product ID number?",
        validate: function(value) {
            if (isNaN(value) === false) {
            return true;
            }
            return false;
        }
    }, {
        name: "amount",
        type: "input",
        message: "How many units would you like to buy?",
        validate: function(value) {
            if (isNaN(value) === false) {
            return true;
            }
            return false;
        }
    }
    ]).then(function(answer) {
        var productID = answer.productID;
        var productAmount = answer.amount;

        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer.productID }, function(err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                console.log("Please enter a valid ID\nRefer to the inventory list");
                console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                startBamazon();
            } else {
                var productRes = res[0];
                if (productAmount <= productRes.stock_quantity) {
                    console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                    console.log("Good news! Your item is in stock!");
                    var updateQuery = "UPDATE products SET stock_quantity = " + (productRes.stock_quantity - productAmount) + " WHERE item_id = " + productID;
                    connection.query(updateQuery, function(err, data) {
                        if (err) throw err;
                        console.log("You ordered " + productAmount + " of product: " + productRes.product_name)
						console.log("Your total is $" + productRes.price * productAmount);
						console.log("Thank you for shopping with us!");
						console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                        inquirer.prompt([
                        {
                            name: "display",
                            type: "confirm",
                            message: "Would you like to continue shopping?"
                        }
                        ]).then(function(answer) {
                            if (answer.display === true) {
                                startBamazon();
                            } else {
                                // End the database connection
						        connection.end();
                            }
                        })
					})
                } else {
                    console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                    console.log("We apologize for the inconvenience, but we currently have " + productRes.stock_quantity + " of that item in stock.");
                    console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                    startBamazon();
                }
            }
        });
    });
}

function displayInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        console.log("\n-------------------------------------------------------------------------------------------------------------\n");
        for (var i = 0; i < res.length; i++) {
            if (err) throw err;
            console.log(
                "Product ID: " +
                res[i].item_id +
                " || Product Name: " +
                res[i].product_name +
                " || Department Name: " +
                res[i].department_name +
                " || Price: $" +
                res[i].price +
                " || Stock: " +
                res[i].stock_quantity
            );
        }
        console.log("\n-------------------------------------------------------------------------------------------------------------\n");
        shopBamazon();
    });
}