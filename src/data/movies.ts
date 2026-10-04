
export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  backdrop: string;
  description: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    description: "A journey beyond the stars to discover whether humanity has a future among them.",
  },
  {
    id: 2,
    title: "Dune: Part Two",
    year: 2024,
    genre: "Sci-Fi",
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4CcUgdiGe83MeqJW1NyJVmZqRrF.jpg",
    description: "A young heir embraces his destiny on a dangerous desert planet.",
  },
  {
    id: 3,
    title: "Past Lives",
    year: 2023,
    genre: "Romance",
    rating: 7.8,
    poster: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/6oH378KUfCEitzJkm07r97L0RsZ.jpg",
    description: "Two childhood friends reunite years later and reflect on love and fate.",
  },
  {
    id: 4,
    title: "Oppenheimer",
    year: 2023,
    genre: "Drama",
    rating: 8.3,
    poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    description: "The story of the scientist whose work changed the course of history.",
  },
  {
    id: 5,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genre: "Comedy",
    rating: 8.1,
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nX5XotM9yprCKarRH4fzOq1VM1J.jpg",
    description: "An eccentric hotel concierge and his protégé get caught in a world of intrigue.",
  },
  {
    id: 6,
    title: "Whiplash",
    year: 2014,
    genre: "Drama",
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fRGxZuo7jJUWQsVg9PREb98Aclp.jpg",
    description: "An ambitious drummer pushes himself to the edge in pursuit of greatness.",
  },
  {
    id: 7,
    title: "La La Land",
    year: 2016,
    genre: "Romance",
    rating: 8.0,
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nadTlnTE6DdgmYsN4iWc2a2wiaI.jpg",
    description: "Two dreamers chase their ambitions and fall in love in Los Angeles.",
  },
  {
    id: 8,
    title: "The Batman",
    year: 2022,
    genre: "Action",
    rating: 7.8,
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    description: "A detective uncovers corruption and a dangerous mystery in Gotham City.",
  },
  {
    id: 9,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Sci-Fi",
    rating: 7.7,
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg",
    description: "An unexpected journey through parallel universes and family relationships.",
  },
];

export const galleryImages = [
  {
    image: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    alt: "Cinematic film still",
  },
  {
    image: "https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    alt: "Cinematic science fiction landscape",
  },
  {
    image: "https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
    alt: "Cinematic movie landscape",
  },
];