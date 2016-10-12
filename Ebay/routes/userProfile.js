var mysql = require('./mysql');

exports.accountdetails = function(req,res){
	
	res.render('userProfile',{validationMessgae:'Empty Message'});

};

exports.getUserAccountDetails = function(req,res){
	
	console.log("userId: "+req.session.userid);
	
	var userId = req.session.userid;
	
	if(userId != '') {
		var getUserAccountDetailsQuery = "select UserId,FirstName,LastName,EmailId,Password,Address,CreditCardNumber,DateOfBirth,LastLoggedIn from user where UserId= '" + userId+"'";
		console.log("Query:: " + getUserAccountDetailsQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the user data");
						console.log("UserId :  " + userId);					
						
						json_responses = {"UserId" : results[0].UserId
											,"FirstName": results[0].FirstName
											,"LastName": results[0].LastName
											,"EmailId":results[0].EmailId
											,"Address":results[0].Address
											,"CreditCardNumber":results[0].CreditCardNumber
											,"DateOfBirth":results[0].DateOfBirth
											,"LastLoggedIn":results[0].LastLoggedIn
											};
						}
				else{
						res.send(json_responses);
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		}, getUserAccountDetailsQuery);
	}	
	
};

exports.getAllProductsInCart = function(req,res){
	console.log("inside get All Products from cart for user: "+req.session.userid);
	
	var userId = req.session.userid;
	
	if(userId != '') {
		var getUserCartItemsQuery = "select uc.UserCartId, uc.ItemId, i.ItemName, i.ItemDescription, i.ItemTypeId ,i.Price from ebay.usercart uc join ebay.item i on uc.ItemId =  i.itemId where uc.UserId = '" + userId +"'";
		console.log("Query:: " + getUserCartItemsQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the user cart data");
						
						json_responses = results;
						}
				else{
						res.send(json_responses);
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		}, getUserCartItemsQuery);
	}	
};

exports.removeItemFromCart = function(req,res){
	console.log("Inside removeItemFromCart for user: "+req.session.userid);
	
	var userId = req.session.userid;
	var itemId = req.param("itemId");
	
	if(userId != '') {
		var removeItemFromCartQuery = "delete from usercart where UserId = "+userId+" and ItemId = "+itemId;
		console.log("Query:: " + removeItemFromCartQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful removed item from the cart");
						
						json_responses = results;
						}
				else{
						res.send(json_responses);
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		}, removeItemFromCartQuery);
	}
};

