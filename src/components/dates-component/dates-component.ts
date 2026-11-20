import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Service } from '../../../service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface TableHeaderLabels {
  dateGroup: string;
  sno: string;
  date: string;
  textGroup: string;
  essenceGroup: string;
  audioGroup: string;
  clickHere: string;
}

const HEADER_TRANSLATIONS: Record<any, TableHeaderLabels> = {
  telugu: {
    dateGroup: 'మురళి తేదీ వివరాలు',
    sno: 'S.No',
    date: 'Date',
    textGroup: 'రివైజ్ కోర్స్ మురళీలు',
    essenceGroup: 'సమర్థ సంకల్పాల ఖజానా',
    audioGroup: 'ఆడియో / వీడియో',
    clickHere: 'Click Here',
  },
  hindi: {
    dateGroup: 'मुरली तारीख विवरण',
    sno: 'क्र.सं.',
    date: 'तारीख',
    textGroup: 'टेक्स्ट मुरली',
    essenceGroup: 'सार / चिंतन',
    audioGroup: 'ऑडियो / वीडियो',
    clickHere: 'Click Here',
  },
  english: {
    dateGroup: 'Murli Date Details',
    sno: 'S.No',
    date: 'Date',
    textGroup: 'Text Murli',
    essenceGroup: 'Murli Essence',
    audioGroup: 'Audio / Video',
    clickHere: 'Click Here',
  },
};

interface ModalLabels {
  modalTitle: string;
  dateSection: string;
  dateLabel: string;
  datePlaceholder: string;
  textSection: string;
  htmlUrlLabel: string;
  pdfUrlLabel: string;
  audioSection: string;
  audioUrlLabel: string;
  videoUrlLabel: string;
  saveBtn: string;
  savingBtn: string;
  cancelBtn: string;
}

const MODAL_TRANSLATIONS: Record<any, ModalLabels> = {
  telugu: {
    modalTitle: 'మురళి వివరాలు జోడించండి',
    dateSection: 'మురళి తేదీ వివరాలు',
    dateLabel: 'తేదీ (Date)',
    datePlaceholder: 'ఉదా: 05.01.1969',
    textSection: 'టెక్స్ట్ మురళి',
    htmlUrlLabel: 'HTML URL (S3)',
    pdfUrlLabel: 'PDF URL (S3)',
    audioSection: 'ఆడియో / వీడియో',
    audioUrlLabel: 'Audio URL (MP3 / S3)',
    videoUrlLabel: 'Video URL (MP4 / S3)',
    saveBtn: 'Save to Backend',
    savingBtn: 'Saving...',
    cancelBtn: 'Cancel',
  },
  hindi: {
    modalTitle: 'मुरली विवरण जोड़ें',
    dateSection: 'मुरली तारीख विवरण',
    dateLabel: 'तारीख (Date)',
    datePlaceholder: 'उदा: 05.01.1969',
    textSection: 'टेक्स्ट मुरली',
    htmlUrlLabel: 'HTML URL (S3)',
    pdfUrlLabel: 'PDF URL (S3)',
    audioSection: 'ऑडियो / वीडियो',
    audioUrlLabel: 'Audio URL (MP3 / S3)',
    videoUrlLabel: 'Video URL (MP4 / S3)',
    saveBtn: 'Save to Backend',
    savingBtn: 'Saving...',
    cancelBtn: 'Cancel',
  },
  english: {
    modalTitle: 'Add Murli Entry',
    dateSection: 'Murli Date Details',
    dateLabel: 'Date (Text)',
    datePlaceholder: 'e.g. 05.01.1969',
    textSection: 'Text Murli',
    htmlUrlLabel: 'HTML URL (S3)',
    pdfUrlLabel: 'PDF URL (S3)',
    audioSection: 'Audio / Video',
    audioUrlLabel: 'Audio URL (MP3 / S3)',
    videoUrlLabel: 'Video URL (MP4 / S3)',
    saveBtn: 'Save to Backend',
    savingBtn: 'Saving...',
    cancelBtn: 'Cancel',
  },
};

interface PopupColumnLabels {
  modalTitle: string;
  dateGroup: string;
  snoLabel: string;
  dateLabel: string;
  datePlaceholder: string;
  revisedGroup: string;
  samarthaGroup: string;
  audioGroup: string;
  htmlUrlPlaceholder: string;
  pdfUrlPlaceholder: string;
  mp3UrlPlaceholder: string;
  mp4UrlPlaceholder: string;
  submitText: string;
  submittingText: string;
  cancelText: string;
}

