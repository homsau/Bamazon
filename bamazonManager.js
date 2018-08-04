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
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
            viewProducts();
            break;
    
            case "View Low Inventory":
            viewLowInventory();
            break;
    
            case "Add to Inventory":
            addToInventory();
            break;
    
            case "Add New Product":
            addNewProduct();
            break;

            case "Exit":
            connection.end();
            break;
        }
    });
}

function viewProducts() {
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
        startBamazon();
    });
}

function viewLowInventory() {
    // Search for products with 5 or less products in stock
    var query = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(query, function(err, res) {
        console.log("\n-------------------------------------------------------------------------------------------------------------\n");
        // if no products are under 5, print this
        if(res.length === 0) {console.log("Inventory for all products is good!")};
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
        startBamazon();
    });
}

function addToInventory() {
    // Add specified quantity to specified product inventory
    inquirer.prompt([
        {
            name: "productID",
            type: "input",
            message: "What is the product ID number you would like to add inventory to?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }, {
            name: "amount",
            type: "input",
            message: "How many units would you like to add?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }
        ]).then(function(answer) {
            var productID = answer.productID;
            var addedInventory = parseInt(answer.amount);
            var query = "SELECT * FROM products";
            connection.query(query, { item_id: answer.productID }, function(err, res) {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                    console.log("Please enter a valid ID\nRefer to the inventory list");
                    console.log("\n-------------------------------------------------------------------------------------------------------------\n");
                    startBamazon();
                } else {
                    var productRes = res[0];
                    var currentAmount = parseInt(productRes.stock_quantity);
                    var updateQueryStr = "UPDATE products SET stock_quantity = " + (currentAmount + addedInventory) + " WHERE item_id = " + productID;
                    connection.query(updateQueryStr, function(err, data) {
                        if (err) throw err;
                        console.log("Inventory for Item ID " + productID + " has been updated to " + (productRes.stock_quantity + addedInventory) + ".");
                        console.log("\n-------------------------------------------------------------------------------------------------------------\n");
    
                        // End the database connection
                        connection.end();
                    })
                }
            });
        console.log("\n-------------------------------------------------------------------------------------------------------------\n");
    });
}

function addNewProduct() {
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
            name: "productName",
            type: "input",
            message: "What is the product name?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }, {
            name: "productDepartment",
            type: "input",
            message: "What department is the product in?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }, {
            name: "productPrice",
            type: "input",
            message: "What is the product Price?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }, {
            name: "productQuantity",
            type: "input",
            message: "How many of this product are you adding?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }.then(function(answer) {
            var query = "INSERT INTO products SET ?";
            connection.query(query,
            { 
                item_id: answer.productID,
                product_name: answer.productName,
                department_name: answer.productDepartment,
                price: answer.productPrice,
                stock_quantity: amount.productQuantity
            }, function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
            });
        })
    ]);
}