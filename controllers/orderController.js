const nodemailer = require('nodemailer')
const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart

const USER_EMAIL = process.env.USER_EMAIL

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
});

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      return res.render('orders', {
        orders
      })
    })
  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
      }).then(order => {

        let results = [];
        for (let i = 0; i < cart.items.length; i++) {
          console.log(order.id, cart.items[i].id)
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity,
            })
          );
        }

        let mailOptions = {
          from: `${USER_EMAIL}`,
          to: `${USER_EMAIL}`,
          subject: `${order.id} 訂單成立`,
          text: `${order.id} 訂單成立`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response)
            return Promise.all(results).then(() =>
              res.redirect('/orders')
            );
          }
        });

      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('back')
      })
    })
  },
}

module.exports = orderController