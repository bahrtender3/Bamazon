var mysql = require('mysql');
var inquirer = require('inquirer');
var currentItem;
var quantity;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // username
    user: 'root',

    // password
    password: '',
    database: 'bamazon_db'
});

connection.connect(function (err){
    if (err) throw err;
    initProgram()
});

function initProgram(){
    listAvailableItems();
    idPrompt();
}

function listAvailableItems(){
    var query = 'SELECT * FROM bamazon_db.products'
    connection.query(query, function(err, res){
        res.forEach(function(output){
            console.log("\n" + "Item ID: " + output.item_id + "\n" + 
                        "" + "Product name: " + output.product_name + "\n" +
                        "" + "Item price: $" + output.price + 
                        "\n------------------------------------")
        });
    });
};

function idPrompt(){
    inquirer.prompt([
        {
            type:'input',
            name: 'id',
            message: 'Choose Item by buy by typing in the ID'
        }
    ]).then(function (answers) {

        var query = 'SELECT * FROM products WHERE item_id = ?'
        connection.query(query, [parseInt(answers.id)], function(err, res){
            currentItem = res[0].item_id;
            
            console.log("--------------------------\n" + 
                        "item ID: " + res[0].item_id + "\n" + 
                        "product name: " + res[0].product_name + "\n" +
                        "item price: " + res[0].price + "\n" + 
                        "In stock: " + res[0].stock_quantity + "\n" +
                        "\n--------------------------")

            buyPrompt(res[0].product_name);
        }); 

    }); 
}

function buyPrompt(productName){
    inquirer.prompt([
        {
            type: 'input',
            name: 'amount',
            message: 'how many ' + productName + 's would you like?'
        }
    ]).then(function (answers) {
    quantity = answers.amount;
    processOrderFunc();
    });
};

function processOrderFunc(){
    var query = 'SELECT * FROM products WHERE item_id = ?';
    connection.query(query, [currentItem], function(err, res){
        if(res[0].stock_quantity <= 0){
            console.log('amount of units requested is above the the units in stock!');
        } else {
            var query = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?'
            connection.query(query, [res[0].stock_quantity - quantity, currentItem], function(err, results){
                if(err) throw err;
            })
        }
    });
    resultsFunc();
};

function resultsFunc(){
    var query = 'SELECT * FROM products WHERE item_id = ?';
    connection.query(query, [currentItem], function(err, res){
        console.log("Your total is: $" + (res[0].price * quantity) + "\n" + 
                    "There are " + (res[0].stock_quantity - quantity) + " left in stock."
    );
    });
};

