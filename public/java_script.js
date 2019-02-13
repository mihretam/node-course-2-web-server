
var restaurants = { 1: "Sedra", 2: "Old Story Pub", 3: "Sezam", 4: "Merak", 5: "Limenka", 6: "Mamma Mia", 7: "Mozaik", 8: "Njam Njam", 9: "House of Taste", 10: "Fontana", 11: "Igraonica" };
var restaurantOrders = {}; //empty map, it will contain restaurant ids and array of orders for every restaurant
var listRestaurants = document.getElementById("listOfRestaurants");
var container = document.getElementById("containerOfOrderWindows");

var cancelAllOrderWindowsButton = document.createElement("input");
cancelAllOrderWindowsButton.id = "cancelAllOrderWindowsButton";
cancelAllOrderWindowsButton.value = "Otkazi sve";
cancelAllOrderWindowsButton.type = "button";
cancelAllOrderWindowsButton.addEventListener("click", cancelAllOrderWindows);
document.body.appendChild(cancelAllOrderWindowsButton);

generateRestaurants();
loadOrdersFromLocalStorage();

function addOrderToMap(id, value) {
    restaurantOrders[id] = restaurantOrders[id] || [];
    restaurantOrders[id].push(value);
}

function removeOrderFromMap(id, order) {
    for (let i = 0; i < restaurantOrders[id].length; i++) {
        if (restaurantOrders[id][i] === order)
            restaurantOrders[id].splice(i, 1);
    }
}

function removeAllOrdersFromMap(id) {
    restaurantOrders[id] = [];
} // restaurantOrder map helper functions

function generateRestaurants() {
    for (let i = 1; i <= Object.keys(restaurants).length; i++) {
        var restaurant = document.createElement("ol");
        let nameP = document.createElement("p");
        let name = document.createTextNode(restaurants[i]);
        nameP.appendChild(name);
        restaurant.appendChild(nameP);

        restaurant.name = restaurants[i];
        restaurant.id = i;

        restaurant.addEventListener("click", function () { addRestaurantOrderWindow(i, []); });

        listRestaurants.appendChild(restaurant);

    }
}//generating restaurant list

function loadOrdersFromLocalStorage() {
    if (localStorage.length !== 0) {
        for (let i in localStorage) {
            if (i == "length")
                break;

            let orders = JSON.parse(localStorage.getItem(i));

            if (orders.length != 0 && orders[0] != "")
                addRestaurantOrderWindow(i, orders);
        }
     } //setting up orderWindows that were open before reload 
}

function cancelAllOrderWindows() {

    for (let i = 1; i <= Object.keys(restaurants).length; i++) {

        let restaurant = document.getElementById(i);
        let orderListId = "restaurant" + i;

        if (restaurant.classList.contains("clicked")) {

            let orderList = document.getElementById(orderListId); //to connect orderWindow to restaurant it belongs=

            if (restaurantOrders[i] !== undefined && restaurantOrders[i].length !== 0) {
                cancelCompleteOrder(i, orderList);
                cancelCompleteOrder(i, orderList);
            } //if orderList of the window has some items, trigger cancelCompleteOrder twice so that the window completely closes
            else
                cancelCompleteOrder(i, orderList);
        } //else, just calling it once will close the window
    }
} //for canceling all orderWindows at once


