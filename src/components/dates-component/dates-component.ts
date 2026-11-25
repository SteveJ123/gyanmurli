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
  actionGroup: string;
  actionSub: string;
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
    actionGroup: 'చర్యలు',
    actionSub: 'Edit / Delete',
  },
  hindi: {
    dateGroup: 'मुरली तारीख विवरण',
    sno: 'क्र.सं.',
    date: 'तारीख',
    textGroup: 'टेक्स्ट मुरली',
    essenceGroup: 'सार / चिंतन',
    audioGroup: 'ऑडियो / वीडियो',
    clickHere: 'Click Here',
    actionGroup: 'कार्यवाही',
    actionSub: 'Edit / Delete',
  },
  english: {
    dateGroup: 'Murli Date Details',
    sno: 'S.No',
    date: 'Date',
    textGroup: 'Text Murli',
    essenceGroup: 'Murli Essence',
    audioGroup: 'Audio / Video',
    clickHere: 'Click Here',
    actionGroup: 'Actions',
    actionSub: 'Edit / Delete',
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
  private readonly fb = inject(FormBuilder);
  private readonly paramMap = toSignal(this.route.paramMap);

  readonly activeLang = computed<string>(() => {
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
  readonly modalErrorMsg = signal<string>('');

  readonly uploadModalOpen = signal(false);
  readonly submitting = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly editingSno = signal<number | null>(null);
  readonly deletingId = signal<number | null>(null);

  readonly closed = output<void>();
  readonly created = output<any>();

  token: string | null = null;
  language: string | null = null;

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
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('auth_token');
    this.language = localStorage.getItem("language");
  }

  private fetchRows(lang: string, year: number): void {
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

  openUploadModal(): void {
    this.editingId.set(null);
    this.editingSno.set(this.entries().length + 1);
    this.modalErrorMsg.set('');
    this.form.reset();
    this.uploadModalOpen.set(true);
  }

  openEditModal(row: any, sno: number): void {
    this.editingId.set(row.id);
    this.editingSno.set(sno);
    this.modalErrorMsg.set('');
    this.form.patchValue({
      murli_date: row.murli_date ?? '',
      revised_html_url: row.text_html_url ?? '#',
      revised_pdf_url: row.text_pdf_url ?? '#',
      samartha_html_url: row.essence_html_url ?? '#',
      samartha_pdf_url: row.essence_pdf_url ?? '#',
      audio_mp3_url: row.audio_mp3_url ?? '#',
      video_mp4_url: row.audio_mp4_url ?? '#',
    });
    this.uploadModalOpen.set(true);
  }

  onClose(): void {
    if (!this.submitting()) {
      this.uploadModalOpen.set(false);
      this.editingId.set(null);
      this.editingSno.set(null);
      this.modalErrorMsg.set('');
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.modalErrorMsg.set('Please enter the Date.');
      return;
    }

    const v = this.form.getRawValue();
    const payload = {
      language: this.activeLang(),
      year: this.activeYear(),
      murli_date: v.murli_date.trim(),
      text_html_url: v.revised_html_url.trim() || '#',
      text_pdf_url: v.revised_pdf_url.trim() || '#',
      essence_html_url: v.samartha_html_url.trim() || '#',
      essence_pdf_url: v.samartha_pdf_url.trim() || '#',
      audio_mp3_url: v.audio_mp3_url.trim() || '#',
      audio_mp4_url: v.video_mp4_url.trim() || '#',
    };

    this.submitting.set(true);
    this.modalErrorMsg.set('');

    const currentEditId = this.editingId();
    const request$ = currentEditId
      ? this.murliService.updateMurliEntry(currentEditId, payload)
      : this.murliService.createMurliEntry(payload);

    request$.subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (!currentEditId && res?.data) {
          this.created.emit(res.data);
        }
        this.closed.emit();
        this.fetchRows(this.activeLang(), this.activeYear());
        this.form.reset();
        this.editingId.set(null);
        this.editingSno.set(null);
        this.uploadModalOpen.set(false);
      },
      error: (err) => {
        this.submitting.set(false);
        this.modalErrorMsg.set(
          err?.error?.message ||
            (currentEditId ? 'Failed to update entry.' : 'Failed to save entry.')
        );
      },
    });
  }

  // onDeleteRow(row: any): void {
  //   const confirmed = window.confirm(
  //     `Are you sure you want to delete Murli entry for "${row.murli_date}"?`
  //   );
  //   if (!confirmed) return;

  //   this.deletingId.set(row.id);
  //   this.murliService.deleteMurliEntry(row.id).subscribe({
  //     next: () => {
  //       this.deletingId.set(null);
  //       this.entries.update((list) => list.filter((item) => item.id !== row.id));
  //     },
  //     error: (err) => {
  //       this.deletingId.set(null);
  //       alert(err?.error?.message || 'Failed to delete Murli entry.');
  //     },
  //   });
  // }

  readonly pendingDeleteRow = signal<any | null>(null);
readonly deleteErrorMsg = signal<string>('');

onDeleteRow(row: any): void {
  this.deleteErrorMsg.set('');
  this.pendingDeleteRow.set(row);
}

cancelDelete(): void {
  if (this.deletingId() !== null) return;
  this.pendingDeleteRow.set(null);
  this.deleteErrorMsg.set('');
}

confirmDelete(): void {
  const row = this.pendingDeleteRow();
  if (!row || this.deletingId() !== null) return;

  this.deletingId.set(row.id);
  this.deleteErrorMsg.set('');

  this.murliService.deleteMurliEntry(row.id).subscribe({
    next: () => {
      this.deletingId.set(null);
      this.pendingDeleteRow.set(null);
      this.entries.update((list) => list.filter((item) => item.id !== row.id));
    },
    error: (err) => {
      this.deletingId.set(null);
      this.deleteErrorMsg.set(err?.error?.message || 'Failed to delete Murli entry.');
    },
  });
}


}
