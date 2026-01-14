import GlobeCanvas from "./GlobeCanvas";
import sampleArcs from "@/data/sample-arcs";

export default function GlobeBackground() {
    const globeConfig = {
        globeColor: "#062056",
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        atmosphereColor: "#ffffff",
        atmosphereAltitude: 0.1,
        showAtmosphere: true,
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 2000,
        arcLength: 0.9,
    };

    return (
        <div className="absolute inset-0 z-0">
            <GlobeCanvas data={sampleArcs} config={globeConfig} />
            <div className="absolute inset-0 bg-black/85" />
        </div>
    );
}
