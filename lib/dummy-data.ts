export type Product = {
  id: string;
  name: string;
  imageUrl: string;
  imageHint: string;
  status: 'Compliant' | 'Non-compliant' | 'Warning';
  category?: string; // Added for similar products functionality
  productUrl?: string; // Added for similar products redirect functionality
};

export type ScanReport = {
  id: string;
  companyName: string;
  companyUrl: string;
  companyLogoUrl: string;
  companyLogoHint: string;
  productsScannedCount: number;
  nonCompliantProductsCount: number;
  date: string;
  scanData: string;
  products: Product[];
};

export const dummyScans: ScanReport[] = [
  {
    id: 'scan-001',
    companyName: 'Blinkit',
    companyUrl: 'blinkit.com',
    companyLogoUrl: 'https://yt3.googleusercontent.com/oe7za_pjcm3tYZKtTAs6aWuZCOzB6aHWnZOGYwrYjuZe72SMkVs3qoCElDQl-ob8CaKNimXI=s900-c-k-c0x00ffffff-no-rj',
    companyLogoHint: 'Blinkit quick commerce logo',
    productsScannedCount: 850,
    nonCompliantProductsCount: 23,
    date: '2024-07-29T10:30:00Z',
    scanData: `Scan of blinkit.com completed. Found 850 products. 
    - 827 products have proper MRP, manufacturing date, and expiry details.
    - 15 grocery items missing manufacturing dates.
    - 8 products have unclear MRP information.
    - All fresh products have proper declarations.`,
    products: [
      { 
        id: 'p-001', 
        name: 'Amul Taaza Milk 500ml', 
        imageUrl: 'https://picsum.photos/seed/201/100/100', 
        imageHint: 'milk packet', 
        status: 'Compliant',
        category: 'Dairy',
        productUrl: 'https://blinkit.com/products/amul-taaza-milk-500ml'
      },
      { 
        id: 'p-002', 
        name: 'Britannia Bread', 
        imageUrl: 'https://picsum.photos/seed/202/100/100', 
        imageHint: 'bread packet', 
        status: 'Compliant',
        category: 'Bakery',
        productUrl: 'https://blinkit.com/products/britannia-bread'
      },
      { 
        id: 'p-003', 
        name: 'Local Biscuits Pack', 
        imageUrl: 'https://picsum.photos/seed/203/100/100', 
        imageHint: 'biscuit packet', 
        status: 'Non-compliant',
        category: 'Snacks',
        productUrl: 'https://blinkit.com/products/local-biscuits-pack'
      },
      { 
        id: 'p-004', 
        name: 'Fresh Vegetables Pack', 
        imageUrl: 'https://picsum.photos/seed/204/100/100', 
        imageHint: 'vegetables', 
        status: 'Warning',
        category: 'Vegetables',
        productUrl: 'https://blinkit.com/products/fresh-vegetables-pack'
      },
      { 
        id: 'p-005', 
        name: 'Soft Drink 1L', 
        imageUrl: 'https://picsum.photos/seed/205/100/100', 
        imageHint: 'soft drink bottle', 
        status: 'Compliant',
        category: 'Beverages',
        productUrl: 'https://blinkit.com/products/soft-drink-1l'
      },
    ],
  },
  {
    id: 'scan-002',
    companyName: 'Blinkit Previous',
    companyUrl: 'blinkit.com',
    companyLogoUrl: 'https://yt3.googleusercontent.com/oe7za_pjcm3tYZKtTAs6aWuZCOzB6aHWnZOGYwrYjuZe72SMkVs3qoCElDQl-ob8CaKNimXI=s900-c-k-c0x00ffffff-no-rj',
    companyLogoHint: 'Blinkit quick commerce logo',
    productsScannedCount: 920,
    nonCompliantProductsCount: 18,
    date: '2024-07-28T14:45:00Z',
    scanData: `Scan of zepto.com completed. Found 920 products.
    - 902 products are fully compliant with FSSAI regulations.
    - 12 products missing expiry dates.
    - 6 imported snacks missing importer details.
    - All pricing information is accurate.`,
    products: [
      { 
        id: 'p-006', 
        name: 'Lays Chips', 
        imageUrl: 'https://picsum.photos/seed/206/100/100', 
        imageHint: 'chips packet', 
        status: 'Compliant',
        category: 'Snacks',
        productUrl: 'https://zepto.com/products/lays-chips'
      },
      { 
        id: 'p-007', 
        name: 'Dairy Milk Chocolate', 
        imageUrl: 'https://picsum.photos/seed/207/100/100', 
        imageHint: 'chocolate bar', 
        status: 'Non-compliant',
        category: 'Confectionery',
        productUrl: 'https://zepto.com/products/dairy-milk-chocolate'
      },
      { 
        id: 'p-008', 
        name: 'Basmati Rice 1kg', 
        imageUrl: 'https://picsum.photos/seed/208/100/100', 
        imageHint: 'rice packet', 
        status: 'Compliant',
        category: 'Grains',
        productUrl: 'https://zepto.com/products/basmati-rice-1kg'
      },
      { 
        id: 'p-025', 
        name: 'Cadbury Chocolate', 
        imageUrl: 'https://picsum.photos/seed/225/100/100', 
        imageHint: 'chocolate bar', 
        status: 'Compliant',
        category: 'Confectionery',
        productUrl: 'https://zepto.com/products/cadbury-chocolate'
      },
      { 
        id: 'p-026', 
        name: 'Premium Basmati Rice', 
        imageUrl: 'https://picsum.photos/seed/226/100/100', 
        imageHint: 'rice packet', 
        status: 'Compliant',
        category: 'Grains',
        productUrl: 'https://zepto.com/products/premium-basmati-rice'
      },
    ],
  },
];