const POPUP_LABELS: Record<any, PopupColumnLabels> = {
  telugu: {
    modalTitle: 'కొత్త మురళి ఎంట్రీ జోడించండి',
    dateGroup: 'మురళి తేదీ వివరాలు',
    snoLabel: 'S.No',
    dateLabel: 'Date',
    datePlaceholder: 'ఉదా: 05.01.1969',
    revisedGroup: 'రివైజ్ కోర్స్ మురళీలు',
    samarthaGroup: 'సమర్థ సంకల్పాల ఖజానా',
    audioGroup: 'ఆడియో / వీడియో',
    htmlUrlPlaceholder: 'S3 HTML URL',
    pdfUrlPlaceholder: 'S3 PDF URL',
    mp3UrlPlaceholder: 'S3 MP3 URL',
    mp4UrlPlaceholder: 'S3 MP4 URL',
    submitText: 'Save Entry',
    submittingText: 'Saving...',
    cancelText: 'Cancel',
  },
  hindi: {
    modalTitle: 'नई मुरली प्रविष्टि जोड़ें',
    dateGroup: 'मुरली तारीख विवरण',
    snoLabel: 'S.No',
    dateLabel: 'Date',
    datePlaceholder: 'उदा: 05.01.1969',
    revisedGroup: 'रिवाइज्ड कोर्स मुरलियाँ',
    samarthaGroup: 'समर्थ संकल्पों का खजाना',
    audioGroup: 'ऑडियो / वीडियो',
    htmlUrlPlaceholder: 'S3 HTML URL',
    pdfUrlPlaceholder: 'S3 PDF URL',
    mp3UrlPlaceholder: 'S3 MP3 URL',
    mp4UrlPlaceholder: 'S3 MP4 URL',
    submitText: 'Save Entry',
    submittingText: 'Saving...',
    cancelText: 'Cancel',
  },
  english: {
    modalTitle: 'Add Murli Entry',
    dateGroup: 'Murli Date Details',
    snoLabel: 'S.No',
    dateLabel: 'Date',
    datePlaceholder: 'e.g. 05.01.1969',
    revisedGroup: 'Revised Course Murlis',
    samarthaGroup: 'Samartha Sankalpa Khazana',
    audioGroup: 'Audio / Video',
    htmlUrlPlaceholder: 'S3 HTML URL',
    pdfUrlPlaceholder: 'S3 PDF URL',
    mp3UrlPlaceholder: 'S3 MP3 URL',
    mp4UrlPlaceholder: 'S3 MP4 URL',
    submitText: 'Save Entry',
    submittingText: 'Saving...',
    cancelText: 'Cancel',
  },
};

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-dates-component',
  styleUrl: './dates-component.css',
  templateUrl: './dates-component.html',
})
export class DatesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly murliService = inject(Service);
  private readonly paramMap = toSignal(this.route.paramMap);

  readonly activeLang = computed<any>(() => {
    const raw = (this.paramMap()?.get('lang') ?? 'telugu').toLowerCase();
    if (raw === 'hindi') return 'hindi';
    if (raw === 'english') return 'english';
    return 'telugu';
  });

  readonly activeYear = computed<number>(() => {
    const y = Number(this.paramMap()?.get('year'));
    return Number.isFinite(y) && y > 0 ? y : 1969;
  });

  readonly headers = computed(() => HEADER_TRANSLATIONS[this.activeLang()]);
  readonly entries = signal<any[]>([]);
  readonly loading = signal<boolean>(false);
  readonly errorMsg = signal<string>('');

  readonly navItems = [
    { label: 'HOME', path: '/' },
    { label: 'BLESSINGS', path: '/blessings' },
    { label: 'BOOKS', path: '/books' },
    { label: 'SEVA', path: '/seva' },
    { label: 'NEWS', path: '/news' },
    { label: 'CONTACT', path: '/contact' },
  ];

  // constructor() {
  //   effect(() => {
  //     const lang = this.activeLang();
  //     const year = this.activeYear();
  //     this.fetchRows(lang, year);
  //   });
  // }

  private fetchRows(lang: any, year: number): void {
    this.loading.set(true);
    this.errorMsg.set('');
    this.murliService.getMurliByLangAndYear(lang, year).subscribe({
      next: (rows) => {
        this.entries.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load Murli dates for this year.');
        this.loading.set(false);
      },
    });
  }

  private readonly fb = inject(FormBuilder);
  // private readonly murliService = inject(Service);

  readonly isOpen = input<boolean>(false);
  readonly lang = input<any>('telugu');
  readonly year = input<number>(1969);

  readonly closed = output<void>();
  readonly created = output<any>();

  readonly submitting = signal(false);
  // readonly errorMsg = signal('');

  private readonly selectedFiles: Record<string, File | null> = {
    textHtmlFile: null,
    textPdfFile: null,
    audioMp3File: null,
    audioMp4File: null,
  };

  // readonly form = this.fb.nonNullable.group({
  //   murli_date: ['', [Validators.required, Validators.pattern(/^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/)]],
  //   text_html_url: [''],
  //   text_pdf_url: [''],
  //   audio_mp3_url: [''],
  //   audio_mp4_url: [''],
  // });

  readonly form = this.fb.nonNullable.group({
    murli_date: ['', Validators.required],
    revised_html_url: [''],
    revised_pdf_url: [''],
    samartha_html_url: [''],
    samartha_pdf_url: [''],
    audio_mp3_url: [''],
    video_mp4_url: [''],
  });

