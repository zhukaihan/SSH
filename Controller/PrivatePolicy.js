import React, {Component} from 'react';
import ReactNative, { Platform,StyleSheet, View, Text, Button, Alert, ScrollView, TextInput,TouchableOpacity, Picker,SafeAreaView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import RF from 'react-native-responsive-fontsize';

export default class PrivatePolicy extends Component{
    constructor(props) { 
        super(props);
     
        this.state = {
           checked: false,
        };
     };

    nextslide = () => {
        if(this.state.checked == true){
        this.props.navigation.navigate("CreateProfile1Page")
        }else{
            Alert.alert(
                'You must agree to our terms and service in order to continue',
                '',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
        }
    }
    render(){
        return(
            <SafeAreaView style={styles.pageContainer}>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.sectiontitle}>
                    PRIVACY POLICY </Text>
                    <Text style={styles.greyWords}>
                        Last updated June 02, 2019</Text>
                    <Text style={styles.greyWords}> 
                        Thank you for choosing to be part of our community at Student to Student Housing (“Company”, “we”, “us”, or “our”). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at ytw001@ucsd.edu. 
                        When you visit our mobile application, and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our Apps and our services.
                        This privacy policy applies to all information collected through our mobile application, ("Apps"), and/or any related services, sales, marketing or events (we refer to them collectively in this privacy policy as the "Sites").
                        Please read this privacy policy carefully as it will help you make informed decisions about sharing your personal information with us. 
                    </Text>
                    <Text style={styles.sectiontitle}>
                        TABLE OF CONTENTS </Text>
                    <Text style={styles.subsection}>
                        1. WHAT INFORMATION DO WE COLLECT?</Text>
                        <Text style={styles.subsection}>
                        2. HOW DO WE USE YOUR INFORMATION? </Text>
                        <Text style={styles.subsection}>
                        3. WILL YOUR INFORMATION BE SHARED WITH ANYONE? </Text>
                        <Text style={styles.subsection}>
                        4. WHO WILL YOUR INFORMATION BE SHARED WITH? </Text>
                        <Text style={styles.subsection}>
                        5. HOW DO WE HANDLE YOUR SOCIAL LOGINS? </Text>
                        <Text style={styles.subsection}>
                        6. HOW LONG DO WE KEEP YOUR INFORMATION? </Text>
                        <Text style={styles.subsection}>
                        7. HOW DO WE KEEP YOUR INFORMATION SAFE? </Text>
                        <Text style={styles.subsection}>
                        8. WHAT ARE YOUR PRIVACY RIGHTS? </Text>
                        <Text style={styles.subsection}>
                        9. CONTROLS FOR DO-NOT-TRACK FEATURES </Text>
                        <Text style={styles.subsection}>
                        10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS? </Text>
                        <Text style={styles.subsection}>
                        11. DO WE MAKE UPDATES TO THIS POLICY? </Text>
                        <Text style={styles.subsection}>
                        12. HOW CAN YOU CONTACT US ABOUT THIS POLICY? 
                        </Text>
                        <Text style={styles.sectiontitle}>
                        1. WHAT INFORMATION DO WE COLLECT? 
                        </Text>
                        <Text style={styles.greyWords}>
                        Personal information you disclose to us </Text>
                        <Text style={styles.greyWords}>
                        In Short: We collect personal information that you provide to us such as name, address, contact information, passwords and security data, payment information, and social media login data. </Text>
                        <Text style={styles.greyWords}>
                        We collect personal information that you voluntarily provide to us when registering at the Apps, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Apps (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise contacting us.</Text>
                        <Text style={styles.greyWords}>
                        The personal information that we collect depends on the context of your interactions with us and the Apps, the choices you make and the products and features you use. The personal information we collect can include the following: </Text>
                        <Text style={styles.greyWords}>
                        Name and Contact Data. We collect your first and last name, email address, postal address, phone number, and other similar contact data. </Text>
                        <Text style={styles.greyWords}>
                        Credentials. We collect passwords, password hints, and similar security information used for authentication and account access.</Text>
                        <Text style={styles.greyWords}>
                        Payment Data. We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by our payment processor and you should review its privacy policies and contact the payment processor directly to respond to your questions. 
                        </Text><Text style={styles.greyWords}>Social Media Login Data. We provide you with the option to register using social media account details, like your Facebook, Twitter or other social media account. If you choose to register in this way, we will collect the Information described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS " below. 
                        </Text><Text style={styles.greyWords}>All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information. 
                        </Text><Text style={styles.subsection}>Information automatically collected 
                        </Text><Text style={styles.greyWords}>In Short: Some information – such as IP address and/or browser and device characteristics – is collected automatically when you visit our Apps

                        </Text><Text style={styles.greyWords}>We automatically collect certain information when you visit, use or navigate the Apps. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Apps and other technical information. This information is primarily needed to maintain the security and operation of our Apps, and for our internal analytics and reporting purposes. 
                        </Text><Text style={styles.subsection}>Information collected through our Apps
                        </Text><Text style={styles.greyWords}>In Short: We may collect information regarding your mobile device, when you use our apps. 
                        </Text><Text style={styles.greyWords}>If you use our Apps, we may also collect the following information: 
                        </Text><Text style={styles.greyWords}>Mobile Device Access. We may request access or permission to certain features from your mobile device, including your mobile device’s camera, social media accounts, ucsd accounts, and other features. If you wish to change our access or permissions, you may do so in your device’s settings.
                        </Text><Text style={styles.greyWords}>Mobile Device Data. We may automatically collect device information (such as your mobile device ID, model and manufacturer), operating system, version information and IP address. 

                        </Text><Text style={styles.subsection}>Information collected from other sources

                        </Text><Text style={styles.greyWords}>In Short: We may collect limited data from public databases, marketing partners, social media platforms, and other outside sources. 

                        </Text><Text style={styles.greyWords}>We may obtain information about you from other sources, such as public databases, joint marketing partners, social media platforms (such as Facebook), as well as from other third parties. Examples of the information we receive from other sources include: social media profile information (your name, gender, birthday, email, current city, state and country, user identification numbers for your contacts, profile picture URL and any other information that you choose to make public); marketing leads and search results and links, including paid listings (such as sponsored links).

                        </Text><Text style={styles.sectiontitle}>2. HOW DO WE USE YOUR INFORMATION?
                        </Text><Text style={styles.greyWords}>In Short: We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. 

                        </Text><Text style={styles.greyWords}>We use personal information collected via our Apps for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below. 

                        </Text><Text style={styles.greyWords}>We use the information we collect or receive: 


                        </Text><Text style={styles.greyWords}>To facilitate account creation and logon process. If you choose to link your account with us to a third party account *(such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process. See the section below headed " HOW DO WE HANDLE YOUR SOCIAL LOGINS " for further information. 
                        </Text><Text style={styles.greyWords}>To send you marketing and promotional communications. We and/or our third party marketing partners may use the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt-out of our marketing emails at any time (see the " WHAT ARE YOUR PRIVACY RIGHTS " below). 

                        </Text><Text style={styles.greyWords}>Fulfill and manage your orders. We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Apps. 

                        </Text><Text style={styles.greyWords}>Request Feedback. We may use your information to request feedback and to contact you about your use of our Apps.

                        </Text><Text style={styles.greyWords}>To protect our Sites. We may use your information as part of our efforts to keep our Apps safe and secure (for example, for fraud monitoring and prevention). 

                        </Text><Text style={styles.greyWords}>To enable user-to-user communications. We may use your information in order to enable user-to-user communications with each user's consent. 

                        </Text><Text style={styles.greyWords}>To respond to legal requests and prevent harm. If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.

                        </Text><Text style={styles.sectiontitle}>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE? 
                        </Text><Text style={styles.greyWords}>In Short: We only share information with your consent, to comply with laws, to protect your rights, or to fulfill business obligations.

                        </Text><Text style={styles.greyWords}>We may process or share data based on the following legal basis: 
                        </Text><Text style={styles.greyWords}>Consent: We may process your data if you have given us specific consent to use your personal information in a specific purpose. 
                        </Text><Text style={styles.greyWords}>Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests. 
                        </Text><Text style={styles.greyWords}>Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.

                        </Text><Text style={styles.greyWords}>Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements). 

                        </Text><Text style={styles.greyWords}>Vital Interests: We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved. 

                        </Text><Text style={styles.greyWords}>More specifically, we may need to process your data or share your personal information in the following situations:  

                        </Text><Text style={styles.greyWords}>Vendors, Consultants and Other Third-Party Service Providers. We may share your data with third party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: payment processing, data analysis, email delivery, hosting services, customer service and marketing efforts. We may allow selected third parties to use tracking technology on the Apps, which will enable them to collect data about how you interact with the Apps over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity. Unless described in this Policy, we do not share, sell, rent or trade any of your information with third parties for their promotional purposes. 

                        </Text><Text style={styles.greyWords}>Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company


                        </Text><Text style={styles.sectiontitle}>4. WHO WILL YOUR INFORMATION BE SHARED WITH? 
                        </Text><Text style={styles.greyWords}>In Short: We only share information with the following third parties. We only share and disclose your information with the following third parties. We have categorized each party so that you may be easily understand the purpose of our data collection and processing practices. If we have processed your data based on your consent and you wish to revoke your consent, please contact us. 
                        </Text><Text style={styles.greyWords}>Allow Users to Connect to their Third-Party Accounts and Google account
                        </Text><Text style={styles.greyWords}>And Google account

                        </Text><Text style={styles.greyWords}>Communicate and Chat with Users
                        </Text><Text style={styles.greyWords}> Cloud Messaging

                        </Text><Text style={styles.greyWords}>Functionality and Infrastructure Optimization 
                        </Text><Text style={styles.greyWords}>Cloud Firestore 
                        </Text><Text style={styles.greyWords}>User Account Registration and Authentication 
                        </Text><Text style={styles.greyWords}>Google OAuth 2.0 and Google Sign-In 
                        </Text><Text style={styles.sectiontitle}>5. HOW DO WE HANDLE YOUR SOCIAL LOGINS? 
                        </Text><Text style={styles.greyWords}>In Short: If you choose to register or log in to our websites using a social media account, we may have access to certain information about you. 
                        </Text><Text style={styles.greyWords}>Our Apps offer you the ability to register and login using your third party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile Information we receive may vary depending on the social media provider concerned, but will often include your name, e-mail address, friends list, profile picture as well as other information you choose to make public.

                        </Text><Text style={styles.greyWords}>We will use the information we receive only for the purposes that are described in this privacy policy or that are otherwise made clear to you on the Apps. Please note that we do not control, and are not responsible for, other uses of your personal information by your third party social media provider. We recommend that you review their privacy policy to understand how they collect, use and share your personal information, and how you can set your privacy preferences on their sites and apps. 

                        </Text><Text style={styles.sectiontitle}>6. HOW LONG DO WE KEEP YOUR INFORMATION? 
                        </Text><Text style={styles.greyWords}>Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law. 
                        </Text><Text style={styles.greyWords}>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us.

                        </Text><Text style={styles.greyWords}>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible. 
                        </Text><Text style={styles.sectiontitle}>7. HOW DO WE KEEP YOUR INFORMATION SAFE? 
                        </Text><Text style={styles.greyWords}>In Short: We aim to protect your personal information through a system of organizational and technical security measures. 
                        </Text><Text style={styles.greyWords}>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Apps is at your own risk. You should only access the services within a secure environment.

                        </Text><Text style={styles.sectiontitle}>8. WHAT ARE YOUR PRIVACY RIGHTS?
                        </Text><Text style={styles.greyWords}>In Short: You may review, change, or terminate your account at any time. 
                        </Text><Text style={styles.greyWords}>If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm 
                        </Text><Text style={styles.greyWords}>Account Information 
                        </Text><Text style={styles.greyWords}>If you would at any time like to review or change the information in your account or terminate your account, you can: 
                        </Text><Text style={styles.greyWords}>Log into your account settings and update your user account. 
                        </Text><Text style={styles.greyWords}>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.

                        </Text><Text style={styles.greyWords}>Opting out of email marketing: You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the emails that we send or by contacting us using the details provided below. You will then be removed from the marketing email list – however, we will still need to send you service-related emails that are necessary for the administration and use of your account. To otherwise opt-out, you may:
                        </Text><Text style={styles.greyWords}> Access your account settings and update preferences. 
                        </Text><Text style={styles.subsection}>9. CONTROLS FOR DO-NOT-TRACK FEATURES 
                        </Text><Text style={styles.greyWords}>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Policy.

                        </Text><Text style={styles.sectiontitle}>10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                        </Text><Text style={styles.greyWords}>In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.

                        </Text><Text style={styles.greyWords}>California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits out users who are California residents to request and obtain from us, once a year and free of charge information about categories of personal information ( if any) we disclosed to third parties to direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.

                        </Text><Text style={styles.greyWords}>If you are under 18 years of age, reside in California, and have a registered account with the Apps, you have the right to request removal of unwanted data that you publicly post on the Apps. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Apps, but please be aware that the data may not be completely or comprehensively removed from our systems.

                        </Text><Text style={styles.subsection}>11. DO WE MAKE UPDATES TO THIS POLICY? 
                        </Text><Text style={styles.greyWords}>In Short: Yes, we will update this policy as necessary to stay compliant with relevant laws. 
                        </Text><Text style={styles.greyWords}>may update this privacy policy from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information. 

                        </Text><Text style={styles.sectiontitle}>12. HOW CAN YOU CONTACT US ABOUT THIS POLICY?

                        </Text><Text style={styles.greyWords}>If you have questions or comments about this policy, you may email us at ytw001@ucsd.edu or by post to:

                        </Text><Text style={styles.greyWords}>Student to Student Housing
                        </Text><Text style={styles.greyWords}>4500 Gilman.dr
                        </Text><Text style={styles.greyWords}>La Jolla, CA 92093
                        </Text><Text style={styles.greyWords}>United States</Text>
                    </ScrollView>
                    <View style={{flex:.1, width:"100%"}}>
                        <CheckBox center title="I agree with the private policy"
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.state.checked}
                        onPress={() => this.setState({checked: !this.state.checked})}
                        style={{flex:1, width:"100%"}}></CheckBox>
                    </View>
                    <View style={{width: '100%', left: 0, flexDirection:'row', height:75}}>
                    <View style={styles.backButton}>
                        <Text style={styles.buttontextstyle}>Back</Text>
                    </View>
                    <View style={styles.nextButton}>
                        <TouchableOpacity onPress={this.nextslide} style={styles.nextButtonStyle}>
                            <Text style={styles.buttontextstyle}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    nextButton:{
        height: "100%",
        flexDirection:"row",
        justifyContent: "center",
        alignItems:"center",
        flex:.5,
    },
    nextButtonStyle:{
        height: "60%",
        width: "80%",
        borderRadius:10,
        backgroundColor:"#2ea9df",
        borderColor:"#2ea9df",
        borderWidth:4,
        alignItems: "center",
        justifyContent: "center",
    },
    backButton:{
        height: "100%",
        flexDirection:"row",
        justifyContent: "center",
        alignItems:"center",
        flex:.5,
    },
    backButtonStyle:{
        height: "60%",
        width: "80%",
        borderRadius:10,
        backgroundColor:"#2ea9df",
        borderColor:"#2ea9df",
        borderWidth:4,
        alignItems: "center",
        justifyContent: "center",
    },
    buttontextstyle:{
        textAlign:'center',
        fontSize:RF(3),
        color: "#fff",
        paddingLeft: RF(1),
        paddingRight: RF(1),
    },
    sectiontitle:{
        fontSize:RF(3),
        color:"black",
        fontWeight: "bold",
        paddingBottom: RF(1),
        paddingHorizontal: RF(1),
    },
    greyWords:{
        fontSize:RF(2),
        color:"grey",
        paddingBottom: RF(1),
        paddingHorizontal: RF(1),
    },
    BigTitle:{
        fontSize:RF(4),
        color:"black",
        fontWeight:"bold",
        paddingBottom: RF(1),
        paddingHorizontal: RF(1),
    },
    subsection:{
        fontSize: RF(2.5),
        color:"black",
        fontWeight:"bold",
        paddingBottom: RF(1),
        paddingHorizontal: RF(1),
    },
    scrollView:{
        flex:.6,
        borderRadius:1,
        borderColor:"black",
    },    
    pageContainer:{
        flex:1,
        flexDirection:"column",
        borderWidth: 20,
        borderColor:"#2ea9df",
    },
})