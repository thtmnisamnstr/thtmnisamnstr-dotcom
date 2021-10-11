import React from "react";

import Layout from "@narative/gatsby-theme-novela/src/components/Layout";
import Section from "@narative/gatsby-theme-novela/src/components/Section";
import SEO from "@narative/gatsby-theme-novela/src/components/SEO";
import Headings from "@narative/gatsby-theme-novela/src/components/Headings";

class TravelPage extends React.Component {
    handleSubmit(event) {
        var form = event.target; 
        var userid = form["userid"].value; 
        var email = form["email"].value; 
        var fullname = form["fullname"].value; 
        var destination = form["destination"].value; 
        var details = form["details"].value;

        var user = { 
            email: email, 
            name: fullname, 
            destination: destination, 
            details: details 
        };

        event.preventDefault();

        // Placeholder for an Identify call
        window.analytics.identify(
            userid, {
                email: email,
                name: fullname 
            }
        ); 
        // Placeholder for a Track call
        window.analytics.track(
            'Travel Form Submission',
            user
        );


        // Ecommerce Events
        window.analytics.track(
            'Products Searched', { 
                query: 'monopoly' 
            }
        );

        window.analytics.track(
            'Product List Viewed', { 
                list_id: 'hot_deals_1', 
                category: 'Deals', 
                products: [ { 
                    product_id: '507f1f77bcf86cd799439011', 
                    sku: '45790-32', 
                    name: 'Monopoly: 3rd Edition', 
                    price: 19, 
                    position: 1, 
                    category: 'Games', 
                    url: 'https://www.example.com/product/path', 
                    image_url: 'https://www.example.com/product/path.jpg' 
                }, { 
                    product_id: '505bd76785ebb509fc183733', 
                    sku: '46493-32', 
                    name: 'Uno Card Game', 
                    price: 3, 
                    position: 2, 
                    category: 'Games' 
                } ]
            }
        );

        window.analytics.track(
            'Product Viewed', {
                product_id: '507f1f77bcf86cd799439011',
                sku: 'G-32',
                category: 'Games',
                name: 'Monopoly: 3rd Edition',
                brand: 'Hasbro',
                variant: '200 pieces',
                price: 18.99,
                quantity: 1,
                coupon: 'MAYDEALS',
                currency: 'usd',
                position: 3,
                value: 18.99,
                url: 'https://www.example.com/product/path',
                image_url: 'https://www.example.com/product/path.jpg'
            }
        );

        window.analytics.track(
            'Product Added', {
                cart_id: 'skdjsidjsdkdj29j',
                product_id: '507f1f77bcf86cd799439011',
                sku: 'G-32',
                category: 'Games',
                name: 'Monopoly: 3rd Edition',
                brand: 'Hasbro',
                variant: '200 pieces',
                price: 18.99,
                quantity: 1,
                coupon: 'MAYDEALS',
                position: 3,
                url: 'https://www.example.com/product/path',
                image_url: 'https://www.example.com/product/path.jpg'
            }
        );

        window.analytics.track(
            'Order Completed', {
                checkout_id: 'fksdjfsdjfisjf9sdfjsd9f',
                order_id: '50314b8e9bcf000000000000',
                affiliation: 'Google Store',
                total: 27.50,
                subtotal: 22.50,
                revenue: 25.00,
                shipping: 3,
                tax: 2,
                discount: 2.5,
                coupon: 'hasbros',
                currency: 'USD',
                products: [ {
                    product_id: '507f1f77bcf86cd799439011',
                    sku: '45790-32',
                    name: 'Monopoly: 3rd Edition',
                    price: 19,
                    quantity: 1,
                    category: 'Games',
                    url: 'https://www.example.com/product/path',
                    image_url: 'https:///www.example.com/product/path.jpg'
                } ]
            }
        );


        form.reset();
    }

    render() {
        return (
            <Layout>
                <SEO />
                <Section>
                    <Headings.h1>Travel Form</Headings.h1>
                    <form name="travel" id="travel" method="post" onSubmit={this.handleSubmit}>
                        <label>
                            What is your favorite travel destination?
                            <br />
                            <input name="destination" id="destination" required="" size="81" type="text"/>
                        </label>
                        <br />
                        <br />
                        <label>
                            Any recommendations (cool things to do, places to visit or restaurants to eat)? 
                            <br /> 
                            <textarea cols="81" name="details" id="details" required="" rows="10"> </textarea>
                        </label>
                        <br />
                        <br />
                        <label>
                            Name:
                            <br />
                            <input name="fullname" id="fullname" required="" size="75" type="text"/>
                        </label>
                        <br />
                        <br />
                        <label>
                            Email:
                            <br />
                            <input name="email" id="email" required="" size="75" type="email"/>
                        </label>
                        <br />
                        <br />
                        <label>
                            UserId:
                            <br />
                            <input name="userid" id="userid" required="" size="75" type="text"/>
                        </label>
                        <br />
                        <button type="submit">Submit</button>
                        <br />
                        <input type="reset" value="Clear" />
                    </form>
                </Section>
            </Layout>
        );
    }
}

export default TravelPage;
