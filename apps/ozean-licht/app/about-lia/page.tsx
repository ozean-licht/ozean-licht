import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-cinzel-decorative text-center mb-8 text-primary">
            Über Lia Oberhauser
          </h1>
          
          {/* Lia Image */}
          <div className="flex justify-center mb-10">
            <div className="p-2.5 bg-[#001212] border border-[#0E282E] rounded-xl">
              <img
                src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/Lia%20Lohmann%20Beach%20Image%20Pray%20Gradient.png"
                alt="Lia Lohmann am Strand"
                className="w-full max-w-[640px] h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-cinzel-decorative text-primary mb-4">
              Advanced Metaphysik, ET Botschaft, Channeling & Quanten-Transformation
            </h2>
            
            <p className="text-foreground/80 font-montserrat leading-relaxed">
              Ich bin Lia, mein Weg hier auf der Erde hat mit dem Hybridkinder Programm begonnen. Ich bin Teil dieses Programms, welches seit Jahrzehnten existiert und 2021 beendet wurde. Ich bin ein Mensch x Plejadie Hybrid und meine DNA ist anders als die eines normalen Menschen zusammengesetzt.
            </p>
            
            <p className="text-foreground/80 font-montserrat leading-relaxed">
              Ich bin mit vielen Aufgaben hierher in die physische Materie gekommen. Als galaktische Abgesandte und Botschafterin für Kosmisches Wissen, Metaphysik und verschiedene extraterrestrische Rassen, helfe zwischen dir und ihnen die Brücke zu bilden. Meine Arbeit besteht darin den Menschen in ihrem Bewusstseins-Prozess, oder auch Ascension-Prozess genannt, zu helfen und sie so auch auf den Kontakt mit Extraterrestrischen vorzubereiten.
            </p>

            <p className="text-foreground/80 font-montserrat leading-relaxed">
              Ich lebe zwei Leben, einerseits verbringe ich meine Hauptzeit hier auf der Erde, anderseits bin ich Interstellar und arbeite auf verschiedenen Schiffen, welche sich im Erdorbit befinden, sowie auf multidimensionaler Ebene.
            </p>

            <p className="text-foreground/80 font-montserrat leading-relaxed">
              Ich bin hierher gekommen um euch nun in euere Meisterschaft und Realisierung zu begleiten - Jetzt da der Weg geebnet wurde, der Pfad besteht und ich meine Meisterschaft verkörpere, werde ich euch in diesem Ziel unterstützen, auf allen Ebenen.
            </p>

            <p className="text-foreground/80 font-montserrat leading-relaxed italic text-primary text-center mt-8">
              "Danke! Denn ohne DICH wäre ich jetzt nicht das wunderbare Wesen welches ich heute bin!"
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-cinzel-decorative text-primary mb-4">
              Zu meinem Leben auf der Erde
            </h3>
            
            <p className="text-foreground/80 font-montserrat leading-relaxed mb-4">
              Als Kind war ich schon immer anders, passte nicht wirklich in die Gesellschaft. Ich konnte telekinetisch Dinge bewegen, war telepathisch, hochsensitiv und wusste, wenn Menschen krank waren oder etwas nicht stimmte.
            </p>

            <p className="text-foreground/80 font-montserrat leading-relaxed mb-4">
              Oft hatte ich das Bedürfnis nachts draußen zu sein um den Sternenhimmel zu sehen und die Sterne zu begrüßen. Schon immer hat mich der Himmel fasziniert und ich wusste, dass die Sterne mir zuhören und ich eines Tages die Antworten finden werde, nach denen ich gesucht habe.
            </p>

            <p className="text-foreground/80 font-montserrat leading-relaxed">
              Meine Reise quer durch die Spiritualität war auch eine Reise zu meiner Wahrheit. In Meditationen fand ich den notwendigen Fokus und entdeckte die Arbeit mit meinem Chakrensystem. Ich lernte die Arbeit mit den Energien als ich meinen Reiki-Meister im Alter von 18 Jahren machte.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
