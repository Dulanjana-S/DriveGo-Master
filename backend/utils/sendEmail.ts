import nodemailer from "nodemailer"

export async function sendBookingEmail(
  to: string,
  booking: any
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `"DriveGO" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Booking Confirmed - DriveGO 🚗",
    html: `
      <h2>Booking Confirmed 🎉</h2>
      <p>Your booking has been successfully confirmed.</p>

      <hr/>

      <p><strong>Vehicle:</strong> ${booking.vehicleName}</p>
      <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
      <p><strong>Pickup Date:</strong> ${booking.pickupDate}</p>
      <p><strong>Return Date:</strong> ${booking.returnDate}</p>
      <p><strong>Total Paid:</strong> LKR ${booking.totalPrice}</p>

      <br/>
      <p>Thank you for choosing <b>DriveGO</b>.</p>
    `,
  }

  await transporter.sendMail(mailOptions)
}
