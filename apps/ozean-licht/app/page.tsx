export default function HomePage() {
  return (
    <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="font-decorative text-6xl md:text-8xl text-primary animate-glow">
            Ozean Licht
          </h1>
          <h2 className="font-decorative text-3xl md:text-4xl text-foreground">
            Akademie™
          </h2>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-montserrat-alt">
          Spirituelle Bildungsplattform für kosmisches Bewusstsein und Transformation
        </p>

        <div className="glass-card p-8 rounded-2xl max-w-md mx-auto glow">
          <p className="text-foreground/80 font-montserrat">
            🚧 In Entwicklung
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Die neue Ozean Licht Plattform wird bald verfügbar sein.
          </p>
        </div>
      </div>
    </div>
  );
}
