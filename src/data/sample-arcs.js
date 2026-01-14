const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

const sampleArcs = [
    {
        order: 1,
        startLat: 28.6139,   // Delhi
        startLng: 77.209,
        endLat: 51.5072,    // London
        endLng: -0.1276,
        arcAlt: 0.3,
        color: colors[0],
    },
    {
        order: 2,
        startLat: 28.6139,  // Delhi
        startLng: 77.209,
        endLat: 40.7128,   // New York
        endLng: -74.006,
        arcAlt: 0.4,
        color: colors[1],
    },
    {
        order: 3,
        startLat: 28.6139,  // Delhi
        startLng: 77.209,
        endLat: 35.6762,   // Tokyo
        endLng: 139.6503,
        arcAlt: 0.5,
        color: colors[2],
    },
    {
        order: 4,
        startLat: 19.076,   // Mumbai
        startLng: 72.8777,
        endLat: 3.139,     // Malaysia
        endLng: 101.6869,
        arcAlt: 0.35,
        color: colors[0],
    },
    {
        order: 5,
        startLat: 19.076,   // Mumbai
        startLng: 72.8777,
        endLat: 1.3521,    // Singapore
        endLng: 103.8198,
        arcAlt: 0.25,
        color: colors[1],
    },
];

export default sampleArcs;
