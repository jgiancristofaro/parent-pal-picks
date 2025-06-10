
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useUserLocations } from "@/hooks/useUserLocations";
import { useManageLocations } from "@/hooks/useManageLocations";
import { LocationCard } from "@/components/settings/LocationCard";
import { EmptyLocationsState } from "@/components/settings/EmptyLocationsState";
import { LocationsListHeader } from "@/components/settings/LocationsListHeader";

const ManageLocations = () => {
  const { data: locations = [], isLoading, error } = useUserLocations();
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingLocation,
    setEditingLocation,
    handleLocationSaved,
    handleDeleteLocation,
  } = useManageLocations();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="My Homes" showBack={true} showSettings={false} />
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your home locations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('ManageLocations: Rendering error state:', error);
    
    // Check if this is an authentication error
    const isAuthError = error.message?.includes('user') || error.message?.includes('auth') || error.message?.includes('uuid');
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="My Homes" showBack={true} showSettings={false} />
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                {isAuthError ? "Authentication Required" : "Error Loading Locations"}
              </h3>
              <p className="text-red-500 mb-4">
                {isAuthError 
                  ? "You need to be logged in to view your home locations. Please log in and try again."
                  : `Unable to load your home locations: ${error.message}`
                }
              </p>
              {isAuthError && (
                <Button onClick={() => window.location.href = '/login'}>
                  Go to Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Homes" showBack={true} showSettings={false} />
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Locations</h1>
          <p className="text-gray-600">
            Add your home locations to get hyper-local sitter recommendations from neighbors in your building.
          </p>
        </div>

        {locations.length === 0 ? (
          <EmptyLocationsState
            isAddDialogOpen={isAddDialogOpen}
            onAddDialogChange={setIsAddDialogOpen}
            onLocationSaved={handleLocationSaved}
          />
        ) : (
          <>
            <LocationsListHeader
              locationCount={locations.length}
              isAddDialogOpen={isAddDialogOpen}
              onAddDialogChange={setIsAddDialogOpen}
              onLocationSaved={handleLocationSaved}
            />

            <div className="space-y-4">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  editingLocation={editingLocation}
                  onEdit={setEditingLocation}
                  onDelete={handleDeleteLocation}
                  onLocationSaved={handleLocationSaved}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageLocations;
