CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(50),
	price DECIMAL(10, 2), 
	stock_quantity INTEGER(10),
	PRIMARY KEY ( item_id )	
);