exports.buyItemsInCart = function(req,res){
/*
 * 1. Get all items from cart table by userid
 * 2. push the items to sold table.
 * 3. empty cart.
 * 4. Qty -= 1 in items table. 
 */
	
	var userId = req.session.userid;

	var creditCardNumber = req.param("CreditCardNumber");
	
	if(userId != '') {
		var getAllCartItemsQuery = "Select UserCartId,UserId,ItemId,Qty from usercart where UserId ="+userId;
		console.log("Query:: " + getAllCartItemsQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Got all the items for userId: "+ userId);
						for(result in results)
						{
							AddItemToSoldTable(results[result].ItemId,userId,creditCardNumber);
							updateItemQty(results[result].ItemId);
							removingItemFromCart(userId,results[result].ItemId);
						}						
						json_responses = results;
				}
				else{
						res.send(json_responses);
						console.log("No items in cart.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		}, getAllCartItemsQuery);
	}	
}

function AddItemToSoldTable(ItemId,userId,creditCardNumber) {

	console.log("Inside addItemTOSoldTable method.")

	var addItemToSoldTableQuery = "INSERT INTO sold(ItemId,BuyerId,SoldDate,Qty,PaymentByCard)VALUES("+ItemId+","+userId+",NOW(),1,'"+creditCardNumber+"');";
	console.log("Query:: " + addItemToSoldTableQuery);

	mysql.storeData(addItemToSoldTableQuery, function(err, result){
		//render on success
		if(!err){
			console.log('New item successfully bought by user!');
				json_responses = {
					"statusCode" : 200
				}
				//res.send(json_responses);
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});
}

function updateItemQty(ItemId) {

	console.log("Inside updateItemQty method.")
		
	var updateItemQtyQuery = "UPDATE ebay.item SET Qty=Qty-1  WHERE ItemId = "+ItemId;
	console.log("Query:: " + updateItemQtyQuery);


	mysql.storeData(updateItemQtyQuery, function(err, result){
		//render on success
		if(!err){
			console.log('Item Qty updated!');
				json_responses = {
					"statusCode" : 200
				}
				//res.send(json_responses);
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});
}

function removingItemFromCart(userId,ItemId) {

	console.log("Inside updateItemQty method.")
		
	var RemovingItemFromCartQuery = "delete from usercart where UserId ="+userId+" and ItemId = "+ItemId+";";
	console.log("Query:: " + RemovingItemFromCartQuery);


	mysql.deleteData(RemovingItemFromCartQuery, function(err,results) {
		if(err) {
				console.log("Error in deleteData");
				console.log(err);
				throw err;
			}
		else {
			console.log("successfully removed items from the cart");
			console.log(results);
			console.log(results.affectedRows);
			if(results.affectedRows >0) {
				json_responses = {
					"statusCode" : 200,
					"results" : results
				}
				//res.send(json_responses);
			}
			else{
				json_responses = {
					"statusCode" : 401
				}
				//res.send(json_responses);
			}
		}
	});
}

exports.getAllUserDirectBuyingActivities= function(req,res){
	console.log("inside getAllUserDirectBuyingActivities for user: "+req.session.userid);
	
	var userId = req.session.userid;
	
	if(userId != '') {
		var getAllUserDirectBuyingActivitiesQuery = "select u.Solddate, u.Qty, i.ItemName, i.ItemDescription,i.Price,seller.FirstName from sold as u left join item as i on u.ItemId=i.ItemId left join user as seller on i.SellerId=seller.UserId where u.BuyerId = "+userId;
		console.log("Query:: " + getAllUserDirectBuyingActivitiesQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the user activity data");
						
						json_responses = results;
						}
				else{
						
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		}, getAllUserDirectBuyingActivitiesQuery);
	}	
};

exports.getAllSoldProducts= function(req,res){
	console.log("inside getAllSoldProducts for user: "+req.session.userid);
	
	var userId = req.session.userid;
	
	if(userId != '') {
		var getAllSoldProductsQuery = "select i.ItemName, i.ItemDescription,s.Qty,s.SoldDate,u.FirstName as Buyer,i.Price from item as i right join sold as s on i.ItemId=s.ItemId left join user u on s.BuyerId=u.UserId where i.SellerId = "+userId+";";
		console.log("Query:: " + getAllSoldProductsQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the sold products.");
						
						json_responses = results;
						}
				else{
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		},getAllSoldProductsQuery);
	}	
};

exports.getAllUserBiddingActivity = function(req,res){
	console.log("inside getAllUserBiddingActivity for user: "+req.session.userid);
	
	var userId = req.session.userid;
	
	if(userId != '') {
		var getAllUserBiddingActivityQuery = "select  i.ItemName, i.ItemDescription, i.Price, b.BidAmount,b.BidTime  from bidderList as b left join item as i  on b.ItemId=i.ItemId where BidderId = "+userId+" order by BidTime desc";
		console.log("Query:: " + getAllUserBiddingActivityQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the sold products.");
						
						json_responses = results;
						}
				else{
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		},getAllUserBiddingActivityQuery);
	}
}

//Select BidderId,max(BidAmount) from bidderList where ItemId = (select (ItemId) from Item where  IsBidItem =1  and AuctionEndDate < now());
exports.updateAuctionWinners = function(req,res){
	console.log("inside updateAuctionWinners");
	
	var getAuctionWinner = "Select BidderId,max(BidAmount) from bidderList where ItemId = (select (ItemId) from Item where  IsBidItem =1  and AuctionEndDate < now()) and IsWinner<>1;";
	console.log("Query:: " + getAuctionWinner);

	mysql.fetchData(function(err,results) {
		if(err) {
			throw err;
		}
		else {
			if(results.length > 0) {
					console.log("Successful got the sold products.");
					
					json_responses = results;
					}
			else{
					console.log("Invalid string.");
					json_responses = {"statusCode" : 401};
			}
			res.send(json_responses);
		}	
		
	},getAuctionWinner);
	
	
	
	
	
	if(userId != '') {
		var getAllUserBiddingActivityQuery = "select  i.ItemName, i.ItemDescription, i.Price, b.BidAmount,b.BidTime  from bidderList as b left join item as i  on b.ItemId=i.ItemId where BidderId = "+userId+" order by BidTime desc";
		console.log("Query:: " + getAllUserBiddingActivityQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the sold products.");
						
						json_responses = results;
						}
				else{
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		},getAllUserBiddingActivityQuery);
	}
}

