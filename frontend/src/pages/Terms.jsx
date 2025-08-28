import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-[#BE5F93]">i</span>Fund<span className="text-[#BE5F93]">Magic</span> Terms & Privacy
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to iFundMagic. By creating an account or using our services, you agree to these Terms of Service.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-8">
              
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">1.</span>
                  <h2 className="text-xl font-semibold text-gray-900">What iFundMagic Does</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• iFundMagic is a crowdfunding platform where creators post projects and backers pledge support.</li>
                  <li>• We provide the platform only. We do not guarantee project success or reward delivery.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">2.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Who Can Use iFundMagic</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• You must be at least 18 years old.</li>
                  <li>• You must provide accurate information when registering.</li>
                  <li>• You are responsible for all activity under your account.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">3.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Creators' Responsibilities</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• Accurately describe your project, funding goals, timelines, and rewards.</li>
                  <li>• If your project is funded, you are responsible for completing it and making a good-faith effort to deliver rewards.</li>
                  <li>• Do not post illegal, harmful, or infringing content.</li>
                  <li>• You are responsible for complying with tax and legal obligations related to funds you receive.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">4.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Backers' Responsibilities</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• Pledging is a form of support, not a purchase. Rewards are not guaranteed.</li>
                  <li>• Projects may be delayed or fail.</li>
                  <li>• Refunds are not guaranteed and are at the discretion of the creator.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">5.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• Payments are processed by third-party providers such as Stripe or PayPal.</li>
                  <li>• iFundMagic does not hold or control funds directly.</li>
                  <li>• Fees for payment processing may apply.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">6.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Platform Rights</h2>
                </div>
                <div className="ml-8">
                  <p className="text-gray-700 mb-3">We reserve the right to:</p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Remove or suspend projects or accounts that violate these Terms.</li>
                    <li>• Modify or discontinue any part of the platform.</li>
                    <li>• Update these Terms at any time, with changes effective once posted.</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">7.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Intellectual Property</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• Creators retain ownership of their content.</li>
                  <li>• By posting a project, you grant iFundMagic a non-exclusive license to display and promote it on the platform.</li>
                  <li>• We will respond to valid claims of intellectual property infringement.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">8.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• iFundMagic is provided "as is."</li>
                  <li>• We are not responsible for losses, damages, or disputes between creators and backers.</li>
                  <li>• Our liability to you is limited to the amount you paid to use the platform, if any.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">9.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Governing Law</h2>
                </div>
                <p className="text-gray-700 ml-8">
                  These Terms are governed by the laws of [Insert State/Country]. Disputes will be resolved in the courts or arbitration venues of the State of Ohio, USA.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;