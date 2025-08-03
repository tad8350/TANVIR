"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardFooter() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Priducts</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Aneity and aplofork</li>
                <li>Lits efecti angure camager</li>
                <li>Leern ting out eckles</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Flands</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Fullct</li>
                <li>Fnands</li>
                <li>Plaips</li>
                <li>Lige</li>
                <li>Dulips</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Neperit</li>
                <li>Frgihals</li>
                <li>Clitus</li>
                <li>Feglip</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Lagus</li>
                <li>Frout</li>
                <li>Pmteji</li>
                <li>Coomd</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h4 className="font-semibold mb-2">AFER YOUR SERUS</h4>
                <p className="text-sm text-gray-300 mb-2">
                  Praseran bise: Ade fakate en a elie Shicis cheltunitatlox hamn.
                </p>
                <p className="text-sm text-gray-300">720 200 migiirjanin denies</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Frord mone"
                  className="bg-white text-gray-800 rounded-none w-48"
                />
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <span>Tandes's lightutas REA-400 Na8</span>
              <span className="my-2 md:my-0">Refention.com</span>
              <div className="flex space-x-4">
                <span>Stire</span>
                <span>Sar</span>
                <span>GL</span>
                <span>S1041/20</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 