"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Mail,
  Shield,
  Database,
  Bell,
  Users,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Upload,
  Download
} from "lucide-react"

// Mock settings data
const mockSettings = {
  general: {
    siteName: "Springz Nutrition",
    siteDescription: "Premium plant-based nutrition products",
    contactEmail: "info@springz.com",
    supportEmail: "support@springz.com",
    phoneNumber: "+91 98765 43210",
    address: "123 Health Street, Wellness City, India",
    timezone: "Asia/Kolkata",
    currency: "INR",
    language: "en",
    maintenanceMode: false
  },
  shipping: {
    freeShippingThreshold: 2000,
    standardShippingCost: 150,
    expressShippingCost: 299,
    estimatedDeliveryDays: "3-5",
    expressDeliveryDays: "1-2",
    enableCOD: true,
    codCharges: 50,
    enableInternational: false
  },
  payments: {
    razorpayEnabled: true,
    razorpayKeyId: "rzp_test_***",
    paytmEnabled: false,
    codEnabled: true,
    upiEnabled: true,
    netBankingEnabled: true,
    walletEnabled: true,
    autoCapture: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderConfirmation: true,
    shipmentUpdates: true,
    promotionalEmails: false,
    lowStockAlerts: true,
    newOrderAlerts: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    apiRateLimit: 1000,
    enableCaptcha: true,
    sslEnabled: true,
    autoBackup: true,
    backupFrequency: "daily"
  },
  seo: {
    metaTitle: "Springz Nutrition - Premium Plant-Based Supplements",
    metaDescription: "Discover premium plant-based protein powders and nutrition supplements. FSSAI certified, lab-tested products for your health and fitness goals.",
    metaKeywords: "plant protein, nutrition, supplements, FSSAI certified",
    enableSitemap: true,
    enableRobots: true,
    googleAnalyticsId: "GA_MEASUREMENT_ID",
    facebookPixelId: "",
    enableSchema: true
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async (section?: string) => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setLastSaved(new Date())
    // In a real app, you'd show a toast notification here
    alert(`Settings ${section ? `for ${section}` : ''} saved successfully!`)
  }

  const handleReset = async () => {
    // Reset to default values
    setSettings(mockSettings)
    alert('Settings reset to default values!')
  }

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'springz-settings.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
          {lastSaved && (
            <p className="text-sm text-gray-500 mt-1">
              Last saved: {lastSaved.toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all settings to their default values. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                  Reset All Settings
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={() => handleSave()} disabled={isSaving} className="bg-springz-green hover:bg-springz-green/90">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={settings.general.phoneNumber}
                    onChange={(e) => updateSetting('general', 'phoneNumber', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.general.timezone} 
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.general.currency} 
                    onValueChange={(value) => updateSetting('general', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.general.address}
                  onChange={(e) => updateSetting('general', 'address', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Maintenance Mode</p>
                    <p className="text-sm text-orange-700">Enable to show maintenance page to visitors</p>
                  </div>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => updateSetting('shipping', 'freeShippingThreshold', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="standardShippingCost">Standard Shipping Cost (₹)</Label>
                  <Input
                    id="standardShippingCost"
                    type="number"
                    value={settings.shipping.standardShippingCost}
                    onChange={(e) => updateSetting('shipping', 'standardShippingCost', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">Express Shipping Cost (₹)</Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    value={settings.shipping.expressShippingCost}
                    onChange={(e) => updateSetting('shipping', 'expressShippingCost', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="codCharges">COD Charges (₹)</Label>
                  <Input
                    id="codCharges"
                    type="number"
                    value={settings.shipping.codCharges}
                    onChange={(e) => updateSetting('shipping', 'codCharges', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDays">Standard Delivery Time</Label>
                  <Input
                    id="estimatedDeliveryDays"
                    value={settings.shipping.estimatedDeliveryDays}
                    onChange={(e) => updateSetting('shipping', 'estimatedDeliveryDays', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expressDeliveryDays">Express Delivery Time</Label>
                  <Input
                    id="expressDeliveryDays"
                    value={settings.shipping.expressDeliveryDays}
                    onChange={(e) => updateSetting('shipping', 'expressDeliveryDays', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Shipping Options</h4>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-600">Allow customers to pay on delivery</p>
                  </div>
                  <Switch
                    checked={settings.shipping.enableCOD}
                    onCheckedChange={(checked) => updateSetting('shipping', 'enableCOD', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">International Shipping</p>
                    <p className="text-sm text-gray-600">Enable shipping to international destinations</p>
                  </div>
                  <Switch
                    checked={settings.shipping.enableInternational}
                    onCheckedChange={(checked) => updateSetting('shipping', 'enableInternational', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Razorpay</p>
                      <p className="text-sm text-gray-600">Credit/Debit cards, UPI, Net Banking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.payments.razorpayEnabled ? "default" : "secondary"}>
                      {settings.payments.razorpayEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={settings.payments.razorpayEnabled}
                      onCheckedChange={(checked) => updateSetting('payments', 'razorpayEnabled', checked)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.payments.codEnabled}
                    onCheckedChange={(checked) => updateSetting('payments', 'codEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">UPI Payments</p>
                      <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm UPI</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.payments.upiEnabled}
                    onCheckedChange={(checked) => updateSetting('payments', 'upiEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Net Banking</p>
                      <p className="text-sm text-gray-600">Direct bank transfers</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.payments.netBankingEnabled}
                    onCheckedChange={(checked) => updateSetting('payments', 'netBankingEnabled', checked)}
                  />
                </div>
              </div>

              {settings.payments.razorpayEnabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <h4 className="font-medium text-blue-900">Razorpay Configuration</h4>
                  <div className="space-y-2">
                    <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                    <Input
                      id="razorpayKeyId"
                      value={settings.payments.razorpayKeyId}
                      onChange={(e) => updateSetting('payments', 'razorpayKeyId', e.target.value)}
                      placeholder="rzp_test_***"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Auto Capture Payments</p>
                      <p className="text-xs text-gray-600">Automatically capture payments on successful authorization</p>
                    </div>
                    <Switch
                      checked={settings.payments.autoCapture}
                      onCheckedChange={(checked) => updateSetting('payments', 'autoCapture', checked)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Order Confirmations</p>
                    <p className="text-sm text-gray-600">Send order confirmation emails to customers</p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderConfirmation}
                    onCheckedChange={(checked) => updateSetting('notifications', 'orderConfirmation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Shipment Updates</p>
                    <p className="text-sm text-gray-600">Notify customers about shipping status</p>
                  </div>
                  <Switch
                    checked={settings.notifications.shipmentUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications', 'shipmentUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when products are running low</p>
                  </div>
                  <Switch
                    checked={settings.notifications.lowStockAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'lowStockAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">New Order Alerts</p>
                    <p className="text-sm text-gray-600">Get instant notifications for new orders</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newOrderAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'newOrderAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & SEO tabs would be implemented similarly... */}
        
      </Tabs>

      {/* Save Button (sticky) */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            Changes are automatically saved
          </div>
          <Button 
            onClick={() => handleSave(activeTab)} 
            disabled={isSaving}
            className="bg-springz-green hover:bg-springz-green/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : `Save ${activeTab} Settings`}
          </Button>
        </div>
      </div>
    </div>
  )
}