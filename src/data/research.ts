// Research activity that produced no paper, so it never appeared in the
// archived site's Publications list. Transcribed from Carson.CV.tex in
// github.com/tatecarson/CV — that file is the source of truth; this is a copy
// kept in sync by hand.
//
// Publications themselves are NOT here: they come from the migrated
// src/content/pages/publications.md, which the archive already had.

export interface Appearance {
  year: number;
  /** Talk/workshop title, without surrounding quotes. */
  title: string;
  /** Conference or event. */
  venue: string;
  location: string;
  note?: string;
}

export const talks: Appearance[] = [
  {
    year: 2026,
    title: 'DRIFT',
    venue: 'Dakota State University Research Week',
    location: 'Madison, South Dakota',
    note: 'Work-in-progress Faculty Research Initiative presentation',
  },
  {
    year: 2025,
    title:
      "Water's Sonic Signatures: Computational Sound Studies and Ecological Awareness in Tarkovsky's Films",
    venue: 'Sound Studies and Experimental Practices Conference: Actions of Water Awareness',
    location: 'Stony Brook, New York',
  },
  {
    year: 2023,
    title: 'Teaching Video Game Sound: Balancing Technical Know-How with Sonic Creativity',
    venue: 'ATMI/CMS National Conference',
    location: 'Miami, Florida',
  },
];

export const workshops: Appearance[] = [
  {
    year: 2018,
    title: 'Utilizing NexusHUB and Docker for Distributed Performance',
    venue: 'Web Audio Conference, Technical University of Berlin',
    location: 'Berlin, Germany',
  },
  {
    year: 2018,
    title: 'NexusHUB Distributed Performance Workshop',
    venue: 'International Conference on New Interfaces for Musical Expression, Virginia Tech',
    location: 'Blacksburg, Virginia',
    note: 'Co-presenter',
  },
];

// NOTE: the CV files this demo under a 2019 heading, but the entry itself gives
// September 21, 2018 — the same date as the Berlin workshop above. Dated 2018
// here on the strength of the explicit date. Worth correcting in the CV either
// way, since the two disagree.
export const demos: Appearance[] = [
  {
    year: 2018,
    title:
      'A more perfect union: Composition with audience-controlled smartphone speaker array and evolutionary computer music',
    venue: 'Web Audio Conference, Technical University of Berlin',
    location: 'Berlin, Germany',
  },
];

export interface Mentoring {
  years: string;
  detail: string;
}

export const mentoring: Mentoring[] = [
  {
    years: '2025–26',
    detail:
      'Faculty mentor for three successful Student Mentored Research Initiative applications spanning game audio, film sound, and experimental spatial audio; all three received funding.',
  },
  {
    years: '2026',
    detail:
      'Faculty supervisor for seven undergraduate research projects, run as a weekly cohort with rotating progress presentations and peer critique, presented publicly through Research Week.',
  },
  {
    years: '2026',
    detail:
      'Faculty project director for two Digital Sound Design research internships — MatchLab and Beam Choreography — involving four students.',
  },
];
