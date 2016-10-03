var mysql = require('./mysql');


exports.getProductsPage = function(req,res){
	res.render('products',{validationMessage:'Empty Messgage'});
};

exports.getAllProducts = function(req,res){
	console.log("In getAllProducts.");

		var getAllProductQuery = "select ItemId, ItemName,ItemDescription,ItemTypeId,SellerId,Price,Qty,DateAdded,ModificationDate,IsBidItem, sold from item";
		console.log("Query:: " + getAllProductQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						json_responses = {"statusCode" : 200,
											"results" : results};
						
						res.send(json_responses);
				}
				else {
					console.log("No items to display");
					json_responses = {"statusCode" : 401};
					res.send(json_responses);
				}
			}
		}, getAllProductQuery );
};

exports.userAddToCart = function(req,res){
	console.log("In userAddToCart method.");
	
	var ItemId = req.param("ItemId");
	var UserId =  req.param("UserId");
	var Qty = 	 req.param("Qty");
	
	var userAddToCartQuery = "INSERT INTO usercart(`UserId`,`ItemId`,`Qty`)VALUES("+ItemId+","+UserId+","+Qty+");";
	console.log("Query:: " + userAddToCartQuery);

	mysql.fetchData(function(err,results) {
		if(err) {
			throw err;
		}
		else {
			if(results.length > 0) {
					json_responses = {"statusCode" : 200,
										"results" : results};
					
					res.send(json_responses);
			}
			else {
				console.log("No items to display");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}
	}, getAllProductQuery );	
};
