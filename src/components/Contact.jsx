import React from 'react';
import './Contact.css';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-container">
        <div className="get-in-touch fade-in">
          <p className="section-label">Get in Touch</p>
          <h2>Connect with <span>Bhaktivedanta Hospital</span></h2>
          <p className="contact-intro">
            We are here to help you. Reach out to us via phone, email, or visit our facility.
          </p>
          
          <div className="contact-items">
             <div className="contact-item">
               <div className="icon-box"><Phone size={24} /></div>
               <div className="details">
                 <h4>Phone Number</h4>
                 <p>+91 22 2845 1234</p>
               </div>
             </div>

             <div className="contact-item">
               <div className="icon-box"><Mail size={24} /></div>
               <div className="details">
                 <h4>Email Address</h4>
                 <p>info@bhaktivedantahospital.com</p>
               </div>
             </div>

             <div className="contact-item">
               <div className="icon-box"><MapPin size={24} /></div>
               <div className="details">
                 <h4>Visit Us</h4>
                 <p>Mira Road East, Thane, Maharashtra 401107</p>
               </div>
             </div>

             <div className="contact-item">
               <div className="icon-box"><Clock size={24} /></div>
               <div className="details">
                 <h4>Working Hours</h4>
                 <p>Open 24/7 for Emergencies</p>
               </div>
             </div>
          </div>
        </div>

        <div className="appointment-form fade-in">
          <h3>Book an Appointment</h3>
          <p>Fill out the form below to schedule a consultation.</p>
          <form>
            <div className="form-group row">
               <div className="form-field">
                 <label>Full Name</label>
                 <input type="text" placeholder="Your Name" />
               </div>
               <div className="form-field">
                 <label>Phone Number</label>
                 <input type="text" placeholder="+91" />
               </div>
            </div>
            
            <div className="form-group">
               <label>Email Address</label>
               <input type="email" placeholder="example@gmail.com" />
            </div>

            <div className="form-group row">
               <div className="form-field">
                 <label>Department</label>
                 <select>
                   <option>Select Department</option>
                   <option>Cardiology</option>
                   <option>Neurology</option>
                 </select>
               </div>
               <div className="form-field">
                 <label>Preferred Date</label>
                 <input type="date" />
               </div>
            </div>

            <div className="form-group">
               <label>Your Message</label>
               <textarea placeholder="Write your message here..."></textarea>
            </div>

            <button type="submit" className="btn-primary form-submit">Book Appointment</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