exports.getAllWonAuctions= function(req,res){
	console.log("inside getAllWonAuctions for user: "+req.session.userid);
	
	var userId = req.session.userid;
	
	if(userId != '') {
		var getAllWonAuctionsQuery = "select a.WinnerId, a.ItemId, a.PaymentByCard,a.PaymentDate,a.IsPaymentDone, i.ItemName, i.ItemDescription, i.price, b.BidAmount,b.BidTime from auctionwinners as a left join item as i on a.ItemId = i.ItemId left join bidderList as b on a.winnerId = b.BidderId and a.ItemId= b.ItemId where a.IsPaymentDone=0 and a.WinnerId = "+userId;
		console.log("Query:: " + getAllWonAuctionsQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
						console.log("Successful got the winning items.");
						
						json_responses = results;
						}
				else{
						console.log("Invalid string.");
						json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}	
			
		},getAllWonAuctionsQuery);
	}
}

exports.updatePaymentDetailsForAuction= function(req,res){
	console.log("Inside updatePaymentDetailsForAuction method.")
	var userId = req.session.userid;
	var creditCardNumber = req.param("CreditCardNumber");
	var ItemId = req.param("ItemId");
	var updatePaymentDetailsForAuctionQuery = "UPDATE `auctionwinners` SET `PaymentByCard` = "+creditCardNumber+", `PaymentDate` = now(),`IsPaymentDone` = 1 WHERE `WinnerId` = "+userId +" and IsPaymentDone = 0;";
	console.log("Query:: " + updatePaymentDetailsForAuctionQuery);
	mysql.storeData(updatePaymentDetailsForAuctionQuery, function(err, result){
		//render on success
		if(!err){
			console.log('Auction payment detils updated for userId: '+userId);
			UpdateItemStatusToSold(ItemId);
					json_responses = {
					"statusCode" : 200
				}

				//res.send(json_responses);
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});
}

function UpdateItemStatusToSold(ItemId) {

	console.log("Inside UpdateItemStatusToSold method.")

	var updateItemStatusToSoldQuery = "UPDATE `ebay`.`item`	SET `Sold` = 1 WHERE `ItemId` = "+ItemId +";";
	console.log("Query:: " + updateItemStatusToSoldQuery);

	mysql.storeData(updateItemStatusToSoldQuery, function(err, result){
		//render on success
		if(!err){
			console.log('Item is sold!');
			json_responses = {
				"statusCode" : 200
			}
			//res.send(json_responses);
		}
		else{
			console.log('ERROR! Insertion not done');
			throw err;
		}
	});
}

//select a.Paymentdate, i.ItemName, i.ItemDescription,i.Price, u.FirstName as SellerName from auctionWinners as a left join item as i on a.ItemId = i.ItemId left join user as u on i.SellerId = u.UserId where a.WinnerId = 3;

exports.getAllAuctionProductHistory= function(req,res){
	console.log("Inside getAllAuctionProductHistory method.")
	var userId = req.session.userid;

	if(userId != '') {
		var getAllAuctionProductHistoryQuery = "select a.Paymentdate, i.ItemName, i.ItemDescription,i.Price, u.FirstName as SellerName from auctionWinners as a left join item as i on a.ItemId = i.ItemId left join user as u on i.SellerId = u.UserId where a.WinnerId = "+userId+";";
		console.log("Query:: " + getAllAuctionProductHistoryQuery);

		mysql.fetchData(function(err,results) {
			if(err) {
				throw err;
			}
			else {
				if(results.length > 0) {
					console.log("Successful got the user data");
				    json_responses = results;
				}
				else{
					console.log("Invalid string.");
					json_responses = {"statusCode" : 401};
				}
				res.send(json_responses);
			}

		}, getAllAuctionProductHistoryQuery);
	}

}
