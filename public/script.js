const user_name = "JohnDoe"; // Example user, you can modify this

// Fetch Available Slots
function fetchSlots() {
    fetch("http://localhost:5000/slots")
        .then(response => response.json())
        .then(data => {
            let slotHTML = "";
            data.forEach(slot => {
                slotHTML += `<div class="slot">
                    <span>${slot.time} with Carpenter ${slot.carpenter_id}</span>
                    <button onclick="bookSlot(${slot.id}, ${slot.carpenter_id})">Book</button>
                </div>`;
            });
            document.getElementById("slots").innerHTML = slotHTML || "No available slots!";
        })
        .catch(error => {
            console.error("Error fetching slots:", error);
        });
}

// Book a Slot
function bookSlot(slot_id, carpenter_id) {
    fetch("http://localhost:5000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, slot_id, carpenter_id })
    })
    .then(response => response.json())
    .then(() => {
        alert("Booking Successful!");
        fetchSlots();
        fetchBookings();
    })
    .catch(error => {
        console.error("Error booking slot:", error);
    });
}

// Fetch User's Bookings
function fetchBookings() {
    fetch(`http://localhost:5000/review/${user_name}`)
        .then(response => response.json())
        .then(data => {
            let bookingHTML = "";
            data.forEach(booking => {
                bookingHTML += `<div class="slot">
                    <span>Booked: ${booking.slot_id} with Carpenter ${booking.carpenter_id}</span>
                    <button class="cancel" onclick="cancelBooking(${booking.id}, ${booking.slot_id})">Cancel</button>
                </div>`;
            });
            document.getElementById("bookings").innerHTML = bookingHTML || "No bookings found!";
        })
        .catch(error => {
            console.error("Error fetching bookings:", error);
        });
}

// Cancel a Booking
function cancelBooking(booking_id, slot_id) {
    fetch("http://localhost:5000/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id, slot_id })
    })
    .then(response => response.json())
    .then(() => {
        alert("Booking Cancelled!");
        fetchSlots();
        fetchBookings();
    })
    .catch(error => {
        console.error("Error cancelling booking:", error);
    });
}

// Load Data on Page Load
fetchSlots();
fetchBookings();
