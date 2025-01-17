import React, { Component } from "react";
import Products from "./components/Products";
import Cart from "./components/Cart";

const postCheckoutData = async (url = "", data) => {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    return response.json();
};

class App extends Component {
    constructor() {
        super();

        this.state = {
            isCartOpen: false,
            checkout: { lineItems: [] },
            products: [],
            shop: {},
        };

        this.handleCartClose = this.handleCartClose.bind(this);
        this.addVariantToCart = this.addVariantToCart.bind(this);
        this.updateQuantityInCart = this.updateQuantityInCart.bind(this);
        this.removeLineItemInCart = this.removeLineItemInCart.bind(this);
    }

    componentWillMount() {
        this.props.client.checkout.create().then((res) => {
            this.setState({
                checkout: res,
            });
        });

        this.props.client.product.fetchAll().then((res) => {
            this.setState({
                products: res,
            });
        });

        this.props.client.shop.fetchInfo().then((res) => {
            this.setState({
                shop: res,
            });
        });
    }

    addVariantToCart(variantId, quantity) {
        this.setState({
            isCartOpen: true,
        });

        const lineItemsToAdd = [
            { variantId, quantity: parseInt(quantity, 10) },
        ];
        const checkoutId = this.state.checkout.id;

        return this.props.client.checkout
            .addLineItems(checkoutId, lineItemsToAdd)
            .then((res) => {
                this.setState({
                    checkout: res,
                });
            });
    }

    updateQuantityInCart(lineItemId, quantity) {
        const checkoutId = this.state.checkout.id;
        const lineItemsToUpdate = [
            { id: lineItemId, quantity: parseInt(quantity, 10) },
        ];

        return this.props.client.checkout
            .updateLineItems(checkoutId, lineItemsToUpdate)
            .then((res) => {
                this.setState({
                    checkout: res,
                });
            });
    }

    removeLineItemInCart(lineItemId) {
        const checkoutId = this.state.checkout.id;

        return this.props.client.checkout
            .removeLineItems(checkoutId, [lineItemId])
            .then((res) => {
                this.setState({
                    checkout: res,
                });
            });
    }

    handleCartClose() {
        this.setState({
            isCartOpen: false,
        });
    }

    postCheckout() {
        postCheckoutData(
            "https://webhook.site/05fb11b7-ca00-4c99-af84-391fb79618d6",
            this.state.checkout
        )
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="App">
                <header className="App__header">
                    {!this.state.isCartOpen && (
                        <div className="App__view-cart-wrapper">
                            <button
                                className="App__view-cart"
                                onClick={() =>
                                    this.setState({ isCartOpen: true })
                                }
                            >
                                Cart
                            </button>
                        </div>
                    )}
                    <div className="App__title">
                        <h1>{this.state.shop.name}: React Example</h1>
                        <h2>{this.state.shop.description}</h2>
                    </div>
                </header>
                <Products
                    products={this.state.products}
                    client={this.props.client}
                    addVariantToCart={this.addVariantToCart}
                />
                <Cart
                    checkout={this.state.checkout}
                    isCartOpen={this.state.isCartOpen}
                    handleCartClose={this.handleCartClose}
                    updateQuantityInCart={this.updateQuantityInCart}
                    removeLineItemInCart={this.removeLineItemInCart}
                />
                {/* <div>{JSON.stringify(this.state.checkout)}</div> */}
                <button onClick={() => this.postCheckout()}>
                    Post Checkout
                </button>
            </div>
        );
    }
}

export default App;
