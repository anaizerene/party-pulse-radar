import AddVenueForm from "@/components/AddVenueForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AddVenue = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background/90 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Add Venue</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/")}>← Back</Button>
            {user && (
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            )}
          </div>
        </header>
        <AddVenueForm />
      </div>
    </div>
  );
};

export default AddVenue;
