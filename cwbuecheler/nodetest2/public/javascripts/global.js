// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

      // Stick our user data array into a userlist variable in the global object
      userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing and taking you to another page
    event.preventDefault();

    // Retrieve username from link rel attribute of the link we clicked. this is the link we clicked.
    var thisUserName = $(this).attr('rel');

    /* Next:
    1) userListData is the global variable of data from our database. It's an array of object that we set in populateTable.
    2) map through that userListData, turn it into an array of usernames only.
    3) Get Index of thisUSerName in that array of names.
    4) now get the appropriate object that was stored in the global variable.
    */
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if(errorCount === 0) {
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email' :$('#addUser fieldset input#inputUserEmail').val(),
      'fullname' :$('#addUser fieldset input#inputFullName').val(),
      'age' :$('#addUser fieldset input#inputUserAge').val(),
      'location' :$('#addUser fieldset input#inputUserLocation').val(),
      'gender' :$('#addUser fieldset input#inputUserGender').val()
    }

    $.ajax({
      type: "POST",
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ){
      if (response.msg === '') {
        $('#addUser fieldset input').val('');

        populateTable();
      } else {
        alert("Error: " + response.msg);
      }
    });
  } else {
    alert("Please fill in all fields");
    return false;
  }
};

// Delete User
function deleteUser(event) {
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

      // If they did, do our delete
      $.ajax({
          type: 'DELETE',
          url: '/users/deleteuser/' + $(this).attr('rel')
      }).done(function( response ) {

          // Check for a successful (blank) response
          if (response.msg === '') {
          }
          else {
              alert('Error: ' + response.msg);
          }

          // Update the table
          populateTable();

      });

  }
  else {

      // If they said no to the confirm, do nothing
      return false;

  }

};
