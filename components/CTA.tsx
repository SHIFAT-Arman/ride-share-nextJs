import Link from "next/link";
import PixelBlast from "./PixelBlast";
import SpecularButton from "./SpecularButton";

export default function CTA() {
  return (
    <section className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-2 max-w-7xl w-full mx-auto">
      <div className="flex flex-col items-center justify-center gap-6">
        <h2 className="text-7xl font-mono font-bold tracking-tight text-center mb-8">
          Access Portal
        </h2>
        <div className="flex flex-col items-center justify-center gap-6">
          <SpecularButton
            size="lg"
            radius={18}
            tint="#ffffff"
            tintOpacity={0}
            blur={0}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
          >
            <Link href="/register">Register</Link>
          </SpecularButton>
          <p className="text-sm text-muted-foreground text-center">
            By signing up, you agree to our{" "}
            <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
      <div>
        <PixelBlast
          variant="circle"
          pixelSize={4}
          color="#1E91D6"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>
    </section>
  );
}
