import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Reorder } from "framer-motion";
import "./AdminDashboard.css";
import logoImage from "../assets/images/Logo.png";
import { useFirebaseAuth } from "../contexts/FirebaseAuthContext";
import {
  useTeamMembers,
  useMatches,
  useProducts,
  useTeamMemberMutations,
  useMatchMutations,
  useProductMutations,
} from "../hooks/useFirebase";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type {
  TeamMember,
  TeamMemberInput,
  Match,
  MatchInput,
  Product,
  ProductInput,
  ProductCategory,
  ProductSize,
} from "../firebase/types";

type Section = "overview" | "team" | "matches" | "store";
type TeamSection = "players" | "coaches" | "management";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading: authLoading } = useFirebaseAuth();

  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [activeTeamSection, setActiveTeamSection] = useState<TeamSection>("players");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | Match | Product | null>(null);

  // Form state with proper initialization
  const [teamFormData, setTeamFormData] = useState<Partial<TeamMemberInput>>({
    name: '',
    role: 'player', // This will be updated dynamically
    position: '',
    isActive: true,
  });

  const [matchFormData, setMatchFormData] = useState<{
    opponent: string;
    location: string;
    competition: string;
    date: string;
    isHome: boolean;
    matchType: string;
    status: string;
    result?: {
      homeScore: number;
      awayScore: number;
      extraTime?: boolean;
      penaltyShootout?: {
        homeScore: number;
        awayScore: number;
      };
    };
  }>({
    opponent: '',
    location: '',
    competition: '',
    date: '',
    isHome: true,
    matchType: 'league',
    status: 'scheduled',
  });

  const [teamMemberPhoto, setTeamMemberPhoto] = useState<File | null>(null);
  const [teamMemberPhotoPreview, setTeamMemberPhotoPreview] = useState<string | null>(null);
  const [opponentLogo, setOpponentLogo] = useState<File | null>(null);
  const [opponentLogoPreview, setOpponentLogoPreview] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productSizes, setProductSizes] = useState<Record<string, number>>({});

  const [productFormData, setProductFormData] = useState<{
    name: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    imageURLs: string[];
    sizes: Record<string, number>;
    isActive: boolean;
  }>({
    name: '',
    description: '',
    price: 0,
    category: 'jerseys',
    sku: '',
    imageURLs: [],
    sizes: {},
    isActive: true,
  });

  // Data hooks with proper error handling
  const {
    data: teamMembers = [],
    loading: teamLoading,
    error: teamError,
    refetch: refetchTeam,
  } = useTeamMembers();

  const {
    data: matches = [],
    loading: matchesLoading,
    error: matchesError,
    refetch: refetchMatches,
  } = useMatches();

  const {
    data: products = [],
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  // Mutations
  const teamMutations = useTeamMemberMutations();
  const matchMutations = useMatchMutations();
  const productMutations = useProductMutations();

  const [isReordering, setIsReordering] = useState(false);
  const [reorderingMembers, setReorderingMembers] = useState<TeamMember[]>([]);

  // Redirect if not admin - fixed dependency array
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/signin");
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Initialize form data when editing item changes
  useEffect(() => {
    if (editingItem) {
      if (activeSection === 'team') {
        const teamMember = editingItem as TeamMember;
        setTeamFormData({
          name: teamMember.name || '',
          role: teamMember.role,
          position: teamMember.position || '',
          jerseyNumber: teamMember.jerseyNumber || undefined,
          isActive: teamMember.isActive ?? true,
          photoURL: teamMember.photoURL,
        });

        // Set photo preview if available
        if (teamMember.photoURL) {
          setTeamMemberPhotoPreview(teamMember.photoURL);
        } else {
          setTeamMemberPhotoPreview(null);
        }
        setTeamMemberPhoto(null); // Reset file input
      } else if (activeSection === 'matches') {
        const match = editingItem as Match;
        setMatchFormData({
          opponent: match.opponent || '',
          location: match.location || '',
          competition: match.competition || '',
          date: match.date ? new Date(match.date.seconds * 1000).toISOString().slice(0, 16) : '',
          isHome: match.isHome ?? true,
          matchType: match.matchType || 'league',
          status: match.status || 'scheduled',
          result: match.result ? {
            homeScore: match.result.homeScore,
            awayScore: match.result.awayScore,
            extraTime: match.result.extraTime,
            penaltyShootout: match.result.penaltyShootout
          } : undefined
        });

        // Set opponent logo preview if available
        if (match.opponentLogo) {
          setOpponentLogoPreview(match.opponentLogo);
        } else {
          setOpponentLogoPreview(null);
        }
        setOpponentLogo(null); // Reset file input
      } else if (activeSection === 'store') {
        const product = editingItem as Product;
        setProductFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          category: product.category || 'jerseys',
          sku: product.sku || '',
          imageURLs: product.imageURLs || [],
          sizes: product.sizes || {},
          isActive: product.isActive ?? true,
        });
        setProductSizes(product.sizes || {});
        setProductImages([]); // Reset images for editing
      }
    }
  }, [editingItem, activeSection, activeTeamSection]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-overlay"></div>
        <div className="loading-container">
          <LoadingSpinner size="large" text="Loading admin dashboard..." />
        </div>
      </div>
    );
  }

  const getTeamMembersByRole = (role: string) => {
    return teamMembers.filter(
      (member) => member.role === role && member.isActive,
    );
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{getTeamMembersByRole("player").length}</h3>
          <p>Active Players</p>
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-card">
          <h3>{getTeamMembersByRole("coach").length}</h3>
          <p>Coaching Staff</p>
          <i className="fas fa-clipboard"></i>
        </div>
        <div className="stat-card">
          <h3>{matches.filter((m) => m.status === "scheduled").length}</h3>
          <p>Upcoming Matches</p>
          <i className="fas fa-calendar"></i>
        </div>
        <div className="stat-card">
          <h3>{products.filter((p) => p.isActive).length}</h3>
          <p>Store Products</p>
          <i className="fas fa-shopping-bag"></i>
        </div>
      </div>
    </div>
  );

  const handleReorderStart = (members: TeamMember[]) => {
    setIsReordering(true);
    setReorderingMembers([...members]);
  };

  const handleReorderEnd = async () => {
    if (!isReordering) return;
    
    try {
      // Create updates with new display orders
      const updates = reorderingMembers.map((member, index) => ({
        id: member.id,
        displayOrder: index + 1,
      }));

      const result = await teamMutations.updateOrder.mutate(updates);
      if (result.success) {
        refetchTeam();
      } else {
        alert('Failed to save new order. Please try again.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    } finally {
      setIsReordering(false);
      setReorderingMembers([]);
    }
  };

  const handleReorderCancel = () => {
    setIsReordering(false);
    setReorderingMembers([]);
  };

  const renderTeamManagement = () => {
    const roleMap = {
      players: "player",
      coaches: "coach",
      management: "management",
    };

    const currentRole = roleMap[activeTeamSection];
    const members = getTeamMembersByRole(currentRole);
    const displayMembers = isReordering ? reorderingMembers : members;

    return (
      <div className="team-management">
        <div className="team-tabs">
          <button
            className={`team-tab ${activeTeamSection === "players" ? "active" : ""}`}
            onClick={() => setActiveTeamSection("players")}
            disabled={isReordering}
          >
            Players ({getTeamMembersByRole("player").length})
          </button>
          <button
            className={`team-tab ${activeTeamSection === "coaches" ? "active" : ""}`}
            onClick={() => setActiveTeamSection("coaches")}
            disabled={isReordering}
          >
            Coaches ({getTeamMembersByRole("coach").length})
          </button>
          <button
            className={`team-tab ${activeTeamSection === "management" ? "active" : ""}`}
            onClick={() => setActiveTeamSection("management")}
            disabled={isReordering}
          >
            Management ({getTeamMembersByRole("management").length})
          </button>
        </div>

        <div className="section-header">
          <h3>
            {activeTeamSection.charAt(0).toUpperCase() +
              activeTeamSection.slice(1)}
          </h3>
          <div className="section-actions">
            {!isReordering ? (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleReorderStart(members)}
                  disabled={members.length < 2}
                  title="Reorder team members"
                >
                  <i className="fas fa-sort"></i>
                  Reorder
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddNew}
                >
                  <i className="fas fa-plus"></i>
                  Add {activeTeamSection.slice(0, -1)}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-success"
                  onClick={handleReorderEnd}
                >
                  <i className="fas fa-check"></i>
                  Save Order
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleReorderCancel}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {teamLoading ? (
          <LoadingSpinner text="Loading team members..." />
        ) : teamError ? (
          <div className="error-message">Error: {teamError}</div>
        ) : isReordering ? (
          <div className="reorder-container">
            <div className="reorder-instructions">
              <p><i className="fas fa-info-circle"></i> Drag and drop to reorder team members</p>
            </div>
            <Reorder.Group 
              axis="y" 
              values={reorderingMembers} 
              onReorder={setReorderingMembers}
              className="reorder-list"
            >
              {reorderingMembers.map((member) => (
                <Reorder.Item 
                  key={member.id} 
                  value={member}
                  className="reorder-item"
                  whileDrag={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    zIndex: 1000
                  }}
                >
                  <div className="reorder-member">
                    <div className="reorder-drag-handle">
                      <i className="fas fa-grip-vertical"></i>
                    </div>
                    <div className="reorder-member-info">
                      {member.photoURL ? (
                        <img
                          src={member.photoURL}
                          alt={member.name}
                          className="member-photo"
                        />
                      ) : (
                        <div className="member-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                      <div className="member-details">
                        <h4>{member.name}</h4>
                        <p>{member.position || member.title || "-"}</p>
                        {activeTeamSection === "players" && member.jerseyNumber && (
                          <span className="jersey-number">#{member.jerseyNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Position/Title</th>
                  {activeTeamSection === "players" && <th>Jersey #</th>}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      {member.photoURL ? (
                        <img
                          src={member.photoURL}
                          alt={member.name}
                          className="member-photo"
                        />
                      ) : (
                        <div className="member-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </td>
                    <td>{member.name}</td>
                    <td>{member.position || member.title || "-"}</td>
                    {activeTeamSection === "players" && (
                      <td>{member.jerseyNumber || "-"}</td>
                    )}
                    <td>
                      <span
                        className={`status ${member.isActive ? "active" : "inactive"}`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingItem(member)}
                        title="Edit member"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(member.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      let success = false;
      if (activeSection === 'team') {
        const result = await teamMutations.remove.mutate(id);
        success = result.success;
      } else if (activeSection === 'matches') {
        success = await matchMutations.delete.mutate(id);
      } else if (activeSection === 'store') {
        success = await productMutations.delete.mutate(id);
      }

      if (success) {
        // Refresh the appropriate data
        if (activeSection === 'team') {
          refetchTeam();
        } else if (activeSection === 'matches') {
          refetchMatches();
        } else if (activeSection === 'store') {
          refetchProducts();
        }
      } else {
        alert('Failed to delete item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const renderMatchesManagement = () => (
    <div className="matches-management">
      <div className="section-header">
        <h3>Matches</h3>
        <button
          className="btn btn-primary"
          onClick={handleAddNew}
        >
          <i className="fas fa-plus"></i>
          Add Match
        </button>
      </div>

      {matchesLoading ? (
        <LoadingSpinner text="Loading matches..." />
      ) : matchesError ? (
        <div className="error-message">Error: {matchesError}</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Logo</th>
                <th>Opponent</th>
                <th>Location</th>
                <th>Competition</th>
                <th>Status</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id}>
                  <td>
                    {new Date(match.date.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td>
                    {match.opponentLogo ? (
                      <img
                        src={match.opponentLogo}
                        alt={match.opponent}
                        className="opponent-logo"
                      />
                    ) : (
                      <div className="opponent-logo-placeholder">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                    )}
                  </td>
                  <td>{match.opponent}</td>
                  <td>{match.location}</td>
                  <td>{match.competition || "-"}</td>
                  <td>
                    <span className={`status ${match.status}`}>
                      {match.status}
                    </span>
                  </td>
                  <td>
                    {match.result
                      ? `${match.result.homeScore}-${match.result.awayScore}`
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingItem(match)}
                      title="Edit match details"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {match.status === 'scheduled' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setEditingItem(match);
                          // Pre-set the status to finished to show result fields
                          setMatchFormData(prev => ({
                            ...prev,
                            status: 'finished',
                            result: { homeScore: 0, awayScore: 0 }
                          }));
                        }}
                        title="Set match result"
                      >
                        <i className="fas fa-futbol"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(match.id)}
                      title="Delete match"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderStoreManagement = () => (
    <div className="store-management">
      <div className="section-header">
        <h3>Store Products</h3>
        <button
          className="btn btn-primary"
          onClick={handleAddNew}
        >
          <i className="fas fa-plus"></i>
          Add Product
        </button>
      </div>

      {productsLoading ? (
        <LoadingSpinner text="Loading products..." />
      ) : productsError ? (
        <div className="error-message">Error: {productsError}</div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imageURLs?.[0] ? (
                      <img
                        src={product.imageURLs[0]}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-placeholder">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    {Object.values(product.sizes || {}).reduce((a, b) => a + b, 0)}
                  </td>
                  <td>
                    <span
                      className={`status ${product.isActive ? "active" : "inactive"}`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingItem(product)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const handleAddNew = () => {
    setEditingItem(null);
    // Reset form data immediately when opening add form
    if (activeSection === 'team') {
      const roleMap = {
        players: "player",
        coaches: "coach",
        management: "management",
      };
      setTeamFormData({
        name: '',
        role: roleMap[activeTeamSection] as any,
        position: '',
        jerseyNumber: undefined,
        isActive: true,
      });
    } else if (activeSection === 'matches') {
      setMatchFormData({
        opponent: '',
        location: '',
        competition: '',
        date: '',
        isHome: true,
        matchType: 'league',
        status: 'scheduled',
        result: undefined
      });
    } else if (activeSection === 'store') {
      setProductFormData({
        name: '',
        description: '',
        price: 0,
        category: 'jerseys',
        sku: '',
        imageURLs: [],
        sizes: {},
        isActive: true,
      });
      // Initialize with common sizes with default stock
      setProductSizes({
        'S': 10,
        'M': 10,
        'L': 10,
        'XL': 10,
      });
    }
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    // Reset all form data when closing
    const roleMap = {
      players: "player",
      coaches: "coach",
      management: "management",
    };
    setTeamFormData({
      name: '',
      role: roleMap[activeTeamSection] as any,
      position: '',
      isActive: true,
    });
    setMatchFormData({
      opponent: '',
      location: '',
      competition: '',
      date: '',
      isHome: true,
      matchType: 'league',
      status: 'scheduled',
      result: undefined
    });
    setProductFormData({
      name: '',
      description: '',
      price: 0,
      category: 'jerseys',
      sku: '',
      imageURLs: [],
      sizes: {},
      isActive: true,
    });
    setProductSizes({});
    setProductImages([]);

    // Reset team member photo state
    setTeamMemberPhoto(null);
    setTeamMemberPhotoPreview(null);

    // Reset opponent logo state
    setOpponentLogo(null);
    setOpponentLogoPreview(null);

    // Clean up any object URLs to prevent memory leaks
    if (teamMemberPhotoPreview && !teamMemberPhotoPreview.startsWith('http')) {
      URL.revokeObjectURL(teamMemberPhotoPreview);
    }

    if (opponentLogoPreview && !opponentLogoPreview.startsWith('http')) {
      URL.revokeObjectURL(opponentLogoPreview);
    }
  };

  const renderAddEditForm = () => {
    if (!showAddForm && !editingItem) return null;

    return (
      <div className="modal-overlay" onClick={handleCloseForm}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 'auto' }}>
          <div className="modal-header">
            <h3>
              {editingItem ? 'Edit' : 'Add'} {
                activeSection === 'team' ? activeTeamSection.slice(0, -1) :
                  activeSection === 'matches' ? 'Match' :
                    activeSection === 'store' ? 'Product' : 'Item'
              }
            </h3>
            <button className="close-btn" onClick={handleCloseForm}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {activeSection === 'team' && renderTeamForm()}
            {activeSection === 'matches' && renderMatchForm()}
            {activeSection === 'store' && renderProductForm()}
          </div>
        </div>
      </div>
    );
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await teamMutations.update.mutate(editingItem.id, teamFormData, teamMemberPhoto || undefined);
      } else {
        await teamMutations.create.mutate(teamFormData as TeamMemberInput, teamMemberPhoto || undefined);
      }
      handleCloseForm();
      refetchTeam();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matchData: MatchInput = {
        opponent: matchFormData.opponent || '',
        location: matchFormData.location || '',
        competition: matchFormData.competition || '',
        date: new Date(matchFormData.date || ''),
        isHome: matchFormData.isHome,
        matchType: matchFormData.matchType as any,

      };

      // Add result data if status is finished or live
      if (matchFormData.status === 'finished' || matchFormData.status === 'live') {
        if (matchFormData.result) {
          matchData.result = {
            homeScore: matchFormData.result.homeScore || 0,
            awayScore: matchFormData.result.awayScore || 0,
            extraTime: matchFormData.result.extraTime || false,
          };

          // Add penalty shootout data if extra time is enabled
          if (matchFormData.result.extraTime && matchFormData.result.penaltyShootout) {
            matchData.result.penaltyShootout = {
              homeScore: matchFormData.result.penaltyShootout.homeScore || 0,
              awayScore: matchFormData.result.penaltyShootout.awayScore || 0
            };
          }
        } else {
          // Initialize with default values if no result data exists
          matchData.result = {
            homeScore: 0,
            awayScore: 0,
            extraTime: false
          };
        }
      }

      if (editingItem) {
        await matchMutations.update.mutate(editingItem.id, matchData, opponentLogo || undefined);
      } else {
        await matchMutations.create.mutate(matchData, opponentLogo || undefined);
      }
      handleCloseForm();
      refetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!productFormData.name?.trim()) {
      alert('Product name is required.');
      return;
    }

    if (!productFormData.description?.trim()) {
      alert('Product description is required.');
      return;
    }

    if (!productFormData.price || productFormData.price <= 0) {
      alert('Product price must be greater than 0.');
      return;
    }

    try {
      // Generate SKU if not provided
      const sku = productFormData.sku || `${productFormData.category?.toUpperCase()}-${Date.now()}`;

      // Convert productSizes to proper ProductSize keys
      const validSizes: Record<ProductSize, number> = {
        XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0
      };
      const validProductSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

      Object.entries(productSizes).forEach(([size, quantity]) => {
        if (validProductSizes.includes(size as ProductSize) && quantity > 0) {
          validSizes[size as ProductSize] = quantity;
        }
      });

      // Ensure at least one size is provided with stock
      if (Object.values(validSizes).every(qty => qty === 0)) {
        alert('Please add at least one size with stock quantity greater than 0.');
        return;
      }

      const productData: ProductInput = {
        name: productFormData.name.trim(),
        description: productFormData.description.trim(),
        price: productFormData.price,
        category: productFormData.category as ProductCategory || 'jerseys',
        sku: sku,
        imageURLs: [], // Will be populated by the service with uploaded images
        sizes: validSizes,
        isActive: productFormData.isActive ?? true,
        isFeatured: false,
        currency: 'USD',
      };

      console.log('Submitting product data:', productData);
      console.log('Product images:', productImages);

      let result;
      if (editingItem) {
        result = await productMutations.update.mutate(editingItem.id, productData, productImages);
      } else {
        result = await productMutations.create.mutate(productData, productImages);
      }

      if (result) {
        console.log('Product saved successfully:', result);
        handleCloseForm();
        refetchProducts();
      } else {
        console.error('Product save returned null/undefined');
        alert('Failed to save product. Please try again.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderTeamForm = () => {
    return (
      <form onSubmit={handleTeamSubmit} className="admin-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={teamFormData.name || ''}
            onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Position/Title</label>
          <input
            type="text"
            value={teamFormData.position || ''}
            onChange={(e) => setTeamFormData({ ...teamFormData, position: e.target.value })}
          />
        </div>

        {activeTeamSection === 'players' && (
          <div className="form-group">
            <label>Jersey Number</label>
            <input
              type="number"
              value={teamFormData.jerseyNumber || ''}
              onChange={(e) => setTeamFormData({ ...teamFormData, jerseyNumber: parseInt(e.target.value) || undefined })}
            />
          </div>
        )}

        <div className="form-group">
          <label>Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleTeamMemberPhotoUpload}
            className="file-input"
          />
          {teamMemberPhotoPreview && (
            <div className="photo-preview">
              <img
                src={teamMemberPhotoPreview}
                alt="Preview"
                className="member-photo-preview"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={teamFormData.isActive ?? true}
              onChange={(e) => setTeamFormData({ ...teamFormData, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  const renderMatchForm = () => {
    return (
      <form onSubmit={handleMatchSubmit} className="admin-form">
        <div className="form-group">
          <label>Opponent *</label>
          <input
            type="text"
            value={matchFormData.opponent || ''}
            onChange={(e) => setMatchFormData({ ...matchFormData, opponent: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            value={matchFormData.location || ''}
            onChange={(e) => setMatchFormData({ ...matchFormData, location: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Competition</label>
          <input
            type="text"
            value={matchFormData.competition || ''}
            onChange={(e) => setMatchFormData({ ...matchFormData, competition: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Date & Time *</label>
          <input
            type="datetime-local"
            value={matchFormData.date || ''}
            onChange={(e) => setMatchFormData({ ...matchFormData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Match Type</label>
          <select
            value={matchFormData.matchType || 'league'}
            onChange={(e) => setMatchFormData({ ...matchFormData, matchType: e.target.value })}
          >
            <option value="league">League</option>
            <option value="cup">Cup</option>
            <option value="friendly">Friendly</option>
            <option value="playoff">Playoff</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={matchFormData.isHome}
              onChange={(e) => setMatchFormData({ ...matchFormData, isHome: e.target.checked })}
            />
            Home Game
          </label>
        </div>

        <div className="form-group">
          <label>Opponent Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleOpponentLogoUpload}
            className="file-input"
          />
          {opponentLogoPreview && (
            <div className="photo-preview">
              <img
                src={opponentLogoPreview}
                alt="Opponent Logo Preview"
                className="opponent-logo-preview"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Match Status</label>
          <select
            value={matchFormData.status || 'scheduled'}
            onChange={(e) => setMatchFormData({ ...matchFormData, status: e.target.value })}
          >
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="finished">Finished</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Show result fields if status is finished */}
        {(matchFormData.status === 'finished' || matchFormData.status === 'live') && (
          <div className="match-result-section">
            <h4>Match Result</h4>
            <div className="result-inputs">
              <div className="form-group">
                <label>{matchFormData.isHome ? 'Home' : 'Away'} Score (Our Team)</label>
                <input
                  type="number"
                  min="0"
                  value={matchFormData.result?.homeScore || 0}
                  onChange={(e) => setMatchFormData({
                    ...matchFormData,
                    result: {
                      ...matchFormData.result || { homeScore: 0, awayScore: 0 },
                      homeScore: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>{matchFormData.isHome ? 'Away' : 'Home'} Score (Opponent)</label>
                <input
                  type="number"
                  min="0"
                  value={matchFormData.result?.awayScore || 0}
                  onChange={(e) => setMatchFormData({
                    ...matchFormData,
                    result: {
                      ...matchFormData.result || { homeScore: 0, awayScore: 0 },
                      awayScore: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={matchFormData.result?.extraTime || false}
                  onChange={(e) => setMatchFormData({
                    ...matchFormData,
                    result: {
                      ...matchFormData.result || { homeScore: 0, awayScore: 0 },
                      extraTime: e.target.checked
                    }
                  })}
                />
                Extra Time
              </label>
            </div>

            {/* Penalty shootout section */}
            {matchFormData.result?.extraTime && (
              <div className="penalty-shootout">
                <h5>Penalty Shootout</h5>
                <div className="result-inputs">
                  <div className="form-group">
                    <label>{matchFormData.isHome ? 'Home' : 'Away'} Penalties (Our Team)</label>
                    <input
                      type="number"
                      min="0"
                      value={matchFormData.result?.penaltyShootout?.homeScore || 0}
                      onChange={(e) => setMatchFormData({
                        ...matchFormData,
                        result: {
                          ...matchFormData.result || { homeScore: 0, awayScore: 0 },
                          penaltyShootout: {
                            ...matchFormData.result?.penaltyShootout || { homeScore: 0, awayScore: 0 },
                            homeScore: parseInt(e.target.value) || 0
                          }
                        }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>{matchFormData.isHome ? 'Away' : 'Home'} Penalties (Opponent)</label>
                    <input
                      type="number"
                      min="0"
                      value={matchFormData.result?.penaltyShootout?.awayScore || 0}
                      onChange={(e) => setMatchFormData({
                        ...matchFormData,
                        result: {
                          ...matchFormData.result || { homeScore: 0, awayScore: 0 },
                          penaltyShootout: {
                            ...matchFormData.result?.penaltyShootout || { homeScore: 0, awayScore: 0 },
                            awayScore: parseInt(e.target.value) || 0
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImages(Array.from(e.target.files));
    }
  };

  const handleTeamMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTeamMemberPhoto(file);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setTeamMemberPhotoPreview(previewURL);
    }
  };

  const handleOpponentLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOpponentLogo(file);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setOpponentLogoPreview(previewURL);
    }
  };

  const handleSizeChange = (size: string, quantity: string) => {
    const qty = parseInt(quantity) || 0;
    if (qty === 0) {
      const newSizes = { ...productSizes };
      delete newSizes[size];
      setProductSizes(newSizes);
    } else {
      setProductSizes({ ...productSizes, [size]: qty });
    }
  };

  const addNewSize = () => {
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const availableSizes = validSizes.filter(size => !productSizes[size]);

    if (availableSizes.length === 0) {
      alert('All sizes have been added');
      return;
    }

    const size = prompt(`Enter size (${availableSizes.join(', ')}):`);
    if (size && validSizes.includes(size) && !productSizes[size]) {
      setProductSizes({ ...productSizes, [size]: 0 });
    } else if (size && !validSizes.includes(size)) {
      alert(`Invalid size. Please use one of: ${validSizes.join(', ')}`);
    }
  };

  const renderProductForm = () => {
    return (
      <form onSubmit={handleProductSubmit} className="admin-form">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={productFormData.name || ''}
            onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={productFormData.category || 'jerseys'}
            onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
            required
          >
            <option value="jerseys">Jerseys</option>
            <option value="training">Training Gear</option>
            <option value="accessories">Accessories</option>
            <option value="merchandise">Merchandise</option>
          </select>
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            type="text"
            value={productFormData.sku || ''}
            onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
            placeholder="Product SKU/Code"
          />
        </div>

        <div className="form-group">
          <label>Price *</label>
          <input
            type="number"
            step="0.01"
            value={productFormData.price || 0}
            onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={productFormData.description || ''}
            onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
            rows={3}
            placeholder="Product description..."
          />
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          {productImages.length > 0 && (
            <div className="image-preview">
              <p>{productImages.length} image(s) selected</p>
              <div className="image-list">
                {productImages.map((file, index) => (
                  <div key={index} className="image-item">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setProductImages(productImages.filter((_, i) => i !== index))}
                      className="remove-image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Sizes & Stock</label>
          <div className="sizes-container">
            {Object.entries(productSizes).map(([size, quantity]) => (
              <div key={size} className="size-input">
                <label>{size}</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => handleSizeChange(size, e.target.value)}
                  placeholder="Qty"
                />
                <button
                  type="button"
                  onClick={() => handleSizeChange(size, '0')}
                  className="remove-size"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNewSize}
              className="btn btn-sm btn-secondary"
            >
              + Add Size
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={productFormData.isActive ?? true}
              onChange={(e) => setProductFormData({ ...productFormData, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Glassmorphism Overlay */}
      <div className="admin-overlay"></div>

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logoImage} alt="Marenah FC" />
          <h2>ADMIN PANEL</h2>
          <p>Welcome, {user?.displayName || user?.email}</p>
          
          {/* Navigation buttons moved below user email */}
          <div className="admin-main-nav">
            <button
              className={`main-nav-btn ${activeSection === "team" ? "active" : ""}`}
              onClick={() => setActiveSection("team")}
            >
              <i className="fas fa-users"></i>
              <span>Team</span>
            </button>
            <button
              className={`main-nav-btn ${activeSection === "matches" ? "active" : ""}`}
              onClick={() => setActiveSection("matches")}
            >
              <i className="fas fa-futbol"></i>
              <span>Matches</span>
            </button>
            <button
              className={`main-nav-btn ${activeSection === "store" ? "active" : ""}`}
              onClick={() => setActiveSection("store")}
            >
              <i className="fas fa-shopping-bag"></i>
              <span>Store</span>
            </button>
          </div>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => setActiveSection("overview")}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Overview</span>
          </button>
        </nav>

        <div className="admin-footer">
          <button className="btn btn-outline" onClick={handleSignOut}>
            <i className="fas fa-sign-out-alt"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>
              {activeSection === "overview" && "Dashboard Overview"}
              {activeSection === "team" && "Team Management"}
              {activeSection === "matches" && "Matches Management"}
              {activeSection === "store" && "Store Management"}
            </h1>
            <p className="header-subtitle">
              Manage your team's {activeSection}
            </p>
          </div>
          {activeSection !== "overview" && (
            <button className="add-new-btn" onClick={handleAddNew}>
              <i className="fas fa-plus"></i>
              Add New {
                activeSection === 'team' ? activeTeamSection.slice(0, -1) :
                  activeSection === 'matches' ? 'Match' :
                    activeSection === 'store' ? 'Product' : 'Item'
              }
            </button>
          )}
        </header>

        <div className="admin-content">
          {activeSection === "overview" && renderOverview()}
          {activeSection === "team" && renderTeamManagement()}
          {activeSection === "matches" && renderMatchesManagement()}
          {activeSection === "store" && renderStoreManagement()}
        </div>
      </main>

      {/* Modal for Add/Edit Forms */}
      {renderAddEditForm()}
    </div>
  );
};

export default AdminDashboard;
