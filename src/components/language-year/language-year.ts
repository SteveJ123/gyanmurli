import { Component, computed, inject  } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

type SupportedLang = 'telugu' | 'hindi' | 'english';

interface LanguageYearConfig {
  lang: SupportedLang;
  displayName: string;
  headers: {
    serial: string;
    year: string;
    link: string;
  };
  buttonText: string;
  startYear: number;
  endYear: number;
  basePath: string;
}

interface YearRow {
  serial: number;
  year: number;
  targetUrl: string;
}

const LANGUAGE_CONFIGS: Record<SupportedLang, LanguageYearConfig> = {
  telugu: {
    lang: 'telugu',
    displayName: 'Telugu',
    headers: {
      serial: 'క్రమ సంఖ్య',
      year: 'సంవత్సరము',
      link: 'లింక్',
    },
    buttonText: 'Click here',
    startYear: 1969,
    endYear: 2015,
    basePath: '/murli/telugu',
  },
  hindi: {
    lang: 'hindi',
    displayName: 'Hindi',
    headers: {
      serial: 'क्रम संख्या',
      year: 'वर्ष',
      link: 'लिंक',
    },
    buttonText: 'Click here',
    startYear: 1969,
    endYear: 2015,
    basePath: '/murli/hindi',
  },
  english: {
    lang: 'english',
    displayName: 'English',
    headers: {
      serial: 'S. No.',
      year: 'Year',
      link: 'Link',
    },
    buttonText: 'Click here',
    startYear: 1969,
    endYear: 2015,
    basePath: '/murli/english',
  },
};

@Component({
  imports: [RouterLink],
  selector: 'app-language-year',
  styleUrl: './language-year.css',
  templateUrl: './language-year.html',
})
export class LanguageYear {
  private readonly route = inject(ActivatedRoute);
  private readonly paramMap = toSignal(this.route.paramMap);

  readonly activeLang = computed<SupportedLang>(() => {
    const raw = (this.paramMap()?.get('lang') ?? 'telugu').toLowerCase();
    if (raw === 'hindi' || raw === 'hi') return 'hindi';
    if (raw === 'english' || raw === 'en') return 'english';
    return 'telugu';
  });

  readonly config = computed<LanguageYearConfig>(
    () => LANGUAGE_CONFIGS[this.activeLang()]
  );

  readonly rows = computed<YearRow[]>(() => {
    const { startYear, endYear, basePath } = this.config();
    const list: YearRow[] = [];
    let serial = 1;

    for (let year = startYear; year <= endYear; year++) {
      list.push({
        serial: serial++,
        year,
        // Swap to an external URL if each year opens a legacy folder/PDF/page
        targetUrl: `${basePath}/${year}`,
      });
    }

    return list;
  });

  readonly navItems = [
    { label: 'HOME', path: '/' },
    { label: 'BLESSINGS', path: '/blessings' },
    { label: 'BOOKS', path: '/books' },
    { label: 'SEVA', path: '/seva' },
    { label: 'NEWS', path: '/news' },
    { label: 'CONTACT', path: '/contact' },
  ];
}
