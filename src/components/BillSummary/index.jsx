import './index.css'

const BillSummary = ({
  subtotal,
  gst,
  deliveryFee,
  discount,
  grandTotal,
  couponCode,
}) => (
  <div className="bill-summary-container">
    <div className="bill-row">
      <span>Subtotal</span>
      <span>₹{subtotal}</span>
    </div>
    <div className="bill-row">
      <span>GST (5%)</span>
      <span>₹{gst}</span>
    </div>
    <div className="bill-row">
      <span>Delivery Fee</span>
      <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
    </div>
    {discount > 0 && (
      <div className="bill-row coupon-row">
        <span>Discount ({couponCode})</span>
        <span>-₹{discount}</span>
      </div>
    )}
    <hr className="bill-divider" />
    <div className="bill-row total-row">
      <span>Grand Total</span>
      <span>₹{grandTotal}</span>
    </div>
  </div>
)
export default BillSummary
