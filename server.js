var expressKuch = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql");
const cors = require("cors");


var path = require("path");
const { report } = require("process");
var app = expressKuch();
//         port   behavior
app.listen(5000, function () {
    console.log("Server Started");
})

app.use(cors());
app.use(expressKuch.json());
app.use(expressKuch.urlencoded({ extended: true }));


app.use(expressKuch.static("public")); 
app.get("/", (req, res) => {
    res.send("Welcome to Urban Company Booking Management!");
});



//api-url handler
app.get("/hello", function (req, res) {
    res.send("hi bro/sis");
    console.log("**********");
})


//app.use(expressKuch.static("public"));  //imp for using ajax....


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "booking"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});

app.get("/", function (req, resp) {


    var puraPath = process.cwd() + "/public/home.html";


    resp.sendFile(puraPath);
});

app.get("/home-page", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "index.html");
    resp.sendFile(fullPath);
})


let slots = [
    { id: 1, time: "9:00 AM", carpenter_id: 1 },
    { id: 2, time: "10:00 AM", carpenter_id: 2 },
    { id: 3, time: "11:00 AM", carpenter_id: 1 },
    { id: 4, time: "12:00 PM", carpenter_id: 2 },
    { id: 5, time: "1:00 PM", carpenter_id: 1 }
];

let bookings = [];

let users = [
    { user_name: "JohnDoe" },
    { user_name: "JaneDoe" }
];

// Get available slots
app.get("/slots", (req, res) => {
    res.json(slots);
});

// Get bookings for a specific user
app.get("/review/:user_name", (req, res) => {
    const userName = req.params.user_name;
    const userBookings = bookings.filter(b => b.user_name === userName);
    res.json(userBookings);
});

// Book a slot
app.post("/book", (req, res) => {
    const { user_name, slot_id, carpenter_id } = req.body;

    // Check if the slot is already booked
    const slotIndex = slots.findIndex(s => s.id === slot_id);
    if (slotIndex > -1) {
        const slot = slots[slotIndex];
        if (bookings.find(b => b.slot_id === slot_id)) {
            return res.status(400).json({ message: "Slot already booked." });
        }
        // Create a new booking
        const newBooking = { id: bookings.length + 1, user_name, slot_id, carpenter_id };
        bookings.push(newBooking);
        return res.json({ message: "Booking successful!", newBooking });
    }
    return res.status(400).json({ message: "Invalid slot." });
});

// Cancel a booking
app.post("/cancel", (req, res) => {
    const { booking_id, slot_id } = req.body;

    const bookingIndex = bookings.findIndex(b => b.id === booking_id && b.slot_id === slot_id);
    if (bookingIndex > -1) {
        bookings.splice(bookingIndex, 1);
        return res.json({ message: "Booking cancelled." });
    }
    return res.status(400).json({ message: "Booking not found." });
});