function addRestaurantOrderWindow(id, storageOrders) {

    let restaurant = document.getElementById(id);

    if (!restaurant.classList.contains("clicked")) {

        restaurant.classList.add("clicked");

        var orderWindow = document.createElement("div");
        container.appendChild(orderWindow);
        orderWindow.classList.add("styleOrderWindow");

        let restaurantNameP = document.createElement("h1");
        let restaurantName = document.createTextNode(restaurants[id]);
        restaurantNameP.appendChild(restaurantName);
        orderWindow.appendChild(restaurantNameP); //adding first child to orderWindow

        var orderList = document.createElement("ul");
        if (storageOrders.length != 0) {

            for (let i = 0; i < storageOrders.length; i++) {
                addOrderToOrderList(orderList, storageOrders[i]);
                addOrderToMap(id, storageOrders[i]);
            }
        } //generating orderList elements if this is function is artificially triggered from the block that sets up orderWindows that were open before reload

        orderWindow.appendChild(orderList); //adding second child to orderWindow
        orderList.id = "restaurant" + id; //adding orderList id convertable to restaurant id

        let orderForm = document.createElement("form");
        var inputOrder = document.createElement("input");
        inputOrder.type = "text";
        inputOrder.id = "inputOrderId";
        inputOrder.placeholder = "Unesite svoju narudzbu!";

        var submitOrder = document.createElement("input");
        submitOrder.id = "submitButton";
        submitOrder.type = "button";
        submitOrder.value = "Naruci"
        submitOrder.classList.add("styleSubmitAndCancelButton");

        var cancelCompleteOrderButton = document.createElement("input");
        cancelCompleteOrderButton.type = "button";
        cancelCompleteOrderButton.value = "Otkazi";
        cancelCompleteOrderButton.classList.add("styleSubmitAndCancelButton");
        cancelCompleteOrderButton.id = "cancelButton";

        orderForm.appendChild(inputOrder);
        orderForm.appendChild(submitOrder);
        orderForm.appendChild(cancelCompleteOrderButton);

        orderWindow.appendChild(orderForm); //adding third/last child to orderWindow

        submitOrder.addEventListener("click", function () { addOrder(orderList, inputOrder); });
        cancelCompleteOrderButton.addEventListener("click", function () { cancelCompleteOrder(id, orderList); });

    }

}

function addOrder(orderList, inputOrder) {

    order = inputOrder.value;
    let restaurantId = orderList.id.match(/\d/);
    addOrderToMap(restaurantId, order); //adding order to restaurantOrders map
    localStorage.setItem(restaurantId, JSON.stringify(restaurantOrders[restaurantId])); //adding order to local storage
    addOrderToOrderList(orderList, order); // adding order to orderList

    inputOrder.value = ""; //set inputForm value back to empty string
}

function addOrderToOrderList(orderList, order) {

    if (validInput(order) !== "") {

        var element = document.createElement("ol");
        var orderString = order;
        var order = document.createTextNode(orderString);
        element.appendChild(order);

        var cancelOneOrderButton = document.createElement("input");
        cancelOneOrderButton.type = "button";
        cancelOneOrderButton.value = "X";
        cancelOneOrderButton.addEventListener("click", function () { cancelOneOrder(orderList, element, orderString); });
        cancelOneOrderButton.classList.add("styleCancelOneOrderButton");
        element.appendChild(cancelOneOrderButton);

        orderList.appendChild(element);

    }
} //adding order and a cancel button as an element to the orderList

function validInput(order) {

    let regex = /^[a-zA-Z\s,]*$/;
    order = order.match(regex);

    if (order !== null)
        return order.join('').trim();
    else
        return "";

} //if input is valid ie. consists of letters, spaces and , sign returns input else returns empty string

function cancelOneOrder(orderList, element, order) {

    let restaurantId = orderList.id.match(/\d/); //restaurant id

    removeOrderFromMap(restaurantId, order); //removing from restaurantOrders map
    orderList.removeChild(element); //removing from orderList
    localStorage.setItem(restaurantId, JSON.stringify(restaurantOrders[restaurantId])); //removing from local storage

}

function cancelCompleteOrder(restaurantId, orderList) {

    if (restaurantOrders[restaurantId] == undefined || restaurantOrders[restaurantId].length == 0) {

        container.removeChild(orderList.parentNode); //closing the empty orderWindow
        let restaurant = document.getElementById(restaurantId);
        restaurant.classList.remove("clicked");

    } //if the orderList from the orderWindow is empty, this function is supposed to close the orderWindow

    else {

        removeAllOrdersFromMap(restaurantId);
        localStorage.removeItem(restaurantId);

        //orderList.firstChild 
        while (orderList.firstChild)
            orderList.removeChild(orderList.firstChild);

    } //else remove all from restaurantOrders and localStorage of the restaurant, and remove all orderList elements   

}


