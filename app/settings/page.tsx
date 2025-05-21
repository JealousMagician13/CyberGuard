import PageHeader from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="Configure your security preferences" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage your API keys and service connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="virustotal-api">VirusTotal API</Label>
                  <p className="text-sm text-muted-foreground">Connected and working properly</p>
                </div>
                <Switch id="virustotal-api" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="google-api">Google Generative AI</Label>
                  <p className="text-sm text-muted-foreground">Connected and working properly</p>
                </div>
                <Switch id="google-api" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch id="email-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="browser-notifications">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts in your browser</p>
                </div>
                <Switch id="browser-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-risk-only">High Risk Alerts Only</Label>
                  <p className="text-sm text-muted-foreground">Only notify for high-risk threats</p>
                </div>
                <Switch id="high-risk-only" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="save-history">Save Scan History</Label>
                  <p className="text-sm text-muted-foreground">Store your scan history for future reference</p>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous-scans">Anonymous Scans</Label>
                  <p className="text-sm text-muted-foreground">Don't associate scans with your account</p>
                </div>
                <Switch id="anonymous-scans" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-collection">Data Collection</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymous usage data to improve services</p>
                </div>
                <Switch id="data-collection" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