constructor() {
    effect(() => {
      const lang = this.activeLang();
      const year = this.activeYear();
      this.fetchRows(lang, year);
    });
  effect(() => {
      if (this.isOpen()) {
        this.errorMsg.set('');
        this.form.reset();
        Object.keys(this.selectedFiles).forEach((k) => (this.selectedFiles[k] = null));
      }
    });
  }

  labels(): ModalLabels {
    return MODAL_TRANSLATIONS[this.lang()] ?? MODAL_TRANSLATIONS['telugu'];
  }

  onFileSelected(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles[key] = input.files?.[0] ?? null;
  }

  onClose(): void {
    if (!this.submitting()) {
      this.uploadModalOpen.set(false);
    }
  }

  // onSubmit(): void {
  //   console.log(this.form.value)
  //   console.log(this.form.invalid)
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   this.submitting.set(true);
  //   this.errorMsg.set('');

  //   const raw = this.form.getRawValue();
  //   const formData = new FormData();
  //   formData.append('language', this.lang());
  //   formData.append('year', String(this.year()));
  //   formData.append('murli_date', raw.murli_date.trim());

  //   if (raw.text_html_url.trim()) formData.append('text_html_url', raw.text_html_url.trim());
  //   if (raw.text_pdf_url.trim()) formData.append('text_pdf_url', raw.text_pdf_url.trim());
  //   if (raw.audio_mp3_url.trim()) formData.append('audio_mp3_url', raw.audio_mp3_url.trim());
  //   if (raw.audio_mp4_url.trim()) formData.append('audio_mp4_url', raw.audio_mp4_url.trim());

  //   Object.entries(this.selectedFiles).forEach(([key, file]) => {
  //     if (file) formData.append(key, file);
  //   });

  //   this.murliService.createMurliEntry(formData).subscribe({
  //     next: (res) => {
  //       this.submitting.set(false);
  //       console.log("res.data", res.data)
  //       return
  //       // this.created.emit(res.data);
  //       // this.closed.emit();
  //     },
  //     error: (err) => {
  //       this.submitting.set(false);
  //       this.errorMsg.set(err?.error?.message || 'Failed to save entry to backend.');
  //     },
  //   });
  // }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg.set('Please enter the Date.');
      return;
    }

    const v = this.form.getRawValue();
    const payload = {
      language: this.lang(),
      year: this.year(),      
      murli_date: v.murli_date.trim(),
      text_html_url: v.revised_html_url.trim() || null,
      text_pdf_url: v.revised_pdf_url.trim() || null,
      essence_html_url: v.samartha_html_url.trim() || null,
      essence_pdf_url: v.samartha_pdf_url.trim() || null,
      audio_mp3_url: v.audio_mp3_url.trim() || null,
      audio_mp4_url: v.video_mp4_url.trim() || null,
    };

    console.log("payload", payload)
    

    this.submitting.set(true);
    this.errorMsg.set('');

    this.murliService.createMurliEntry(payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.created.emit(res.data);
        this.closed.emit();
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Failed to save entry.');
      },
    });
  }

  readonly uploadModalOpen = signal(false);

openUploadModal(): void {
  this.uploadModalOpen.set(true);
}

onEntryCreated(newRow: any): void {
  this.entries.update((current) => [...current, newRow]);
}
}
