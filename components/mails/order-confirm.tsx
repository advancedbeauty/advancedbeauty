interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  listPrice: number;
  date: string | Date;
  time: string;
  image: string;
  quantity?: number;
}

interface PriceDetails {
  subtotal: number;
  totalDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  total: number;
  discountPercent: number;
  maxDiscountAmount: number;
}

interface OrderEmailParams {
  fullName: string;
  cartItems: CartItem[];
  priceDetails: PriceDetails;
}

export function getOrderConfirmationHtml({
  fullName,
  cartItems,
  priceDetails,
}: OrderEmailParams): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Order Confirmation</title>
    <style>
      /* Reset and basic styles */
      body, table, td, p {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        color: #333;
      }
      img {
        border: none;
        display: block;
      }
      a {
        color: #1a73e8;
        text-decoration: none;
      }
      /* Container */
      .email-wrapper {
        width: 100%;
        
        padding: 20px 0;
      }
      .email-content {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      /* Header */
      .email-header {
        background-color: #1a73e8;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .email-header h1 {
        font-size: 24px;
        margin: 0;
      }
      /* Body */
      .email-body {
        padding: 20px;
      }
      .greeting {
        font-size: 18px;
        margin-bottom: 10px;
      }
      .order-summary {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .order-summary th,
      .order-summary td {
        border: 1px solid #e0e0e0;
        padding: 8px 12px;
        text-align: left;
      }
      .order-summary th {
        background-color: #f9f9f9;
        font-weight: bold;
      }
      .totals {
        margin-top: 10px;
        font-size: 16px;
      }
      .totals span {
        display: inline-block;
        width: 150px;
      }
      .margin-top{
        margin-top: 7px;
      }
      /* Footer */
      .email-footer {
        background-color: #f9f9f9;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <!-- Header -->
        <div class="email-header">
          <h1>Your Booking Confirmation</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
          <p class="greeting">Hi ${fullName},</p>
          <p>Thank you for your booking! Here’s a summary of your booking:</p>

          <!-- Order Summary Table -->
          <table class="order-summary">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th align="right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity || 1}</td>
                  <td align="right">₹${(item.price * (item.quantity || 1)).toLocaleString()}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals">
            <p><span>Subtotal:</span> ₹${priceDetails.subtotal.toLocaleString()}</p>
            <p><span>Discount:</span> -₹${(priceDetails.totalDiscount + priceDetails.couponDiscount).toLocaleString()}</p>
            <p><span>Shipping:</span> ₹${priceDetails.shippingFee.toLocaleString()}</p>
            <p style="font-weight: bold;"><span>Total Paid:</span> ₹${priceDetails.total.toLocaleString()}</p>
          </div>
          <p class="margin-top">Thanks again for booking services with us!</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
          &copy; ${new Date().getFullYear()} Advanced Beauty. All rights reserved.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

