import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Farm {
  name: string;
  location: string;
  phone: string;
}

interface FarmRegistrationProps {
  farm: Farm;
  onChange: (farm: Farm) => void;
}

export function FarmRegistration({ farm, onChange }: FarmRegistrationProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-card space-y-4">
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
        📍 Register Farm
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="farm-name">Farm Name</Label>
          <Input
            id="farm-name"
            placeholder="e.g. Sunrise Fishery"
            value={farm.name}
            onChange={(e) => onChange({ ...farm, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="farm-location">Location</Label>
          <Input
            id="farm-location"
            placeholder="e.g. Laguna Province"
            value={farm.location}
            onChange={(e) => onChange({ ...farm, location: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="farm-phone">Phone Number</Label>
          <Input
            id="farm-phone"
            placeholder="+63 XXX XXX XXXX"
            value={farm.phone}
            onChange={(e) => onChange({ ...farm, phone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
