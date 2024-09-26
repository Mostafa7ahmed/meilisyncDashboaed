import { SourceService } from './../../Core/service/source.service';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsynService } from '../../Core/service/asyn.service';
import { MeilisearchService } from '../../Core/service/meilisearch.service';
declare var bootstrap: any;
@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sync.component.html',
  styleUrl: './sync.component.scss',
})
export class SyncComponent {
  syncData: any[] = [];
  meiliData: any[] = [];
  sourceData: any[] = [];
  editmelie: FormGroup;

  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  pageSize = 10;

  syncForm = new FormGroup({
    label: new FormControl(null, Validators.required),
    sourceId: new FormControl(null, Validators.required),
    meiliSearchId: new FormControl(null, Validators.required),
  });

  constructor(
    private _AsynService: AsynService,
    private _MeilisearchService: MeilisearchService,
    private _SourceService: SourceService
  ) {
    this.editmelie = new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', Validators.required),
      sourceId: new FormControl('', Validators.required),
      meiliSearchId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getData(this.currentPage);
  }

  // Fetch paginated data
  getData(pageNumber: number = 1) {
    this._AsynService.getAll(pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.syncData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  getDataSource(pageNumber: number = 1) {
    this._SourceService.getAll(pageNumber).subscribe({
      next: (res) => {
        this.sourceData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  getDataMeliesearch(pageNumber: number = 1) {
    this._MeilisearchService.getAll(pageNumber).subscribe({
      next: (res) => {
        this.meiliData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  // Initialize form for editing

  editMelie(id: string) {
    this.callGet()
    this._AsynService.getSyncById(id).subscribe({
      next: (res) => {
        this.editmelie = new FormGroup({
          id: new FormControl(res.result.id),
          label: new FormControl(res.result.label, Validators.required),
          sourceId: new FormControl(res.result.source.id, Validators.required),
          meiliSearchId: new FormControl(res.result.meiliSearch.id, Validators.required),
        });
      },
      error: (err) => {
        console.error('Error fetching data for edit:', err);
      },
    });
  }

  // Update product details
  updateMelie(): void {
    if (this.editmelie.valid) {
      this._AsynService.updateSync(this.editmelie.value).subscribe({
        next: (res) => {
          this.getData(this.currentPage); // Refresh data
          this.closeModal('#exampleModal2')
        },
        error: (err) => {
          console.error('Error updating item:', err);
        },
      });
    }
  }

  // Handle form submission to add a new MeiliSearch instance
  addMeili() {
    if (this.syncForm.valid) {
      const formData = this.syncForm.value; // Get form data

      this._AsynService.addSync(formData).subscribe({
        next: (res) => {
          console.log('MeiliSearch added successfully:', res);
          this.getData();
          this.closeModal('#exampleModal');
        },
        error: (err) => {
          console.error('Error adding MeiliSearch:', err);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  callGet() {
    this.getDataMeliesearch(this.currentPage);
    this.getDataSource(this.currentPage);
  }
  // Delete a MeiliSearch instance
  deleteaync(id: string) {
    this._AsynService.deleteSync(id).subscribe({
      next: (res) => {
        console.log('Item deleted:', res);
        this.getData(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      },
    });
  }

  // Change pagination page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  onSourceChange(event: any) {
    this.meiliData = event.target.value; // Capture selected source ID or value
    console.log('Selected Source:', this.meiliData);
  }

  // Close the modal
  closeModal(id:string) {
    const modalElement = document.querySelector(id);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
}
