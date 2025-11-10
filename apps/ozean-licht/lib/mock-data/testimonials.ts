export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating: number;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria K.',
    role: 'LCQ® Absolventin',
    content: 'Die Ozean Licht Akademie hat mein Leben verändert. Die Kurse sind tiefgründig und transformativ. Lia\'s Lehrmethode ist einzigartig und berührend.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Stefan M.',
    role: 'Meditation Teilnehmer',
    content: 'Ich habe durch die Meditationskurse endlich inneren Frieden gefunden. Die Techniken sind leicht verständlich und sofort anwendbar.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Julia R.',
    role: 'Chakra Heilung Absolventin',
    content: 'Die Chakra Heilung hat mir geholfen, alte Blockaden zu lösen. Ich fühle mich ausgeglichener und energiegeladener als je zuvor.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Thomas W.',
    role: 'LCQ® Master',
    content: 'Das Master Programm hat mich nicht nur persönlich transformiert, sondern mir auch ermöglicht, andere auf ihrer Reise zu begleiten. Unbezahlbar!',
    rating: 5,
  },
  {
    id: '5',
    name: 'Sandra B.',
    role: 'Kristallheilung Teilnehmerin',
    content: 'Die Kristallheilung Masterclass hat mir die Augen geöffnet für die magische Welt der Heilsteine. Jeden Tag nutze ich das Gelernte.',
    rating: 5,
  },
  {
    id: '6',
    name: 'Michael L.',
    role: 'Astralreisen Student',
    content: 'Ich hatte schon immer Interesse an Astralreisen, aber erst durch diesen Kurs habe ich gelernt, es sicher und bewusst zu praktizieren.',
    rating: 5,
  },
  {
    id: '7',
    name: 'Anna S.',
    role: 'Breathwork Praktizierende',
    content: 'Breathwork Mastery hat mir gezeigt, wie kraftvoll der Atem sein kann. Diese Techniken haben mein Leben auf allen Ebenen bereichert.',
    rating: 5,
  },
  {
    id: '8',
    name: 'David H.',
    role: 'Quantum Healing Absolvent',
    content: 'Der Quantum Healing Kurs ist absolut revolutionär. Die Verbindung von Spiritualität und Quantenphysik ist faszinierend und wirkungsvoll.',
    rating: 5,
  },
  {
    id: '9',
    name: 'Lisa P.',
    role: 'Göttliches Weibliches Teilnehmerin',
    content: 'Dieser Kurs hat mir geholfen, mich mit meiner weiblichen Kraft zu verbinden. Ich fühle mich endlich ganz und authentisch.',
    rating: 5,
  },
  {
    id: '10',
    name: 'Markus F.',
    role: 'Manifestation Student',
    content: 'Manifestation Mastery hat mir die Werkzeuge gegeben, meine Träume zu verwirklichen. Die Ergebnisse sind beeindruckend und messbar.',
    rating: 5,
  },
];
