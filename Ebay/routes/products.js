var mysql = require('./mysql');


exports.getProductsPage = function(req,res){
	res.render('products',{validationMessage:'Empty Messgage'});
};

exports.getAllProducts = function(req,res){
	console.log("In getAllProducts.");

		var getAllProductQuery = "select ItemId, ItemName,ItemDescription,ItemTypeId,SellerId,Price,Qty,DateAdded,ModificationDate,IsBidItem, sold from item where IsBidItem=0";
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

exports.getAllProductsForAuction = function(req,res){
	console.log("In getAllProductsForAuction.");

		var getAllProductForAuctionQuery = "select ItemId, ItemName,ItemDescription,ItemTypeId,SellerId,Price,Qty,DateAdded,ModificationDate,IsBidItem, sold from item where IsBidItem=1";
		console.log("Query:: " + getAllProductForAuctionQuery);

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
		}, getAllProductForAuctionQuery );
};




exports.userAddToCart = function(req,res){
	console.log("In userAddToCart method.");
	
	var ItemId = req.param("ItemId");
	var Qty = 	 req.param("Qty");
	var UserId =  req.session.userid;
	
	console.log("Add to cart for: "+UserId+" itemId: "+ItemId+" Qty:"+Qty);
	
	var userAddToCartQuery = "INSERT INTO usercart(`UserId`,`ItemId`,`Qty`)VALUES("+UserId+","+ItemId+","+Qty+");";
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
	}, userAddToCartQuery );	
};


exports.addBidOnProduct = function(req,res){
	console.log("In addBidOnProduct method.");
	
	var ItemId = req.param("ItemId");
	var BidAmount = req.param("BidAmount");
	var UserId =  req.session.userid;
	
	
	var addBidOnProductQuery = "INSERT INTO bidderlist(`BidderId`,`ItemId`,`BidAmount`)VALUES("+UserId+","+ItemId+","+BidAmount+");";
	console.log("Query:: " + addBidOnProductQuery);

	mysql.fetchData(function(err,results) {
		if(err) {
			throw err;
		}
		else {
			if(results.length > 0) {
					json_responses = {"statusCode" : 200,
										"results" : results,
										"BidAmount":0};
					
					res.send(json_responses);
			}
			else {
				console.log("No items to display");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}
	}, addBidOnProductQuery );	
	
	
};
