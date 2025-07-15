// Firestore service for products/store management
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  DocumentSnapshot,
  QuerySnapshot,
  WriteBatch,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import type {
  Product,
  ProductInput,
  ProductCategory,
  ProductSize,
  CartItem,
  ShoppingCart,
  Order,
  OrderStatus,
  QueryResult,
  PaginationParams,
  ValidationError,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const PRODUCTS_COLLECTION = 'products';
const CARTS_COLLECTION = 'carts';
const ORDERS_COLLECTION = 'orders';
const PRODUCT_IMAGES_STORAGE_PATH = 'product-images';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ProductQueryOptions extends PaginationParams {
  category?: ProductCategory;
  isActive?: boolean;
  isFeatured?: boolean;
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
}

export interface ProductResult {
  success: boolean;
  data?: Product;
  error?: string;
}

export interface ProductsResult {
  success: boolean;
  data?: QueryResult<Product>;
  error?: string;
}

export interface CartResult {
  success: boolean;
  data?: ShoppingCart;
  error?: string;
}

export interface OrderResult {
  success: boolean;
  data?: Order;
  error?: string;
}

export interface OrdersResult {
  success: boolean;
  data?: QueryResult<Order>;
  error?: string;
}

export interface InventoryUpdate {
  productId: string;
  size: ProductSize;
  quantity: number; // Positive to add, negative to subtract
}

// ============================================================================
// STORE SERVICE CLASS
// ============================================================================

class StoreService {
  private productsCollection = collection(db, PRODUCTS_COLLECTION);
  private cartsCollection = collection(db, CARTS_COLLECTION);
  private ordersCollection = collection(db, ORDERS_COLLECTION);

  // ==========================================================================
  // PRODUCT CRUD OPERATIONS
  // ==========================================================================

  /**
   * Create a new product
   */
  async createProduct(input: ProductInput, imageFiles?: File[]): Promise<ProductResult> {
    try {
      // Validate input
      const validationErrors = this.validateProductInput(input);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation errors: ${validationErrors.map(e => e.message).join(', ')}`,
        };
      }

      // Check for duplicate SKU
      const existingProduct = await this.getProductBySKU(input.sku);
      if (existingProduct) {
        return {
          success: false,
          error: `A product with SKU ${input.sku} already exists.`,
        };
      }

      let imageURLs = input.imageURLs;

      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        const uploadResults = await this.uploadProductImages(imageFiles);
        if (uploadResults.some(result => !result.success)) {
          return {
            success: false,
            error: 'Failed to upload some product images. Please try again.',
          };
        }
        imageURLs = uploadResults
          .filter(result => result.success)
          .map(result => result.url!)
          .concat(input.imageURLs);
      }

      const now = Timestamp.now();
      const productData: any = {
        name: input.name.trim(),
        description: input.description.trim(),
        price: input.price,
        currency: input.currency || 'USD',
        category: input.category,
        imageURLs,
        sizes: input.sizes,
        sku: input.sku.trim().toUpperCase(),
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
        tags: input.tags || [],
        specifications: input.specifications || {},
        createdAt: now,
        updatedAt: now,
      };

      // Only add optional fields if they have values
      if (input.colors && input.colors.length > 0) {
        productData.colors = input.colors;
      }
      
      if (input.material && input.material.trim()) {
        productData.material = input.material.trim();
      }
      
      if (input.careInstructions && input.careInstructions.trim()) {
        productData.careInstructions = input.careInstructions.trim();
      }
      
      if (input.brand && input.brand.trim()) {
        productData.brand = input.brand.trim();
      }
      
      if (input.discount) {
        productData.discount = {
          percentage: input.discount.percentage,
          validUntil: Timestamp.fromDate(input.discount.validUntil),
        };
      }

      const docRef = await addDoc(this.productsCollection, productData);
      const product: Product = {
        id: docRef.id,
        ...productData,
      };

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: 'Failed to create product. Please try again.',
      };
    }
  }

  /**
   * Get all products with optional filtering and pagination
   */
  async getProducts(options: ProductQueryOptions = {}): Promise<ProductsResult> {
    try {
      let q = query(this.productsCollection);

      // Apply filters
      if (options.category) {
        q = query(q, where('category', '==', options.category));
      }

      if (options.isActive !== undefined) {
        q = query(q, where('isActive', '==', options.isActive));
      }

      if (options.isFeatured !== undefined) {
        q = query(q, where('isFeatured', '==', options.isFeatured));
      }

      // Apply ordering
      const orderField = options.orderBy || 'createdAt';
      const orderDirection = options.orderDirection || 'desc';
      q = query(q, orderBy(orderField, orderDirection));

      // Apply pagination
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      let products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Apply client-side filters
      if (options.searchTerm) {
        const searchLower = options.searchTerm.toLowerCase();
        products = products.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (options.priceRange) {
        products = products.filter(product =>
          product.price >= options.priceRange!.min &&
          product.price <= options.priceRange!.max
        );
      }

      if (options.inStock) {
        products = products.filter(product =>
          Object.values(product.sizes).some(stock => stock > 0)
        );
      }

      return {
        success: true,
        data: {
          data: products,
          hasMore: snapshot.docs.length === (options.limit || 0),
          total: products.length,
          lastDoc: snapshot.docs[snapshot.docs.length - 1],
        },
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return {
        success: false,
        error: 'Failed to fetch products. Please try again.',
      };
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ProductResult> {
    try {
      const docRef = doc(this.productsCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const product: Product = {
          id: docSnap.id,
          ...docSnap.data(),
        } as Product;

        return {
          success: true,
          data: product,
        };
      } else {
        return {
          success: false,
          error: 'Product not found.',
        };
      }
    } catch (error) {
      console.error('Error getting product:', error);
      return {
        success: false,
        error: 'Failed to fetch product. Please try again.',
      };
    }
  }

  /**
   * Get product by SKU
   */
  async getProductBySKU(sku: string): Promise<Product | null> {
    try {
      const q = query(
        this.productsCollection,
        where('sku', '==', sku.toUpperCase()),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product by SKU:', error);
      return null;
    }
  }

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    input: Partial<ProductInput>,
    imageFiles?: File[]
  ): Promise<ProductResult> {
    try {
      const docRef = doc(this.productsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Product not found.',
        };
      }

      const currentData = docSnap.data() as Product;

      // Check for duplicate SKU if updating
      if (input.sku && input.sku !== currentData.sku) {
        const existingProduct = await this.getProductBySKU(input.sku);
        if (existingProduct && existingProduct.id !== id) {
          return {
            success: false,
            error: `A product with SKU ${input.sku} already exists.`,
          };
        }
      }

      let imageURLs = input.imageURLs || currentData.imageURLs;

      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        const uploadResults = await this.uploadProductImages(imageFiles);
        if (uploadResults.some(result => !result.success)) {
          return {
            success: false,
            error: 'Failed to upload some product images. Please try again.',
          };
        }
        const newImageURLs = uploadResults
          .filter(result => result.success)
          .map(result => result.url!);
        imageURLs = [...imageURLs, ...newImageURLs];
      }

      const updateData: Partial<Product> = {
        ...input,
        imageURLs,
        sku: input.sku?.toUpperCase(),
        discount: input.discount ? {
          percentage: input.discount.percentage,
          validUntil: Timestamp.fromDate(input.discount.validUntil),
        } : undefined,
        updatedAt: Timestamp.now(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof Product] === undefined) {
          delete updateData[key as keyof Product];
        }
      });

      await updateDoc(docRef, updateData);

      // Get updated document
      const updatedDocSnap = await getDoc(docRef);
      const updatedProduct: Product = {
        id: updatedDocSnap.id,
        ...updatedDocSnap.data(),
      } as Product;

      return {
        success: true,
        data: updatedProduct,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        error: 'Failed to update product. Please try again.',
      };
    }
  }

  /**
   * Update product inventory
   */
  async updateInventory(updates: InventoryUpdate[]): Promise<{ success: boolean; error?: string }> {
    try {
      const batch = writeBatch(db);

      for (const update of updates) {
        const docRef = doc(this.productsCollection, update.productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return {
            success: false,
            error: `Product with ID ${update.productId} not found.`,
          };
        }

        const currentData = docSnap.data() as Product;
        const currentStock = currentData.sizes[update.size] || 0;
        const newStock = Math.max(0, currentStock + update.quantity);

        batch.update(docRef, {
          [`sizes.${update.size}`]: newStock,
          updatedAt: Timestamp.now(),
        });
      }

      await batch.commit();

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error updating inventory:', error);
      return {
        success: false,
        error: 'Failed to update inventory. Please try again.',
      };
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(this.productsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Product not found.',
        };
      }

      const product = docSnap.data() as Product;

      // Delete product images
      if (product.imageURLs && product.imageURLs.length > 0) {
        await Promise.all(
          product.imageURLs.map(url => this.deleteProductImage(url))
        );
      }

      await deleteDoc(docRef);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        error: 'Failed to delete product. Please try again.',
      };
    }
  }

  // ==========================================================================
  // SHOPPING CART OPERATIONS
  // ==========================================================================

  /**
   * Get or create cart for user
   */
  async getCart(userId?: string): Promise<CartResult> {
    try {
      if (userId) {
        // Get user's cart
        const q = query(this.cartsCollection, where('userId', '==', userId), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const cartDoc = snapshot.docs[0];
          const cart: ShoppingCart = {
            id: cartDoc.id,
            ...cartDoc.data(),
          } as ShoppingCart;

          return {
            success: true,
            data: cart,
          };
        }
      }

      // Create new cart
      const now = Timestamp.now();
      const cartData: Omit<ShoppingCart, 'id'> = {
        userId,
        items: [],
        totalAmount: 0,
        currency: 'USD',
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.cartsCollection, cartData);
      const cart: ShoppingCart = {
        id: docRef.id,
        ...cartData,
      };

      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      return {
        success: false,
        error: 'Failed to get cart. Please try again.',
      };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(
    cartId: string,
    productId: string,
    size: ProductSize,
    quantity: number,
    color?: string
  ): Promise<CartResult> {
    try {
      // Get product details
      const productResult = await this.getProductById(productId);
      if (!productResult.success || !productResult.data) {
        return {
          success: false,
          error: 'Product not found.',
        };
      }

      const product = productResult.data;

      // Check stock availability
      const availableStock = product.sizes[size] || 0;
      if (availableStock < quantity) {
        return {
          success: false,
          error: `Only ${availableStock} items available in size ${size}.`,
        };
      }

      const cartRef = doc(this.cartsCollection, cartId);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        return {
          success: false,
          error: 'Cart not found.',
        };
      }

      const cart = cartSnap.data() as ShoppingCart;
      const now = Timestamp.now();

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === productId && item.size === size && item.color === color
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].addedAt = now;
      } else {
        // Add new item
        const newItem: CartItem = {
          productId,
          product,
          size,
          color,
          quantity,
          addedAt: now,
        };
        updatedItems = [...cart.items, newItem];
      }

      // Calculate total amount
      const totalAmount = this.calculateCartTotal(updatedItems);

      await updateDoc(cartRef, {
        items: updatedItems,
        totalAmount,
        updatedAt: now,
      });

      const updatedCart: ShoppingCart = {
        ...cart,
        items: updatedItems,
        totalAmount,
        updatedAt: now,
      };

      return {
        success: true,
        data: updatedCart,
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        error: 'Failed to add item to cart. Please try again.',
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(cartId: string, productId: string, size: ProductSize, color?: string): Promise<CartResult> {
    try {
      const cartRef = doc(this.cartsCollection, cartId);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        return {
          success: false,
          error: 'Cart not found.',
        };
      }

      const cart = cartSnap.data() as ShoppingCart;
      const updatedItems = cart.items.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      );

      const totalAmount = this.calculateCartTotal(updatedItems);

      await updateDoc(cartRef, {
        items: updatedItems,
        totalAmount,
        updatedAt: Timestamp.now(),
      });

      const updatedCart: ShoppingCart = {
        ...cart,
        items: updatedItems,
        totalAmount,
        updatedAt: Timestamp.now(),
      };

      return {
        success: true,
        data: updatedCart,
      };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        error: 'Failed to remove item from cart. Please try again.',
      };
    }
  }

  /**
   * Clear cart
   */
  async clearCart(cartId: string): Promise<CartResult> {
    try {
      const cartRef = doc(this.cartsCollection, cartId);
      await updateDoc(cartRef, {
        items: [],
        totalAmount: 0,
        updatedAt: Timestamp.now(),
      });

      const cartSnap = await getDoc(cartRef);
      const cart: ShoppingCart = {
        id: cartSnap.id,
        ...cartSnap.data(),
      } as ShoppingCart;

      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        error: 'Failed to clear cart. Please try again.',
      };
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Calculate cart total
   */
  private calculateCartTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      const itemPrice = item.product.discount
        ? item.product.price * (1 - item.product.discount.percentage / 100)
        : item.product.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  }

  /**
   * Validate product input
   */
  private validateProductInput(input: ProductInput): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required fields
    if (!input.name || input.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Product name is required' });
    }

    if (!input.description || input.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Product description is required' });
    }

    if (!input.sku || input.sku.trim().length === 0) {
      errors.push({ field: 'sku', message: 'SKU is required' });
    }

    if (input.price <= 0) {
      errors.push({ field: 'price', message: 'Price must be greater than 0' });
    }

    if (!input.category) {
      errors.push({ field: 'category', message: 'Category is required' });
    }

    if (!input.sizes || Object.keys(input.sizes).length === 0) {
      errors.push({ field: 'sizes', message: 'At least one size must be specified' });
    }

    // Validate sizes
    if (input.sizes) {
      Object.entries(input.sizes).forEach(([size, stock]) => {
        if (stock < 0) {
          errors.push({ field: 'sizes', message: `Stock for size ${size} cannot be negative` });
        }
      });
    }

    // Validate discount
    if (input.discount) {
      if (input.discount.percentage < 0 || input.discount.percentage > 100) {
        errors.push({ field: 'discount', message: 'Discount percentage must be between 0 and 100' });
      }
    }

    return errors;
  }

  /**
   * Upload product images
   */
  private async uploadProductImages(files: File[]): Promise<Array<{ success: boolean; url?: string; error?: string }>> {
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name}`;
          const storageRef = ref(storage, `${PRODUCT_IMAGES_STORAGE_PATH}/${fileName}`);

          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          return {
            success: true,
            url: downloadURL,
          };
        } catch (error) {
          console.error('Error uploading image:', error);
          return {
            success: false,
            error: 'Failed to upload image.',
          };
        }
      })
    );

    return results;
  }

  /**
   * Delete product image
   */
  private async deleteProductImage(imageURL: string): Promise<void> {
    try {
      const url = new URL(imageURL);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.warn('Failed to delete image:', error);
    }
  }

  /**
   * Get products collection reference
   */
  getProductsCollectionRef() {
    return this.productsCollection;
  }

  /**
   * Get carts collection reference
   */
  getCartsCollectionRef() {
    return this.cartsCollection;
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const storeService = new StoreService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Calculate discounted price
 */
export const calculateDiscountedPrice = (product: Product): number => {
  if (!product.discount) return product.price;

  const now = new Date();
  const discountValidUntil = product.discount.validUntil.toDate();

  if (now > discountValidUntil) return product.price;

  return product.price * (1 - product.discount.percentage / 100);
};

/**
 * Check if product is on sale
 */
export const isProductOnSale = (product: Product): boolean => {
  if (!product.discount) return false;

  const now = new Date();
  const discountValidUntil = product.discount.validUntil.toDate();

  return now <= discountValidUntil;
};

/**
 * Get available sizes for product
 */
export const getAvailableSizes = (product: Product): ProductSize[] => {
  return Object.entries(product.sizes)
    .filter(([_, stock]) => stock > 0)
    .map(([size, _]) => size as ProductSize);
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (product: Product, size?: ProductSize): boolean => {
  if (size) {
    return (product.sizes[size] || 0) > 0;
  }
  return Object.values(product.sizes).some(stock => stock > 0);
};

/**
 * Get product category display name
 */
export const getCategoryDisplayName = (category: ProductCategory): string => {
  const categoryNames: Record<ProductCategory, string> = {
    jerseys: 'Jerseys',
    training: 'Training Wear',
    accessories: 'Accessories',
    lifestyle: 'Lifestyle',
    equipment: 'Equipment',
  };
  return categoryNames[category];
};

/**
 * Get size display name
 */
export const getSizeDisplayName = (size: ProductSize): string => {
  return size;
};
