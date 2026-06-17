import { HeroBanner, ProductArt } from '../components/SiteChrome.jsx'
import { cartItems } from '../data.js'
import { SectionTitle } from './shared.jsx'

export function CartPage() {
  const subtotal = 'NGN 0.00'

  return (
    <>
      <HeroBanner title="CART PAGE" breadcrumb="Home  /  Cart page" />
      <section className="page-shell cart-page">
        <SectionTitle title="Your cart items" />
        <div className="cart-table">
          <div className="cart-table__head">
            <span>IMAGE</span>
            <span>PRODUCT NAME</span>
            <span>UNTIL PRICE</span>
            <span>QTY</span>
            <span>SUBTOTAL</span>
            <span>DELETE</span>
          </div>
          {cartItems.length ? (
            cartItems.map((item) => (
              <div key={item.name} className="cart-table__row">
                <div className="cart-thumb">
                  <ProductArt tone={item.tone} />
                </div>
                <span>{item.name}</span>
                <span>{item.price}</span>
                <span>
                  <input type="text" value={item.qty} readOnly />
                </span>
                <span>{item.subtotal}</span>
                <span className="delete-icons">
                  <button type="button" aria-label="Edit">
                    Edit
                  </button>
                  <button type="button" aria-label="Remove">
                    Remove
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="cart-table__row">
              <span>No cart items yet.</span>
            </div>
          )}
        </div>

        <div className="cart-actions !grid !grid-cols-1 lg:!grid-cols-3 !gap-4">
          <button type="button" className="secondary-button">
            CONTINUE SHOPPING
          </button>
          <button type="button" className="secondary-button">
            UPDATE SHOPPING CART
          </button>
          <button type="button" className="secondary-button">
            CLEAR SHOPPING CART
          </button>
        </div>

        <div className="cart-panels !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 !gap-[18px]">
          <article className="panel">
            <h3>Estimate Shipping And Tax</h3>
            <p>Enter your destination to get a shipping estimate.</p>
            <label>
              Country
              <input type="text" defaultValue="Bangladesh" />
            </label>
            <label>
              Region / State
              <input type="text" defaultValue="Bangladesh" />
            </label>
            <label>
              Zip/Postal Code
              <input type="text" />
            </label>
            <button type="button" className="primary-button">
              GET A QUOTE
            </button>
          </article>
          <article className="panel">
            <h3>Use Coupon Code</h3>
            <p>Enter your coupon code if you have one.</p>
            <input type="text" />
            <button type="button" className="primary-button">
              APPLY COUPON
            </button>
          </article>
          <article className="panel panel--total">
            <h3>Cart Total</h3>
            <div className="total-line">
              <span>Total products</span>
              <strong>{subtotal}</strong>
            </div>
            <div className="total-line total-line--spaced">
              <span>Total shipping</span>
              <div>
                <label>
                  <input type="checkbox" /> Standard
                </label>
                <label>
                  <input type="checkbox" /> Express
                </label>
              </div>
            </div>
            <div className="total-line total-line--grand">
              <span>Grand Total</span>
              <strong>{subtotal}</strong>
            </div>
            <button type="button" className="primary-button">
              PROCEED TO CHECKOUT
            </button>
          </article>
        </div>
      </section>
    </>
  )
}
