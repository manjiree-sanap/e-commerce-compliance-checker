'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Search, Package, Check, X, Clock, Info, Filter, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCompliance } from '@/lib/dynamodb-client';

export function ProductsList() {
  const [products, setProducts] = useState<ProductCompliance[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCompliance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'compliant' | 'non-compliant'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const baseUrl = 'https://blinkit.com/prn/amul-taaza-homogenised-toned-milk/prid/';

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.ProductID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply compliance filter
    if (complianceFilter === 'compliant') {
      filtered = filtered.filter(product => product.Flags.IsCompliant);
    } else if (complianceFilter === 'non-compliant') {
      filtered = filtered.filter(product => !product.Flags.IsCompliant);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, complianceFilter, products]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getComplianceStatus = (product: ProductCompliance) => {
    const compliantFlags = [
      product.Flags.HasConsumerCareDetails,
      product.Flags.HasManufacturerDetails,
    ].filter(Boolean).length;

    const totalFlags = 2; // Only count the important flags for compliance
    return { compliantFlags, totalFlags };
  };

  // Count products by status for the filter badges
  const compliantCount = products.filter(product => product.Flags.IsCompliant).length;
  const nonCompliantCount = products.filter(product => !product.Flags.IsCompliant).length;

  if (loading) {
    return <ProductsSkeleton />;
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <CardTitle>Product Compliance Summary</CardTitle>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} of {products.length} products
          </Badge>
        </div>
        <CardDescription>
          Complete product compliance data from the ProductComplianceSummary table
        </CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search product IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center border rounded-md p-1 bg-background">
              <Filter className="h-4 w-4 text-muted-foreground mx-2" />
              <Button
                variant={complianceFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setComplianceFilter('all')}
                className="relative"
              >
                All
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {products.length}
                </Badge>
              </Button>
              <Button
                variant={complianceFilter === 'compliant' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setComplianceFilter('compliant')}
                className="relative"
              >
                Compliant
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {compliantCount}
                </Badge>
              </Button>
              <Button
                variant={complianceFilter === 'non-compliant' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setComplianceFilter('non-compliant')}
                className="relative"
              >
                Non-Compliant
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {nonCompliantCount}
                </Badge>
              </Button>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              disabled={refreshing}
              size="icon"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Active filters indicator */}
        {(searchTerm || complianceFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSearchTerm('')}
                />
              </Badge>
            )}
            {complianceFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Status: {complianceFilter === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setComplianceFilter('all')}
                />
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchTerm('');
                setComplianceFilter('all');
              }}
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || complianceFilter !== 'all' 
              ? 'No products match your current filters' 
              : 'No products found'
            }
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto p-2">
            {filteredProducts.map((product) => {
              const status = getComplianceStatus(product);
              const productUrl = `${baseUrl}${product.ProductID}`;
              
              return (
                <div
                  key={product.ProductID}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-lg font-semibold">
                          Product ID: {product.ProductID}
                        </span>
                        <a 
                          href={productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View product on Blinkit"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <Badge 
                        variant={product.Flags.IsCompliant ? "default" : "destructive"}
                        className="flex items-center space-x-1"
                      >
                        {product.Flags.IsCompliant ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        <span>{product.Flags.IsCompliant ? 'Compliant' : 'Non-Compliant'}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last checked: {formatDate(product.LastChecked)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FlagBadge 
                      label="Consumer Care Details" 
                      value={product.Flags.HasConsumerCareDetails} 
                    />
                    <FlagBadge 
                      label="Manufacturer Details" 
                      value={product.Flags.HasManufacturerDetails} 
                    />
                    <FlagBadge 
                      label="FSSAI Info" 
                      value={product.Flags.HasFSSAI} 
                    />
                    <FlagBadge 
                      label="Nutritional Info" 
                      value={product.Flags.HasNutritionalInfo} 
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Compliance: {status.compliantFlags}/{status.totalFlags} flags met
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      FSSAI Codes: {product.Flags.FSSAICodes?.length || 0}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {filteredProducts.length > 0 && (searchTerm || complianceFilter !== 'all') && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` matching "${searchTerm}"`}
            {complianceFilter !== 'all' && ` that are ${complianceFilter}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FlagBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <Badge variant={value ? "default" : "outline"} className="ml-2">
        {value ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        {value ? 'Yes' : 'No'}
      </Badge>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-64" />
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}