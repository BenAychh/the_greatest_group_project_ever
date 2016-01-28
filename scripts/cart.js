var displayStyle = null;
/**
 * updateCart - Adds an item to the cart
 *
 * @param  {string} id the id provided by the JSON file.
 * @return {type}    undefined
 */
function updateCart(id) {
  // Check to see if our sessionStorage has an items key
  if (sessionStorage.items) {
    // If it does, get the current cart
    var cartData = JSON.parse(sessionStorage.items);
    // Add the id to the cart object
    cartData[id] = 1;
    // Convert to string because sessionStorage only takes strings
    sessionStorage.items = JSON.stringify(cartData);
    // Update the cart count
    getCartCount();
    // Disable the add button
    $('#' + id + 'button').prop('disabled', true);
  } else {
    // The object items doesn't exist in session storage to create it
    // and add the item.
    var tempObject = {};
    tempObject[id] = 1;
    sessionStorage.items = JSON.stringify(tempObject);
    getCartCount();
  }
  // Push a receipt onto the page
  generateReceipt();
}
// Updates the cart count in the top right corner
function getCartCount() {
  // If we have a cart, count the number of items and populate
  if (sessionStorage.items) {
    var cartData = JSON.parse(sessionStorage.items);
    var keys = Object.keys(cartData);
    $('#cartCount span').html(keys.length);
  } else {
    // If there is no cart, we have no items in it.
    $('#cartCount span').html(0);
  }
}

/**
 * generateReceipt - Generates a receipt/item list
 *
 * @return {type}  undefined
 */
function generateReceipt(localDisplayStyle) {
  if(!displayStyle) {
    displayStyle = localDisplayStyle;
  }
  $.ajax({
    url: 'data/inventory.json',
    method: 'GET'
  }).then(function(data) {
    if (displayStyle === "sidebar") {
      // Where to store the item list
      var container = $('#receipt');
      // Clear the item list.
      container.html('<h5>Total: $0</h5>');
      // Running total for our price
      var total = 0;
      // Get the items from sessionStorage
      var cartData = JSON.parse(sessionStorage.items);
      // Break it into individual items
      var keys = Object.keys(cartData);
      // Only put an item list if we have items.
      if (keys.length > 0) {
        // Start a table.
        var innerHTML = '<div class="row">'
        keys.forEach(function(key) {
          // Get the animal.
          var animalType = getAnimalFromID(key);
          // Filter should only be one animal because of the id.
          var animal = data[animalType].filter(function(specificAnimal) {
            return specificAnimal.id === key;
          })[0];
          // Populate the row with data.
          innerHTML += '<div class="panel panel-default' + displayStyle +'">' +
            '<div class="panel-body">' +
            '<h3>' + animal.name + '</h3>' +
            '<h5>Gender: ' + animal.gender + '</h5>' +
            '<h5>Species: ' +
              animalType.substring(0, animalType.length - 1) + '</h5>' +
            '<h5>Origin: ' + animal.origin + '</h5>' +
            '<h5>Price: $' + animal.price + '</h5>' +
            '<p><img class="img-responsive img-rounded" src="' + animal.image + '"></p>' +
            '<p>' +
              '<button onclick="removeItem(\'' + animal.id + '\')">Remove!' +
              '</button></p>' +
            '</div></div>' ;
            total += animal.price;
        });
        // End the list
        innerHTML += '</div>' +
          '<h5>Total: $' + total + '</h5>';
        container.html(innerHTML);
      }
    } else if (displayStyle === "table") {
      var container = $('#receipt');
      // Clear the item list.
      container.html('');
      // Running total for our price
      var total = 0;
      // Get the items from sessionStorage
      var cartData = JSON.parse(sessionStorage.items);
      // Break it into individual items
      var keys = Object.keys(cartData);
      // Only put an item list if we have items.
      if (keys.length > 0) {
        // Start a table.
        var innerHTML = '<table class="table table-bordered table-striped">' +
        '<tr class="success">' +
        '<th class="col-md-1">Name</th>' +
        '<th class="col-md-1">Gender</th>' +
        '<th class="col-md-1">Species</th>' +
        '<th class="col-md-1">Origin</th>' +
        '<th class="col-md-1">Price</th>' +
        '<th class="col-md-1">Picture</th>' +
        '<th class="col-md-1 invisible"></th>' +
        '</tr>';
        keys.forEach(function(key) {
          // Get the animal.
          var animalType = getAnimalFromID(key);
          // Filter should only be one animal because of the id.
          var animal = data[animalType].filter(function(specificAnimal) {
            return specificAnimal.id === key;
          })[0];
          // Populate the row with data.
          innerHTML += '<tr>' +
            '<td class="col-md-1">' + animal.name + '</td>' +
            '<td class="col-md-1">' + animal.gender + '</td>' +
            '<td class="col-md-1">'
              + animalType.substring(0, animalType.length - 1) + '</td>' +
            '<td class="col-md-1">' + animal.origin + '</td>' +
            '<td class="col-md-1">$' + animal.price + '</td>' +
            '<td class="col-md-1">' +
              '<img class="img-responsive img-circle" src="' + animal.image + '">' + '</td>' +
            '<td class="col-md-1 text-center">' +
              '<button onclick="removeItem(\'' + animal.id + '\')">Remove!' +
              '</button></td>' +
            '</tr>';
            total += animal.price;
        });
        // End the list
        innerHTML += '<tr class="success">' +
            '<td class="col-md-1 invisible"></td>' +
            '<td class="col-md-1 invisible"></td>' +
            '<td class="col-md-1 invisible"></td>' +
            '<td class="col-md-1 text-right">Total: </td>' +
            '<td class="col-md-1 ">$' + total + '</td>' +
            '<td class="col-md-1 invisible"></td>' +
            '<td class="col-md-1 invisible"></td>' +
            '</tr></table>';
        container.html(innerHTML);
      }
    }
  });
}
// Converts the id to an animal for JSON accessibility.
function getAnimalFromID(id) {
  switch (id.substring(0, 2)) {
    case 'sl':
      return 'sloths';
    case 'sn':
      return 'snails';
    case 'tu':
      return 'turtles';
  }
}
// Remove an item from the cart and reenable the add to cart button.
function removeItem(animalID) {
  $('#' + animalID + 'button').prop('disabled', false);
  var cartData = JSON.parse(sessionStorage.items);
  delete cartData[animalID];
  sessionStorage.items = JSON.stringify(cartData);
  // Update the item list and cart count since we have removed an item.
  generateReceipt();
  getCartCount();
}
getCartCount();
