// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDcnioYIl2IKg8-MRRw3d2pBeTbck1iy0Q",
    authDomain: "toastytoast-8632a.firebaseapp.com",
    databaseURL: "https://toastytoast-8632a.firebaseio.com",
    projectId: "toastytoast-8632a",
    storageBucket: "toastytoast-8632a.appspot.com",
    messagingSenderId: "13756556522"
};

firebase.initializeApp(config);
var database = firebase.database();

$('#addTrainBtn').on("click", function() {
    // take user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequencyInput").val().trim();
    // to create local temporary object to hold train data
    var newTrain = {
        name: trainName,
        place: destination,
        ftrain: firstTrain,
        freq: frequency
    }


    // uploads train data to the database
    database.ref().push(newTrain);
    console.log(newTrain.name);
    // clears all the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");
    // Prevents moving to new page
    return false;
});


//  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    // Now we store the childSnapshot values into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var frequency = childSnapshot.val().freq;

    
    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    console.log(firstTimeConverted);
    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + currentTime);
    // store difference between currentTime and fisrt train converted in a variable.
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log(firstTrain);
    console.log("Difference in Time: " + timeDiff);
    // find Remainder of the time left and store in a variable
    var timeRemainder = timeDiff % frequency;
    console.log(timeRemainder);
    // to calculate minutes till train,we store it in a variable
    var minToTrain = frequency - timeRemainder;
    // next train
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
    $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nxTrain + "</td><td>" + frequency + "</td><td>" + minToTrain + "</td></tr>");
});

// Assume the following situations. 

// (TEST 1) 
// First Train of the Day is 3:00 AM 
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2) 
// First Train of the Day is 3:00 AM 
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1: 
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically  
// Test case 2: 
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21