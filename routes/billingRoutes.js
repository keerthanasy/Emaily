const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    if (!req.user) {
        return res.status(401).send({error: 'You must log in!'})
    }
    try {
      const charge = await stripe.charges.create({
        amount: 500, // amount in cents
        currency: 'usd',
        description: '$5 dollars for 5 credits',
        source: req.body.id // token from frontend
      });

      req.user.credits += 5;
      const user = await req.user.save()
      

      res.send(user);
      
      res.send({ success: true, charge });
    } catch (err) {
      
      res.status(500).send({ error: 'Payment failed' });
    }
  });
};
