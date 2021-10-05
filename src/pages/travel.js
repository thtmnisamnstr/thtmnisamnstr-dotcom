import React from "react";

import Layout from "@narative/gatsby-theme-novela/src/components/Layout";
import Section from "@narative/gatsby-theme-novela/src/components/Section";
import SEO from "@narative/gatsby-theme-novela/src/components/SEO";
import Headings from "@narative/gatsby-theme-novela/src/components/Headings";

class TravelPage extends React.Component {
    handleSubmit(event) {
        var form = event.target; 
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
            '1234', {
                email: email,
                name: fullname 
            }
        ); 
        // Placeholder for a Track call
        window.analytics.track(
            'Travel Form Submission',
            user
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
                            <input name="email" required="" size="75" type="email"/>
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
