'use client';

import LazySection from '@/components/LazySection';
import TeamMemberProfile from '@/components/TeamMemberProfile';
import Button from '@/components/Button';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <LazySection direction="fade" delay={0}>
        <div className="relative min-h-[404px] flex items-center pt-32 bg-gray-50">
          {/* Content */}
          <div className="relative z-10 w-full">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="max-w-4xl">
                <h2 className="text-giga font-bold text-[#3b7d98] mb-6 text-left">
                  Without Our People We Are Nothing
                </h2>
                <div className="max-w-2xl">
                  <p className="text-lg text-gray-600 opacity-80 leading-relaxed">
                    Learn more about the spunky, creative, passionate and downright hard working team that makes up Topos Collective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Michelle Mullins Profile */}
      <LazySection direction="up" delay={200}>
        <TeamMemberProfile
          name="Michelle Mullins"
          title="Builder"
          description="With over a decade in the construction industry and an Austinite (a unicorn!), Michelle ties together experience and passion to bring Topos Collective to life."
          imageSrc="/images/michelle-mullins-team.png"
          imageAlt="Michelle Mullins"
          imagePosition="left"
          testimonial={{
            quote: "Not only can you count on Michelle to do the task at hand, but you get an opportunity to enjoy the process alongside her.",
            author: "Maryann",
            role: "Client",
            authorImage: "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTg5fHxwZXJzb258ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&q=60&w=200&h=200&crop=face"
          }}
        />
      </LazySection>

      {/* Katie Showell Profile */}
      <LazySection direction="up" delay={400}>
        <TeamMemberProfile
          name="Katie Showell"
          title="Operations"
          description="For over a decade Katie helped billion dollar companies optimize their operational profitability towards their goals. Katie started investing in real estate before realizing the real estate industry was a calling. As Strategic Director and Operations Leader, Katie brings the glue to the Topos Collective foundation."
          imageSrc="/images/katie-showell-team.png"
          imageAlt="Katie Showell"
          imagePosition="right"
          testimonial={{
            quote: "I highly recommend Katie and am grateful for the opportunity to have worked with her.",
            author: "Jamie",
            role: "Partner",
            authorImage: "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTg5fHxwZXJzb258ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&q=60&w=200&h=200&crop=face"
          }}
        />
      </LazySection>

      {/* Alan Avery Profile */}
      <LazySection direction="up" delay={600}>
        <TeamMemberProfile
          name="Alan Avery"
          title="Business Development"
          description="With over 25 years of experience building in both Austin and throughout the state of Montana, Alan is well-versed in new home construction and residential redevelopment. His near impeccable rate of success includes hundreds of happy customers and investors."
          imageSrc="/images/alan-avery-team.png"
          imageAlt="Alan Avery"
          imagePosition="left"
          testimonial={{
            quote: "Alan Avery went above and beyond and we're grateful.",
            author: "The Bonefioles",
            role: "Clients",
            authorImage: "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTg5fHxwZXJzb258ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&q=60&w=200&h=200&crop=face"
          }}
        />
      </LazySection>

      {/* Partnership Section */}
        <LazySection direction="up" delay={800}>
          <div className="py-20" style={{ backgroundColor: '#e8e8e8' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Column */}
              <div>
                <p className="text-sm text-[#3b7d98] font-semibold tracking-wider uppercase mb-4">
                  we&apos;re better together
                </p>
                <h2 className="text-4xl font-bold text-[#3b7d98]">
                  Partnership is everything.
                </h2>
              </div>

              {/* Right Column */}
              <div className="opacity-80">
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  We work with many local and national trades and vendors to execute our distinct vision. Interested in working with us?
                </p>
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  className="bg-[#3b7d98] hover:bg-[#2d5f75]"
                >
                  Apply to work with us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </LazySection>
    </div>
  );
}
