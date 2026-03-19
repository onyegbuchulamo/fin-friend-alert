export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-card-foreground mb-2">🌊 EcoFish Sentinel</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              AI-powered aquaculture risk monitoring and early warning system. Protecting fish farms
              through real-time environmental intelligence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">Technology Stack</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• IoT Sensor Integration (pH, Turbidity, Temp)</li>
              <li>• Machine Learning Risk Classification</li>
              <li>• Real-time SMS Alert System</li>
              <li>• GIS-based Risk Zone Mapping</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">UN SDG Alignment</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>🎯 SDG 2 — Zero Hunger</li>
              <li>🎯 SDG 14 — Life Below Water</li>
              <li>🎯 SDG 13 — Climate Action</li>
              <li>🎯 SDG 9 — Industry & Innovation</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoFish Sentinel — Built for Sustainable Aquaculture
        </div>
      </div>
    </footer>
  );
}
