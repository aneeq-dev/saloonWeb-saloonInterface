import React from "react";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";

function HowItWorks(props) {
  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "2%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">How It Works</a>
          </nav>

          <div style={{ paddingLeft: "3%" }}>
            <p style={{fontSize:20}}>
              <h4>What is SASA?</h4>
              <br />
              SASA (Salon Appointment and Scheduling Application) is a platform
              for connecting a wide range of salon businesses with their
              customers under one platform. It connects customers and salons in
              an online community which allow users to surf salons and parlours,
              and book or cancel appointments. SASA’s main focus is salon
              businesses, which provides services like hair cutting and styling,
              cosmetic treatments, hair treatments etc. Fortunately, SASA
              enables large businesses as well as small salons and parlours and
              different variations of salons including spas, and rejuvenation
              centres to connect with their customers.
              <br />
              <br />
              <br />
              <h4> Benefit</h4>
              <br />
              <br />
              SASA will provide the facilities for scheduling the appointments
              for men’s saloons as well as ladies’ parlours. In this way, the
              customer’s time will be saved and owners can also boost their
              revenues by increasing the number of customers by using this
              application. They will only have to schedule appointments for
              his/her saloons and meet their customers. This will not only
              increase customer satisfaction but will allow the owners to
              utilize their resources more efficiently thus increasing their
              revenue.
              <br />
              <br />
              <br />
              <h4>Assumptions</h4>
            <br />
              <br />
              --- Users always need not to sign up first. We allow users, the
              freedom to explore the usability of SASA and when they find it
              worthy, they can sign up. Moreover, we will give an access to
              limited features without sign up and let them enjoy complete
              features once they sign up to the app.
              <br />
              <br />
              --- It is assumed that there is no desktop application, but users
              can still access the SASA on the web platform, if they are on
              desktop
             <br />
              <br />
              --- It is assumed that application users will have a functional
              Internet connection.
          <br />
              <br />
              --- It is also assumed that application users will have permit to
              use location of the device. As location services will be used to
              provide quality services like showing nearby saloons.
               <br />
              <br />
              --- The rates that will be displayed are totally dependent upon
              the saloons, but if there is any need according to situation, we
              ourselves manage the rates by asking from saloon owners.
              <br />
              <br />
              --- It is also assumed that web-view of the application is just
              for desktop version. If someone tries to access web-version from
              mobile web-browser, he/she will be redirected to download page of
              the mobile application.
              <br />
              <br />
              <br />
              <h4>How It Works?</h4>
              <br />
              <br />
              Yes, we care about you! If you are new to SASA, then you are at
              right place for understanding it's lifecycle. So, on the side menu
              bar, there are many options available.
              <br />
              <br />
              <h5>1- First option at top bar: "Browse Saloons"</h5>
              <br />
              In Browse Saloons you can browse different saloons, according
              to your gender, budget, quality you desire and more. After
              choosing saloon, you can add saloon deals, saloon services to your
              cart, and after selecting date and time you can make a request for
              appointment.
              <br />
              <br />
              <h5>2- Second option on side menu: "Filters"</h5>
              <br />
              In Filters Screen, you can search saloons by filtering with respect to  near your
              searched place, service prices, discounts on services, and by rating.
               You just have to search the place by writing place
              name in search bar. Then it will displayed the nearest saloons to
              that location. And you can select any one of them and make a
              request for appointment. Other filters also works same.
              <br />
              <br />
              <h5>3- Third option is: "Male Saloons"</h5>
              <br />
              In Male Saloons option, you can search Male saloons with respect to all
              the filters available as in previous option. You
              just have to select this option, it will display list of Male
              saloons with respect to filters. You can select any one of them and make a
              request for appointment.
             
              
              <br />
              <br />
              <h5>4- Fourth option is: "Female Saloons"</h5>
              <br />
              In Female Saloons option, just like above option, you can search Male saloons with respect to all
              the filters available as in previous option. You
              just have to select this option, it will display list of Male
              saloons with respect to filters. You can select any one of them and make a
              request for appointment.
              <br />
              <br />
              <h5>5- Fifth option is: "Appointments"</h5>
              <br />
              In Appointments section, you can keep track of your newly registered
              appointments as well as past registered appointments. The appointments have 6 status values
              <br />
              <br />
              <h5> 1) Confirming Appointment</h5>
              <br />
              This means your appointment has been registered and appointment is
              waiting for confirmation from saloon you registered with. {
              }{" "}
              <br />
              <br />
              <h5>2) Confirmed Appointment</h5>
              <br />
              This means your registered appointment has been confirmed by
              saloon, and you need to go to saloon at that specific time.{" "}
              <br />
              <br /> <h5>3) Completed Appointment</h5>
              <br />
              This means that either you successfully completed your appointment
              by going to the saloon or time passed, but you did not arrive the
              saloon at right time.
              <br />
              <br />
              <h5>4) Cancelled by Saloon before confirming</h5>
              <br /> The appointment got cancelled from saloon before confirming
              status just simply means that your saloon had not enough time to
              get schedule your appointment within your selected time.
              <br />
              <br />
              <h5>5) Cancelled by Saloon after confirming</h5>
              <br />
              The Cancelled by Saloon after confirming just simply means your
              appointment was cancelled by saloon owner after confirming your
              appointment. In this matter, we introduce the option for you to
              rate the saloon, because you have the right to rate the saloon as
              appointment that got confirmed needs to be completed.
              <br />
              <br />
              <h5>6) Time Passed </h5>
              <br />
              The Time Passed status simply says that either the appointment not
              completed by saloon owner or customer did not go to the saloon. So
              in order to tackle this you can contact on the email or contact
              number provided in Contact Us from side menu. We will sort out!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
