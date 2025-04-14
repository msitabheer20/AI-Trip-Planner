"use client"

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">About TripNest</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Press</Link></li>
              <li><Link href="#" className="hover:text-white">Resources and Policies</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Trust & Safety</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Write a Review</Link></li>
              <li><Link href="#" className="hover:text-white">Add a Place</Link></li>
              <li><Link href="#" className="hover:text-white">Join</Link></li>
              <li><Link href="#" className="hover:text-white">Travelers&apos; Choice</Link></li>
              <li><Link href="#" className="hover:text-white">GreenLeaders</Link></li>
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Do Business With Us</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Owners</Link></li>
              <li><Link href="#" className="hover:text-white">Business Advantage</Link></li>
              <li><Link href="#" className="hover:text-white">Sponsored Placements</Link></li>
              <li><Link href="#" className="hover:text-white">Advertise with Us</Link></li>
              <li><Link href="#" className="hover:text-white">Access our Content API</Link></li>
              <li><Link href="#" className="hover:text-white">Become an Affiliate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Download Our App</h3>
            <p className="mb-4">Get the full experience and never miss out</p>
            <div className="flex flex-col gap-4">
              <Link href="#" className="hover:text-white bg-black px-4 py-2 rounded inline-flex items-center">
                <span>App Store</span>
              </Link>
              <Link href="#" className="hover:text-white bg-black px-4 py-2 rounded inline-flex items-center">
                <span>Google Play</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-sm text-center">
          <div className="flex justify-center gap-8 mb-4">
            <Link href="#" className="hover:text-white">Facebook</Link>
            <Link href="#" className="hover:text-white">Twitter</Link>
            <Link href="#" className="hover:text-white">Instagram</Link>
            <Link href="#" className="hover:text-white">Pinterest</Link>
          </div>
          <p>© {new Date().getFullYear()} TripNest LLC All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="#" className="hover:text-white">Terms of Use</Link>
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Content Policy</Link>
            <Link href="#" className="hover:text-white">Cookie Policy</Link>
            <Link href="#" className="hover:text-white">Cookie Settings</Link>
            <Link href="#" className="hover:text-white">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 