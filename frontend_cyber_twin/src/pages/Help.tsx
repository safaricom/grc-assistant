import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Search, Book, MessageCircle, Phone, Mail } from "lucide-react";

const Help = () => {
  const faqItems = [
    {
      question: "How do I interpret the threat level indicators?",
      answer: "Threat levels are color-coded: Green (Low) indicates minimal risk, Yellow (Medium) suggests moderate attention needed, and Red (High/Critical) requires immediate action. These levels are calculated based on real-time security data and risk assessments."
    },
    {
      question: "What should I do if I notice a security incident?",
      answer: "Immediately contact the SOC team at +254 722 000 911 or use the emergency alert button in the dashboard. Document what you observed and avoid taking any action that might compromise evidence."
    },
    {
      question: "How often is the dashboard data updated?",
      answer: "Most data is updated in real-time, with some metrics refreshed every 5 minutes. Network and system status indicators update continuously, while reports and analytics may have scheduled update intervals."
    },
    {
      question: "Can I customize the dashboard view?",
      answer: "Yes, you can customize widget layouts, set alert preferences, and configure notification settings through the Settings menu. Your role determines which customization options are available."
    },
    {
      question: "How do I access historical security reports?",
      answer: "Historical reports are available in the Reports section. You can filter by date range, division, or incident type. Export functionality is available for Excel and PDF formats."
    }
  ];

  const supportChannels = [
    {
      title: "SOC Emergency Line",
      description: "24/7 security incident response",
      contact: "+254 722 000 911",
      icon: Phone
    },
    {
      title: "IT Help Desk",
      description: "Technical support and system issues",
      contact: "helpdesk@safaricom.co.ke",
      icon: Mail
    },
    {
      title: "Live Chat",
      description: "Quick questions and guidance",
      contact: "Available 8 AM - 6 PM",
      icon: MessageCircle
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Help & Support</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Help Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input placeholder="Search for help topics, features, or procedures..." className="flex-1" />
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Book className="h-4 w-4 mr-2" />
                User Manual
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dashboard</span>
                <span className="text-sm text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monitoring</span>
                <span className="text-sm text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alerts</span>
                <span className="text-sm text-green-500">Operational</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {supportChannels.map((channel, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border">
                <channel.icon className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                  <p className="text-sm font-medium">{channel.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;