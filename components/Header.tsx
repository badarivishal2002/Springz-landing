"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, Package, ShoppingBag, Phone } from "lucide-react"
import CartDrawer from "./CartDrawer"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <>
      {/* Top shipping banner */}
      <div className="bg-springz-green text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-medium">Free shipping on orders over ₹2,000</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-springz-cream sticky top-0 z-50 border-b border-springz-green/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/springz-logo.png"
                alt="Springz Nutrition"
                width={48}
                height={48}
                className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-2xl text-springz-green">Springz</span>
                <div className="text-xs font-semibold text-gray-600 tracking-wider">NUTRITION</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-springz-green transition-colors font-medium text-lg relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-springz-green transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Cart */}
              <div className="relative">
                <CartDrawer />
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="flex items-center gap-3 hover:bg-springz-green/10 px-4 py-2 rounded-full"
                    >
                      <div className="w-8 h-8 bg-springz-green rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName[0]}
                      </div>
                      <span className="font-medium text-gray-700">{user.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 bg-white border-springz-green/20">
                    <div className="px-3 py-2 bg-springz-cream rounded-lg mb-2">
                      <p className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.role === "admin" && (
                        <p className="text-xs text-springz-orange font-medium">Administrator</p>
                      )}
                    </div>
                    <DropdownMenuItem className="flex items-center py-3 hover:bg-springz-green/10">
                      <Package className="mr-3 h-5 w-5 text-springz-green" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center py-3 hover:bg-springz-green/10">
                      <Settings className="mr-3 h-5 w-5 text-springz-green" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-red-600 hover:bg-red-50 flex items-center py-3"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="hover:bg-gray-100 text-gray-700 font-medium px-6"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button 
                      size="lg" 
                      className="bg-springz-green hover:bg-springz-green/90 text-white font-medium px-8 py-3 rounded-lg"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <CartDrawer />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-springz-green/10 bg-white">
              <div className="px-2 pt-4 pb-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:bg-springz-green/10 hover:text-springz-green transition-colors font-medium rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="px-4 py-4 space-y-4 border-t border-springz-green/10 mt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-springz-cream rounded-lg">
                        <div className="w-10 h-10 bg-springz-green rounded-full flex items-center justify-center text-white font-semibold">
                          {user.firstName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.role === "admin" && (
                            <p className="text-xs text-springz-orange font-medium">Administrator</p>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-springz-green/10">
                        <Package className="mr-3 h-5 w-5 text-springz-green" />
                        My Orders
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/login" className="block">
                        <Button 
                          variant="ghost" 
                          size="lg" 
                          className="w-full hover:bg-gray-100"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" className="block">
                        <Button 
                          size="lg" 
                          className="w-full bg-springz-green hover:bg-springz-green/90 text-white"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}