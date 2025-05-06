import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { FluidBackground } from "@/components/ui/fluid-background"

export default function ContactPage() {
  return (
    <>
      <FluidBackground />

      <div className="container py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help. Fill out the form and we'll get back to you as
            soon as possible.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First name
                      </label>
                      <Input id="first-name" placeholder="John" className="bg-background/50 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last name
                      </label>
                      <Input id="last-name" placeholder="Doe" className="bg-background/50 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="john.doe@example.com"
                      type="email"
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      type="tel"
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={4}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <Button type="submit" className="w-full halo-button halo-button-primary">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">harshku612810@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">
                      GGITS
                      <br />
                      Jabalpur, Madhya Pradesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border border-white/10 p-6">
                <h3 className="font-medium text-lg mb-2">About Harsh Kumar</h3>
                <p className="text-muted-foreground mb-4">Founder & Legal Tech Innovator</p>
                <p className="text-sm text-muted-foreground">
                  Harsh Kumar is a legal tech entrepreneur passionate about making legal services accessible to everyone
                  through technology. With a background in both law and computer science, he founded LegalSathi to
                  bridge the gap between legal professionals and those seeking legal assistance.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
