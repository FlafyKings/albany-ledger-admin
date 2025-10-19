"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          <p className="text-center text-muted-foreground italic">
            Effective Date: November 1, 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed">
            The Albany Ledger ("we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard data when you use our mobile application ("The Albany Ledger" or "the App").
          </p>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">a. Information You Provide</h3>
            <p className="mb-3">
              We may collect personal information that you voluntarily share with us, such as:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Name, email address, and phone number when you create an account or join our mailing list</li>
              <li>Information you submit through app features (such as issue reports, feedback, or survey responses)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">b. Automatically Collected Information</h3>
            <p className="mb-3">
              When you use the App, we may automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Device information (such as model, operating system, unique identifiers)</li>
              <li>App usage data (such as screens visited, features used, crash logs)</li>
              <li>Location information (only if you grant permission within the App)</li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
            <p className="mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Provide, maintain, and improve the App's functionality</li>
              <li>Respond to questions, feedback, or support requests</li>
              <li>Send notifications and updates about community meetings, alerts, and news</li>
              <li>Monitor usage to ensure reliability, performance, and security</li>
              <li>Comply with legal obligations or resolve disputes</li>
            </ul>
            <p className="font-medium">
              We do not sell or rent your personal information to third parties.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Disclosure</h2>
            <p className="mb-3">
              We may share limited information only in the following situations:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Service Providers: With trusted vendors who assist us in operating the App (for example, hosting, analytics, or email delivery)</li>
              <li>Legal Requirements: If required by law, court order, or government request</li>
              <li>Aggregate or De-Identified Data: We may share summarized, non-identifiable information for research or reporting purposes</li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
            <p>
              We retain your personal information only as long as necessary to fulfill the purposes described in this policy or as required by law. You may request deletion of your account and data at any time by contacting us.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">5. Security</h2>
            <p>
              We implement reasonable technical and administrative safeguards to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no system is completely secure, and we cannot guarantee absolute protection.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p className="mb-3">
              You may:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access, update, or delete your account information</li>
              <li>Opt out of notifications or email updates</li>
              <li>Revoke location access at any time via your device settings</li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>
              The Albany Ledger is intended for use by individuals aged 13 and older. We do not knowingly collect personal information from children under 13. If we become aware that a child's data has been collected, we will delete it promptly.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">8. Links to Other Sites</h2>
            <p>
              The App may include links to external websites or third-party services. We are not responsible for the content or privacy practices of those sites.
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted within the App and on our website, with an updated effective date. Continued use of the App after changes means you accept the revised policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
