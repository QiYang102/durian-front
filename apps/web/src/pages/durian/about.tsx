import { createFileRoute } from "@tanstack/react-router";
import { DurianLayout } from "@/components/durian/DurianLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/durian/about")({
  component: DurianAbout,
});

function DurianAbout() {
  const platforms = [
    {
      name: "WhatsApp",
      description: "Quick orders, delivery inquiries, and corporate requests.",
      icon: MessageCircle,
      link: "https://wa.me/601158837608",
      actionText: "Chat on WhatsApp",
      colorClass: "text-emerald-500 hover:border-emerald-500",
    },
    {
      name: "Instagram",
      description:
        "Daily harvest updates, season drop announcements, and behind-the-scenes.",
      icon: Instagram,
      link: "https://www.instagram.com/durinow.88?igsh=MXhjcG91eHdpZ20wNA==",
      actionText: "Follow us",
      colorClass: "text-pink-500 hover:border-pink-500",
    },
    {
      name: "Facebook",
      description:
        "Community reviews, durian pairing discussions, and season announcements.",
      icon: Facebook,
      link: "https://www.facebook.com/share/1YWpKaEmiq/?mibextid=wwXIfr",
      actionText: "Like our page",
      colorClass: "text-blue-600 hover:border-blue-600",
    },
  ];

  return (
    <DurianLayout>
      <div className="max-w-4xl mx-auto w-full p-4 py-8 space-y-12">
        {/* Story Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About <span className="text-yellow-500 font-black">DuriNow</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Founded with a passion for the king of fruits, DuriNow is dedicated
            to bringing the absolute freshest, highest-quality durians directly
            from our local orchards in Raub, Pahang to your doorstep.
          </p>
        </div>

        {/* Mission Details */}
        <div className="pt-4">
          <div className="bg-slate-950 text-white rounded-xl p-10 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-center text-center items-center mx-auto max-w-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
            <span className="text-yellow-400 font-extrabold text-xs uppercase tracking-widest mb-3 block">
              Our Mission
            </span>
            <h4 className="text-3xl font-bold mb-6">Good Durian, Good Mood!</h4>
            <p className="text-slate-400 leading-relaxed text-base max-w-xl">
              We believe a great durian has the power to bring people together
              and spark joy. That's why we maintain strict standards from
              harvest to courier, guaranteeing a gold standard culinary
              experience in every single delivery box.
            </p>
          </div>
        </div>

        {/* Platforms Connect */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Connect With Us
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Have questions, custom inquiries, or just want to follow our
              harvest season? Tap any platform below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <Card
                  key={p.name}
                  className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300 group ${p.colorClass}`}
                >
                  <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-yellow-500/10 group-hover:text-yellow-600 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                          {p.name}
                        </h4>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2"
                    >
                      <Button className="w-full bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-950 font-bold transition-all shadow-sm">
                        {p.actionText}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DurianLayout>
  );
}
