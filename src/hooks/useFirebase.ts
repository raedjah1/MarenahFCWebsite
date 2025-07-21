// React hooks for Firebase services
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  teamService,
  matchesService,
  storeService,
  type TeamMember,
  type TeamMemberInput,
  type TeamMemberQueryOptions,
  type Match,
  type MatchInput,
  type MatchQueryOptions,
  type Product,
  type ProductInput,
  type ProductQueryOptions,
  type ShoppingCart,
  type ProductSize,
  type TeamMemberRole,
  type ProductCategory,
} from "../firebase";

// ============================================================================
// COMMON HOOK TYPES
// ============================================================================

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

interface UseMutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// ============================================================================
// TEAM MEMBERS HOOKS
// ============================================================================

/**
 * Hook to fetch team members with optional filtering
 */
export const useTeamMembers = (options: TeamMemberQueryOptions = {}) => {
  const [state, setState] = useState<UseAsyncListState<TeamMember>>({
    data: [],
    loading: true,
    error: null,
    hasMore: false,
    total: 0,
  });

  // Stabilize the options object to prevent infinite re-renders
  const stableOptions = useMemo(
    () => options,
    [
      options.limit,
      options.offset,
      options.orderBy,
      options.orderDirection,
      options.role,
      options.isActive,
      options.searchTerm,
    ],
  );

  const fetchTeamMembers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await teamService.getTeamMembers(stableOptions);

      if (result.success && result.data) {
        setState({
          data: result.data.data,
          loading: false,
          error: null,
          hasMore: result.data.hasMore,
          total: result.data.total || 0,
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to fetch team members",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    }
  }, [stableOptions]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return {
    ...state,
    refetch: fetchTeamMembers,
  };
};

/**
 * Hook to fetch team members by role
 */
export const useTeamMembersByRole = (role: TeamMemberRole) => {
  return useTeamMembers({ role, isActive: true });
};

/**
 * Hook to fetch a single team member
 */
export const useTeamMember = (id: string | null) => {
  const [state, setState] = useState<UseAsyncState<TeamMember>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchTeamMember = useCallback(async () => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await teamService.getTeamMemberById(id);

      if (result.success && result.data) {
        setState({
          data: result.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "Team member not found",
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchTeamMember();
  }, [fetchTeamMember]);

  return {
    ...state,
    refetch: fetchTeamMember,
  };
};

/**
 * Hook for team member mutations
 */
export const useTeamMemberMutations = () => {
  const create = {
    mutate: async (input: TeamMemberInput, photoFile?: File) => {
      return await teamService.createTeamMember(input, photoFile);
    },
  };

  const update = {
    mutate: async (id: string, input: Partial<TeamMemberInput>, photoFile?: File) => {
      return await teamService.updateTeamMember(id, input, photoFile);
    },
  };

  const updateOrder = {
    mutate: async (updates: { id: string; displayOrder: number }[]) => {
      return await teamService.updateTeamMembersOrder(updates);
    },
  };

  const remove = {
    mutate: async (id: string) => {
      return await teamService.deleteTeamMember(id);
    },
  };

  return {
    create,
    update,
    updateOrder,
    remove,
  };
};

// ============================================================================
// MATCHES HOOKS
// ============================================================================

/**
 * Hook to fetch matches with optional filtering
 */
export const useMatches = (options: MatchQueryOptions = {}) => {
  const [state, setState] = useState<UseAsyncListState<Match>>({
    data: [],
    loading: true,
    error: null,
    hasMore: false,
    total: 0,
  });

  // Stabilize the options object to prevent infinite re-renders
  const stableOptions = useMemo(
    () => options,
    [
      options.limit,
      options.offset,
      options.orderBy,
      options.orderDirection,
      options.status,
      options.matchType,
      options.isHome,
      options.dateRange?.start?.getTime(),
      options.dateRange?.end?.getTime(),
      options.opponent,
      options.competition,
    ],
  );

  const fetchMatches = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await matchesService.getMatches(stableOptions);

      if (result.success && result.data) {
        setState({
          data: result.data.data,
          loading: false,
          error: null,
          hasMore: result.data.hasMore,
          total: result.data.total || 0,
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to fetch matches",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    }
  }, [stableOptions]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    ...state,
    refetch: fetchMatches,
  };
};

/**
 * Hook to fetch upcoming matches
 */
export const useUpcomingMatches = (limit = 5) => {
  const [state, setState] = useState<UseAsyncListState<Match>>({
    data: [],
    loading: true,
    error: null,
    hasMore: false,
    total: 0,
  });

  const fetchUpcomingMatches = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await matchesService.getUpcomingMatches({ limit });

      if (result.success && result.data) {
        setState({
          data: result.data.data,
          loading: false,
          error: null,
          hasMore: result.data.hasMore,
          total: result.data.total || 0,
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to fetch upcoming matches",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    }
  }, [limit]);

  useEffect(() => {
    fetchUpcomingMatches();
  }, [fetchUpcomingMatches]);

  return {
    ...state,
    refetch: fetchUpcomingMatches,
  };
};

/**
 * Hook to fetch next match
 */
export const useNextMatch = () => {
  const [state, setState] = useState<UseAsyncState<Match>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchNextMatch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await matchesService.getNextMatch();

      if (result.success && result.data) {
        setState({
          data: result.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "No upcoming matches found",
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }, []);

  useEffect(() => {
    fetchNextMatch();
  }, [fetchNextMatch]);

  return {
    ...state,
    refetch: fetchNextMatch,
  };
};

/**
 * Hook for match CRUD operations
 */
export const useMatchMutations = () => {
  const [createState, setCreateState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const [updateState, setUpdateState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const [deleteState, setDeleteState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createMatch = useCallback(async (input: MatchInput, logoFile?: File) => {
    setCreateState({ loading: true, error: null, success: false });

    try {
      const result = await matchesService.createMatch(input, logoFile);

      if (result.success) {
        setCreateState({ loading: false, error: null, success: true });
        return result.data;
      } else {
        setCreateState({
          loading: false,
          error: result.error || "Failed to create match",
          success: false,
        });
        return null;
      }
    } catch (error) {
      setCreateState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        success: false,
      });
      return null;
    }
  }, []);

  const updateMatch = useCallback(
    async (id: string, input: Partial<MatchInput>, logoFile?: File) => {
      setUpdateState({ loading: true, error: null, success: false });

      try {
        const result = await matchesService.updateMatch(id, input, logoFile);

        if (result.success) {
          setUpdateState({ loading: false, error: null, success: true });
          return result.data;
        } else {
          setUpdateState({
            loading: false,
            error: result.error || "Failed to update match",
            success: false,
          });
          return null;
        }
      } catch (error) {
        setUpdateState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          success: false,
        });
        return null;
      }
    },
    [],
  );

  const deleteMatch = useCallback(async (id: string) => {
    setDeleteState({ loading: true, error: null, success: false });

    try {
      const result = await matchesService.deleteMatch(id);

      if (result.success) {
        setDeleteState({ loading: false, error: null, success: true });
        return true;
      } else {
        setDeleteState({
          loading: false,
          error: result.error || "Failed to delete match",
          success: false,
        });
        return false;
      }
    } catch (error) {
      setDeleteState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        success: false,
      });
      return false;
    }
  }, []);

  return {
    create: {
      ...createState,
      mutate: createMatch,
    },
    update: {
      ...updateState,
      mutate: updateMatch,
    },
    delete: {
      ...deleteState,
      mutate: deleteMatch,
    },
  };
};

// ============================================================================
// PRODUCTS/STORE HOOKS
// ============================================================================

/**
 * Hook to fetch products with optional filtering
 */
export const useProducts = (options: ProductQueryOptions = {}) => {
  const [state, setState] = useState<UseAsyncListState<Product>>({
    data: [],
    loading: true,
    error: null,
    hasMore: false,
    total: 0,
  });

  // Stabilize the options object to prevent infinite re-renders
  const stableOptions = useMemo(
    () => options,
    [
      options.limit,
      options.offset,
      options.orderBy,
      options.orderDirection,
      options.category,
      options.isActive,
      options.isFeatured,
      options.searchTerm,
      options.priceRange,
      options.inStock,
    ],
  );

  const fetchProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await storeService.getProducts(stableOptions);

      if (result.success && result.data) {
        setState({
          data: result.data.data,
          loading: false,
          error: null,
          hasMore: result.data.hasMore,
          total: result.data.total || 0,
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to fetch products",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }));
    }
  }, [stableOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    refetch: fetchProducts,
  };
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category: ProductCategory) => {
  return useProducts({ category, isActive: true });
};

/**
 * Hook to fetch featured products
 */
export const useFeaturedProducts = () => {
  return useProducts({ isFeatured: true, isActive: true });
};

/**
 * Hook to fetch a single product
 */
export const useProduct = (id: string | null) => {
  const [state, setState] = useState<UseAsyncState<Product>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await storeService.getProductById(id);

      if (result.success && result.data) {
        setState({
          data: result.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "Product not found",
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    ...state,
    refetch: fetchProduct,
  };
};

/**
 * Hook for product CRUD operations
 */
export const useProductMutations = () => {
  const [createState, setCreateState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const [updateState, setUpdateState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const [deleteState, setDeleteState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createProduct = useCallback(async (input: ProductInput, imageFiles?: File[]) => {
    setCreateState({ loading: true, error: null, success: false });

    try {
      const result = await storeService.createProduct(input, imageFiles);

      if (result.success) {
        setCreateState({ loading: false, error: null, success: true });
        return result.data;
      } else {
        setCreateState({
          loading: false,
          error: result.error || "Failed to create product",
          success: false,
        });
        return null;
      }
    } catch (error) {
      setCreateState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        success: false,
      });
      return null;
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, input: Partial<ProductInput>, imageFiles?: File[]) => {
      setUpdateState({ loading: true, error: null, success: false });

      try {
        const result = await storeService.updateProduct(id, input, imageFiles);

        if (result.success) {
          setUpdateState({ loading: false, error: null, success: true });
          return result.data;
        } else {
          setUpdateState({
            loading: false,
            error: result.error || "Failed to update product",
            success: false,
          });
          return null;
        }
      } catch (error) {
        setUpdateState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          success: false,
        });
        return null;
      }
    },
    [],
  );

  const deleteProduct = useCallback(async (id: string) => {
    setDeleteState({ loading: true, error: null, success: false });

    try {
      const result = await storeService.deleteProduct(id);

      if (result.success) {
        setDeleteState({ loading: false, error: null, success: true });
        return true;
      } else {
        setDeleteState({
          loading: false,
          error: result.error || "Failed to delete product",
          success: false,
        });
        return false;
      }
    } catch (error) {
      setDeleteState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        success: false,
      });
      return false;
    }
  }, []);

  return {
    create: {
      ...createState,
      mutate: createProduct,
    },
    update: {
      ...updateState,
      mutate: updateProduct,
    },
    delete: {
      ...deleteState,
      mutate: deleteProduct,
    },
  };
};

/**
 * Hook for shopping cart management
 */
export const useCart = (userId?: string) => {
  const [state, setState] = useState<UseAsyncState<ShoppingCart>>({
    data: null,
    loading: true,
    error: null,
  });

  const [mutationState, setMutationState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const fetchCart = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await storeService.getCart(userId);

      if (result.success && result.data) {
        setState({
          data: result.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "Failed to get cart",
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }, [userId]);

  const addToCart = useCallback(
    async (
      productId: string,
      size: ProductSize,
      quantity: number,
      color?: string,
    ) => {
      if (!state.data) return false;

      setMutationState({ loading: true, error: null, success: false });

      try {
        const result = await storeService.addToCart(
          state.data.id,
          productId,
          size,
          quantity,
          color,
        );

        if (result.success && result.data) {
          setState((prev) => ({ ...prev, data: result.data || null }));
          setMutationState({ loading: false, error: null, success: true });
          return true;
        } else {
          setMutationState({
            loading: false,
            error: result.error || "Failed to add to cart",
            success: false,
          });
          return false;
        }
      } catch (error) {
        setMutationState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          success: false,
        });
        return false;
      }
    },
    [state.data],
  );

  const removeFromCart = useCallback(
    async (productId: string, size: ProductSize, color?: string) => {
      if (!state.data) return false;

      setMutationState({ loading: true, error: null, success: false });

      try {
        const result = await storeService.removeFromCart(
          state.data.id,
          productId,
          size,
          color,
        );

        if (result.success && result.data) {
          setState((prev) => ({ ...prev, data: result.data || null }));
          setMutationState({ loading: false, error: null, success: true });
          return true;
        } else {
          setMutationState({
            loading: false,
            error: result.error || "Failed to remove from cart",
            success: false,
          });
          return false;
        }
      } catch (error) {
        setMutationState({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          success: false,
        });
        return false;
      }
    },
    [state.data],
  );

  const clearCart = useCallback(async () => {
    if (!state.data) return false;

    setMutationState({ loading: true, error: null, success: false });

    try {
      const result = await storeService.clearCart(state.data.id);

      if (result.success && result.data) {
        setState((prev) => ({ ...prev, data: result.data || null }));
        setMutationState({ loading: false, error: null, success: true });
        return true;
      } else {
        setMutationState({
          loading: false,
          error: result.error || "Failed to clear cart",
          success: false,
        });
        return false;
      }
    } catch (error) {
      setMutationState({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        success: false,
      });
      return false;
    }
  }, [state.data]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Memoize cart totals
  const cartTotals = useMemo(() => {
    if (!state.data) {
      return {
        itemCount: 0,
        totalAmount: 0,
        currency: "USD",
      };
    }

    return {
      itemCount: state.data.items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalAmount: state.data.totalAmount,
      currency: state.data.currency,
    };
  }, [state.data]);

  return {
    ...state,
    ...cartTotals,
    mutation: mutationState,
    addToCart,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
  };
};

// ============================================================================
// REAL-TIME HOOKS
// ============================================================================

/**
 * Hook for real-time team members updates
 */
export const useRealtimeTeamMembers = (
  options: TeamMemberQueryOptions = {},
) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Stabilize the options object to prevent infinite re-renders
  const stableOptions = useMemo(
    () => options,
    [
      options.limit,
      options.offset,
      options.orderBy,
      options.orderDirection,
      options.role,
      options.isActive,
      options.searchTerm,
    ],
  );

  useEffect(() => {
    setLoading(true);

    const unsubscribe = teamService.subscribeToTeamMembers((members) => {
      setTeamMembers(members);
      setLoading(false);
    }, stableOptions);

    return unsubscribe;
  }, [stableOptions]);

  return {
    data: teamMembers,
    loading,
  };
};

/**
 * Hook for real-time matches updates
 */
export const useRealtimeMatches = (options: MatchQueryOptions = {}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Stabilize the options object to prevent infinite re-renders
  const stableOptions = useMemo(
    () => options,
    [
      options.limit,
      options.offset,
      options.orderBy,
      options.orderDirection,
      options.status,
      options.matchType,
      options.isHome,
      options.dateRange?.start?.getTime(),
      options.dateRange?.end?.getTime(),
      options.opponent,
      options.competition,
    ],
  );

  useEffect(() => {
    setLoading(true);

    const unsubscribe = matchesService.subscribeToMatches((matchList) => {
      setMatches(matchList);
      setLoading(false);
    }, stableOptions);

    return unsubscribe;
  }, [stableOptions]);

  return {
    data: matches,
    loading,
  };
};

/**
 * Hook for real-time upcoming matches
 */
export const useRealtimeUpcomingMatches = () => {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = matchesService.subscribeToUpcomingMatches((matches) => {
      setUpcomingMatches(matches);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    data: upcomingMatches,
    loading,
  };
};
