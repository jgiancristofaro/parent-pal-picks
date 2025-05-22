
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

const categories = [
  {
    id: "diapers",
    name: "Diapers",
    image: "https://images.unsplash.com/photo-1545012558-6e30e3e89949?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "bottles",
    name: "Bottles",
    image: "https://images.unsplash.com/photo-1615487483438-2b8484e7a0a7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "clothing",
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "monitors",
    name: "Baby Monitors",
    image: "https://images.unsplash.com/photo-1595586964577-71da3757f6eb?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "strollers",
    name: "Strollers",
    image: "https://images.unsplash.com/photo-1602972576840-41a701c76504?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "carseats",
    name: "Car Seats",
    image: "https://images.unsplash.com/photo-1591342073971-18a7976e4dc1?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Essentials = () => {
  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Newborn Essentials" showBack={true} />
      
      <div className="p-4">
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            className="pl-10 py-6 bg-white rounded-lg border-gray-200" 
            placeholder="Search"
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 mb-6 no-scrollbar">
          <Button variant="outline" className="flex-shrink-0 mr-2 bg-white border-gray-200">
            Recommended by People I Follow
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
          
          <Button variant="outline" className="flex-shrink-0 bg-white border-gray-200">
            Diapers
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <ProductCard
              key={category.id}
              id={category.id}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Essentials;
