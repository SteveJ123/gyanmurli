import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface LanguageMurliItem {
  id: string;
  nativeLabel: string;
  englishLabel: string;
  code: string;
  floralIconUrl: string;
  route: string;
}

interface PlaylistCardItem {
  id: string;
  language: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  audioUrl: string;
}

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  
  readonly crimsonAccent = '#c8102e';

  readonly introHeading = 'Paramdham • Point of Light';
  readonly introDescription =
    'Supreme Father Shiva has descended on earth to establish righteousness through knowledge and purity.';

  readonly dualFeatureCards = [
    {
      title: 'Supreme Soul — Point of Light',
      caption: 'Spiritual meditation & inner awakening',
      imageUrl: '/images/paramatma-light.jpg',
      alt: 'Radiant golden-red spiritual light representing Supreme Soul',
    },
    {
      title: 'Practical Spiritual Life',
      caption: 'Peace, clarity, and elevated living',
      imageUrl: '/images/practical-life.jpg',
      alt: 'Meditation and spiritual serenity scene',
    },
  ];

  readonly languageGrid: LanguageMurliItem[] = [
    {
      id: 'te',
      nativeLabel: 'తెలుగు',
      englishLabel: 'Telugu',
      code: 'te',
      floralIconUrl: '/images/PicsArt_telugu.jpg',
      route: 'lang/telugu',
    },
    {
      id: 'hi',
      nativeLabel: 'हिंदी',
      englishLabel: 'Hindi',
      code: 'hi',
      floralIconUrl: '/images/picsart_hindi.jpg',
      route: 'lang/hindi',
    },
    {
      id: 'en',
      nativeLabel: 'English',
      englishLabel: 'English',
      code: 'en',
      floralIconUrl: '/images/picsart_english.jpg',
      route: 'lang/english',
    },
    // {
    //   id: 'kn',
    //   nativeLabel: 'ಕನ್ನಡ',
    //   englishLabel: 'Kannada',
    //   code: 'kn',
    //   floralIconUrl: 'assets/images/floral-badge.png',
    //   route: '/murli/kannada',
    // },
    // {
    //   id: 'ta',
    //   nativeLabel: 'தமிழ்',
    //   englishLabel: 'Tamil',
    //   code: 'ta',
    //   floralIconUrl: 'assets/images/floral-badge.png',
    //   route: '/murli/tamil',
    // },
    // {
    //   id: 'gu',
    //   nativeLabel: 'ગુજરાતી',
    //   englishLabel: 'Gujarati',
    //   code: 'gu',
    //   floralIconUrl: 'assets/images/floral-badge.png',
    //   route: '/murli/gujarati',
    // },
  ];

  readonly specialTopics: string[] = [
    'Amritvela & Rajyoga Meditation',
    'Soul Consciousness in Daily Action',
    'Karma Philosophy & Purity',
    'Peace of Mind & Emotional Balance',
    'Applying Spiritual Laws in Family Life',
  ];

  readonly blessingCard = {
    imageUrl: '/images/special-topics.jpg',
    alt: 'Blessing card illustration',
    // quote: 'May you constantly be cheerful!',
    // subtext: 'Stay steady in remembrance and spread peace around you.',
  };

  readonly playlists: PlaylistCardItem[] = [
    {
      id: 'telugu-playlist',
      language: 'Telugu',
      title: 'Telugu Playlist',
      subtitle: 'Daily Murli & commentary audio',
      imageUrl: '/images/playlist-telugu.jpg',
      audioUrl: 'assets/audio/telugu-sample.mp3',
    },
    {
      id: 'hindi-playlist',
      language: 'Hindi',
      title: 'Hindi Playlist',
      subtitle: 'Daily Murli & commentary audio',
      imageUrl: '/images/playlist-hindi.jpg',
      audioUrl: 'assets/audio/hindi-sample.mp3',
    },
    {
      id: 'english-playlist',
      language: 'English',
      title: 'English Playlist',
      subtitle: 'Daily Murli & commentary audio',
      imageUrl: '/images/playlist-english.jpg',
      audioUrl: 'assets/audio/english-sample.mp3',
    },
  ];

  readonly activePlaylistId = signal<string | null>(null);

  togglePlaylist(id: string): void {
    this.activePlaylistId.set(this.activePlaylistId() === id ? null : id);
  }
}
