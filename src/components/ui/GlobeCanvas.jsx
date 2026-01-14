import { useEffect, useRef } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

extend({ ThreeGlobe });

const aspect = 1.2;
const cameraZ = 300;

function WebGLConfig() {
    const { gl, size } = useThree();
    useEffect(() => {
        gl.setPixelRatio(window.devicePixelRatio);
        gl.setSize(size.width, size.height);
        gl.setClearColor(0x000000, 0);
    }, [gl, size]);
    return null;
}

function Globe({ data, config }) {
    const globeRef = useRef();

    useEffect(() => {
        if (!globeRef.current) return;

        const material = globeRef.current.globeMaterial();
        material.color = new Color(config.globeColor);
        material.emissive = new Color(config.emissive);
        material.emissiveIntensity = config.emissiveIntensity;
        material.shininess = config.shininess;

        globeRef.current
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.7)
            .hexPolygonColor(() => config.polygonColor)
            .showAtmosphere(config.showAtmosphere)
            .atmosphereColor(config.atmosphereColor)
            .atmosphereAltitude(config.atmosphereAltitude)
            .arcsData(data)
            .arcColor(d => d.color)
            .arcAltitude(d => d.arcAlt)
            .arcDashLength(config.arcLength)
            .arcDashGap(15)
            .arcDashAnimateTime(config.arcTime);
    }, [data, config]);

    return <threeGlobe ref={globeRef} />;
}

export default function GlobeCanvas({ data, config }) {
    const scene = new Scene();
    scene.fog = new Fog(0x000000, 400, 2000);

    return (
        <Canvas
            scene={scene}
            camera={new PerspectiveCamera(50, aspect, 180, 1800)}
        >
            <WebGLConfig />
            <ambientLight color={config.ambientLight} intensity={0.6} />
            <directionalLight
                color={config.directionalLeftLight}
                position={new Vector3(-400, 100, 400)}
            />
            <directionalLight
                color={config.directionalTopLight}
                position={new Vector3(-200, 500, 200)}
            />
            <pointLight
                color={config.pointLight}
                position={new Vector3(-200, 500, 200)}
                intensity={0.8}
            />
            <Globe data={data} config={config} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minDistance={cameraZ}
                maxDistance={cameraZ}
            />
        </Canvas>
    );
}
