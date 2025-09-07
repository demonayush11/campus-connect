import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ background: 'hsl(222.2, 84%, 4.9%)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">Contact Us</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out through our contact form, email, or phone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Contact Information</h2>
            <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }} className="backdrop-blur-lg border-white/10">
              <CardContent className="flex items-center space-x-4 p-6">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-lg text-white">Email</p>
                  <a href="mailto:contact@campuslinkr.com" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@campuslinkr.com
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }} className="backdrop-blur-lg border-white/10">
              <CardContent className="flex items-center space-x-4 p-6">
                <Phone className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-lg text-white">Phone</p>
                  <p className="text-muted-foreground">+01 9292928181</p>
                </div>
              </CardContent>
            </Card>
            <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }} className="backdrop-blur-lg border-white/10">
              <CardContent className="flex items-center space-x-4 p-6">
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-lg text-white">Address</p>
                  <p className="text-muted-foreground">Bhubaneswar, Odisha, India, 751001</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-3"
          >
            <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }} className="backdrop-blur-lg border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-muted-foreground">Your Name</Label>
                    <Input id="name" placeholder="John Doe" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }} className="border-white/20 mt-2 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-muted-foreground">Your Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }} className="border-white/20 mt-2 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-muted-foreground">Your Message</Label>
                    <Textarea id="message" placeholder="Your message..." style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }} className="border-white/20 mt-2 text-white" rows={5} />
                  </div>
                  <Button type="submit" className="w-full font-bold py-3 bg-gradient-to-r from-primary to-rose-500 hover:from-primary/90 hover:to-rose-500/90 transition-all duration-300 transform hover:scale-105">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Our Location</h2>
          <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }} className="backdrop-blur-lg border-white/10 overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119741.59929949694!2d85.74023232832032!3d20.29531182301931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%2Odischa%2C%20India!5e0!3m2!1sen!2sus!4v1689233642777!5m2!1sen!2sus"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
