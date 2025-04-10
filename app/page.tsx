"use client"

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, User, Star, ChevronDown, Menu, X, Heart, MessageSquare, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      // For the main navbar sticky effect
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // For showing additional links after scrolling past search section
      if (searchSectionRef.current) {
        const searchSectionRect = searchSectionRef.current.getBoundingClientRect();
        if (searchSectionRect.bottom < 0) {
          setShowSubNav(true);
        } else {
          setShowSubNav(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className={`${isScrolled ? 'fixed top-0 left-0 right-0 border-b border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm z-50' : 'bg-white'} transition-all duration-300`}>
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#34e0a1] to-[#00aa6c] p-2.5 rounded-xl shadow-md transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <MapPin size={24} className="text-white drop-shadow-sm" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Trip<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34e0a1] to-[#00aa6c]">Nest</span>
              </span>
            </div>
          </div>
          <nav className="hidden md:flex justify-center items-center gap-8">
            <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
              Discover
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
              Trips
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
              Review
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group">
              Forums
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Heart size={22} />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Bell size={22} />
            </button>
            <Button className="text-white rounded-full font-bold border border-gray-300 hover:bg-[#34e0a1] hover:text-white hover:border-transparent transition-all duration-300 py-6">Sign In</Button>
          </div>
          <button 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 py-4 border-t">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
                Discover
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
                Trips
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
                Review
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="text-black hover:text-[#34e0a1] font-medium transition-colors duration-200 relative group w-fit">
                Forums
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#34e0a1] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" className="w-full">Review</Button>
              <Button className="w-full text-black border border-gray-300 hover:bg-[#34e0a1] hover:text-white hover:border-transparent transition-all duration-300">Sign In</Button>
            </div>
          </div>
        )}
        
        {/* Additional navigation links after scrolling */}
        {showSubNav && isScrolled && (
          <div className="hidden md:block border-t border-gray-200 py-2 bg-white/95 backdrop-blur-sm">
            <div className="container max-w-5xl mx-auto px-4">
              <nav className="flex justify-center gap-8">
                <a href="#" className="text-black hover:text-black font-medium transition-colors duration-200 relative group py-1">
                  <div className="flex items-center gap-1">
                    <Search size={14} />
                    <span>Search All</span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="text-black hover:text-black font-medium transition-colors duration-200 relative group py-1">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>Hotels</span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="text-black hover:text-black font-medium transition-colors duration-200 relative group py-1">
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>Things to do</span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="text-black hover:text-black font-medium transition-colors duration-200 relative group py-1">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Restaurants</span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="text-black hover:text-black font-medium transition-colors duration-200 relative group py-1">
                  <div className="flex items-center gap-1">
                    <Bell size={14} />
                    <span>Flights</span>
                  </div>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Search section */}
      <div ref={searchSectionRef} className={`container max-w-5xl mx-auto px-4 py-12 flex flex-col items-center ${isScrolled ? 'pt-24' : ''}`}>
        <div className="text-5xl font-bold mb-6">Where to?</div>
        <Tabs defaultValue="all" className="w-full max-w-3xl">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Search size={16} />
              Search All
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <MapPin size={16} />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="things" className="flex items-center gap-2">
              <Star size={16} />
              Things to do
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <User size={16} />
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="flights" className="hidden md:flex items-center gap-2">
              <Bell size={16} />
              Flights
            </TabsTrigger>
            <TabsTrigger value="homes" className="hidden md:flex items-center gap-2">
              <Heart size={16} />
              Holiday Homes
            </TabsTrigger>
            </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="flex items-center w-full rounded-full border border-input overflow-hidden h-14 p-1">
              <div className="pl-4">
                <Search size={20} className="text-gray-500" />
              </div>
                <Input 
                placeholder="Search for a destination, attraction, hotel, etc." 
                className="flex-1 border-none h-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <Button className="h-full px-6 bg-[#34e0a1] text-black hover:bg-[#2bc889] rounded-full">
                Search
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="hotels" className="mt-0">
            <div className="flex items-center w-full rounded-full border border-input overflow-hidden h-14 p-1">
              <div className="pl-4">
                <Search size={20} className="text-gray-500" />
              </div>
                  <Input 
                placeholder="Search for hotels" 
                className="flex-1 border-none h-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
              <Button className="h-full px-6 bg-[#34e0a1] text-black hover:bg-[#2bc889] rounded-full">
                Search
              </Button>
                </div>
          </TabsContent>
          
          <TabsContent value="things" className="mt-0">
            <div className="flex items-center w-full rounded-full border border-input overflow-hidden h-14 p-1">
              <div className="pl-4">
                <Search size={20} className="text-gray-500" />
              </div>
                  <Input 
                placeholder="Search for activities and attractions" 
                className="flex-1 border-none h-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
              <Button className="h-full px-6 bg-[#34e0a1] text-black hover:bg-[#2bc889] rounded-full">
                Search
              </Button>
                </div>
          </TabsContent>
          
          <TabsContent value="restaurants" className="mt-0">
            <div className="flex items-center w-full rounded-full border border-input overflow-hidden h-14 p-1">
              <div className="pl-4">
                <Search size={20} className="text-gray-500" />
              </div>
              <Input 
                placeholder="Search for restaurants" 
                className="flex-1 border-none h-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <Button className="h-full px-6 bg-[#34e0a1] text-black hover:bg-[#2bc889] rounded-full">
                Search
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="flights" className="mt-0">
            <div className="flex items-center w-full rounded-full border border-input overflow-hidden h-14 p-1">
              <div className="pl-4">
                <Search size={20} className="text-gray-500" />
        </div>
              <Input 
                placeholder="Search for flights" 
                className="flex-1 border-none h-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <Button className="h-full px-6 bg-[#34e0a1] text-black hover:bg-[#2bc889] rounded-full">
                Search
              </Button>
                </div>
          </TabsContent>
          
          <TabsContent value="homes" className="mt-0">
            <div className="flex items-center w-full rounded-full border border-input overflow-hidden h-14 p-1">
              <div className="pl-4">
                <Search size={20} className="text-gray-500" />
              </div>
              <Input 
                placeholder="Search for holiday homes" 
                className="flex-1 border-none h-full px-2 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
              <Button className="h-full px-6 bg-[#34e0a1] text-black hover:bg-[#2bc889] rounded-full">
                Search
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Trip Builder section */}
      <section className="container max-w-5xl mx-auto my-8 rounded-xl overflow-hidden shadow-sm">
        <div className="relative">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1626883393668-3247e452f559?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRhcmslMjBibHVlJTIwb2NlYW58ZW58MHx8MHx8fDA%3D"
              alt="Blue Ocean View"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 px-8 py-12">
            <div className="max-w-xl">
              <div className="text-xs text-white mb-2">Powered by <span className='font-bold bg-[#0066cc] text-white px-2 py-1 rounded-full'>AIBeta</span></div>
              <h2 className="text-3xl font-bold mb-3 text-white">Plan your kind of trip</h2>
              <p className="text-lg text-white mb-6">
                Get custom recs for all the things<br />
                you're into with AI trip builder
              </p>
              <Button className="bg-white hover:bg-gray-100 text-[#0066cc] px-8 py-6 rounded-full text-lg font-medium shadow-md transition-transform hover:scale-105 border-none" onClick={() => window.location.href = "/trip-planner"}>
                Start a trip with AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to tour section */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Ways to tour Goa</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 px-4 rounded-full cursor-pointer">
            Boat Tours
          </Badge>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 px-4 rounded-full cursor-pointer">
            Private Tours
          </Badge>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 px-4 rounded-full cursor-pointer">
            Day Trips
          </Badge>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 px-4 rounded-full cursor-pointer">
            Bus Tours
          </Badge>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 px-4 rounded-full cursor-pointer">
            Adventure Tours
          </Badge>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {[
              { title: "Goa Private Tour with Lunch and Transport", price: "₹5,999", rating: 4.8, reviews: 254, image: "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?q=80&w=1770&auto=format&fit=crop" },
              { title: "South Goa Sightseeing Full Day Tour", price: "₹3,599", rating: 4.6, reviews: 187, image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1770&auto=format&fit=crop" },
              { title: "North Goa Beach Hopping with Guide", price: "₹4,299", rating: 4.9, reviews: 325, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1965&auto=format&fit=crop" },
              { title: "Dudhsagar Falls & Spice Plantation Tour", price: "₹4,999", rating: 4.7, reviews: 198, image: "https://plus.unsplash.com/premium_photo-1669035429780-1c445170c382?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHVkaHNhZ2FyJTIwZmFsbHN8ZW58MHx8MHx8fDA%3D" }
          ].map((exp, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow p-0 overflow-hidden">
                  <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                      src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-white text-black">
                  From {exp.price}
                </Badge>
                    <button className="absolute top-4 left-4 text-white bg-black bg-opacity-40 p-1 rounded-full">
                      <Heart size={20} />
                    </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2 text-lg">{exp.title}</h3>
                <div className="flex items-center gap-1 text-sm">
                      <div className="flex text-[#00aa6c]">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(exp.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="font-bold">{exp.rating}</span>
                  <span className="text-gray-500">({exp.reviews} reviews)</span>
                </div>
              </CardContent>
            </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Top destinations */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'Goa', image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=1770&auto=format&fit=crop' },
            { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1942&auto=format&fit=crop' },
            { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1770&auto=format&fit=crop' },
            { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1770&auto=format&fit=crop' }
          ].map((city, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img 
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white text-xl font-bold">{city.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel inspiration section */}
      <section className="bg-gray-50 py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Travel Inspiration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Top 10 Beaches in Goa",
                excerpt: "Explore the most beautiful beaches with crystal clear waters and golden sands.",
                image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1772&auto=format&fit=crop"
              },
              { 
                title: "Hidden Gems of Mumbai",
                excerpt: "Discover the secret spots most tourists never find in this vibrant city.", 
                image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1772&auto=format&fit=crop"
              },
              { 
                title: "Ultimate Delhi Food Guide",
                excerpt: "From street food to fine dining, explore the best culinary experiences.", 
                image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1772&auto=format&fit=crop"
              },
            ].map((item, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden p-0">
                <div className="aspect-video relative">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                      </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-2">{item.excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-[#00aa6c] font-medium">
                    Read more
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Holiday Destinations Carousel */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Top destinations for your next holiday</h2>
              <p className="text-sm text-gray-500 mb-6">Here's where your fellow travellers are headed</p>
              <div className="hidden md:block">
                <Button className="bg-[#34e0a1] hover:bg-[#2bc889] text-black px-6 py-2 rounded-full font-medium">
                  Explore destinations
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1770&auto=format&fit=crop"
                  alt="World destinations"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="block md:hidden mt-6">
                <Button className="w-full bg-[#34e0a1] hover:bg-[#2bc889] text-black px-6 py-2 rounded-full font-medium">
                  Explore destinations
                </Button>
              </div>
            </div>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {[
                { name: "Bangkok", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1974&auto=format&fit=crop" },
                { name: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1742&auto=format&fit=crop" },
                { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop" },
                { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1988&auto=format&fit=crop" },
                { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1740&auto=format&fit=crop" },
                { name: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1965&auto=format&fit=crop" }
              ].map((destination, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden group cursor-pointer">
                      <img 
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                        <h3 className="text-white text-xl font-bold">{destination.name}</h3>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-[#004f32] text-white py-16">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get the Tripadvisor App</h2>
          <p className="mb-8 max-w-lg mx-auto">The Tripadvisor app makes it easy to find the lowest hotel prices, best restaurants, and fun things to do, wherever you go.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-white text-[#004f32] hover:bg-white hover:text-[#004f32]">
              App Store
            </Button>
            <Button variant="outline" className="border-white text-[#004f32] hover:bg-white hover:text-[#004f32]">
              Google Play
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">About Tripadvisor</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Resources and Policies</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Write a Review</a></li>
                <li><a href="#" className="hover:text-white">Add a Place</a></li>
                <li><a href="#" className="hover:text-white">Join</a></li>
                <li><a href="#" className="hover:text-white">Travelers' Choice</a></li>
                <li><a href="#" className="hover:text-white">GreenLeaders</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Do Business With Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Owners</a></li>
                <li><a href="#" className="hover:text-white">Business Advantage</a></li>
                <li><a href="#" className="hover:text-white">Sponsored Placements</a></li>
                <li><a href="#" className="hover:text-white">Advertise with Us</a></li>
                <li><a href="#" className="hover:text-white">Access our Content API</a></li>
                <li><a href="#" className="hover:text-white">Become an Affiliate</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Download Our App</h3>
              <p className="mb-4">Get the full experience and never miss out</p>
              <div className="flex flex-col gap-4">
                <a href="#" className="hover:text-white bg-black px-4 py-2 rounded inline-flex items-center">
                  <span>App Store</span>
                </a>
                <a href="#" className="hover:text-white bg-black px-4 py-2 rounded inline-flex items-center">
                  <span>Google Play</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-sm text-center">
            <div className="flex justify-center gap-8 mb-4">
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Pinterest</a>
            </div>
            <p>© {new Date().getFullYear()} Tripadvisor LLC All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Content Policy</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
              <a href="#" className="hover:text-white">Cookie Settings</a>
              <a href="#" className="hover:text-white">Site Map</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
