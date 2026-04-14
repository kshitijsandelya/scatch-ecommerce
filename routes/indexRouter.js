const express = require('express');
const router = express();
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const isloggedin = require('../middlewares/isloggedin');
const flash = require('connect-flash');

router.use(flash());

router.get("/", function (req, res) {
    let error = req.flash("error");
    let message = req.flash("message")
    res.render("index", { message, error, loggedin: false });
});

router.get('/shop', isloggedin, async function (req, res) {
    let products = await productModel.find();
    let message = req.flash("success");
    res.render('shop', { products, message });
})

router.get('/cart', isloggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");

    let totalMRP = 0;
    let totalDiscount = 0;
    let bill = 0;

    let itemMap = {};

    if (user.cart.length > 0) {
        user.cart.forEach(function (item) {
            let itemId = item._id.toString();

            if (itemMap[itemId]) {
                itemMap[itemId].quantity += 1;
            } else {
                itemMap[itemId] = {
                    details: item,
                    quantity: 1
                };
            }
        });

        totalMRP = user.cart.reduce((acc, item) => acc + Number(item.price), 0);
        totalDiscount = user.cart.reduce((acc, item) => acc + Number(item.discount), 0);
        bill = totalMRP + 20 - totalDiscount;
    }

    let groupedCart = Object.values(itemMap);

    res.render('cart', { user, groupedCart, bill, totalMRP, totalDiscount });
});

router.get("/cart/increment/:productid", isloggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        user.cart.push(req.params.productid);
        await user.save();

        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});

router.get("/cart/decrement/:productid", isloggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        let index = user.cart.findIndex(id => id.toString() === req.params.productid);

        if (index !== -1) {
            user.cart.splice(index, 1);
            await user.save();
        }

        res.redirect("/cart");
    } catch (err) {
        res.send(err.message);
    }
});

router.get('/addtocart/:productid', isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect('/shop');
});

router.get('/cart/:userid', isloggedin, (req, res) => {
    res.render('cart');
});

module.exports = router;