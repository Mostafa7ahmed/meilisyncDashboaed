import { CommonModule } from '@angular/common';
import { MeilisearchService } from './../../Core/service/meilisearch.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any; // Access Bootstrap modal methods

@Component({
  selector: 'app-meilisearch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meilisearch.component.html',
  styleUrls: ['./meilisearch.component.scss'],
})
export class MeilisearchComponent implements OnInit {
  meiliData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  pageSize = 10;
  editmelie: FormGroup;
  meilForm: FormGroup;


  constructor(private _MeilisearchService: MeilisearchService) {
    this.meilForm = new FormGroup({
      label: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required),
      apiKey: new FormControl(null, Validators.required),
    });

    // Initialize editmelie with an empty FormGroup
    this.editmelie = new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      apiKey: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getData(this.currentPage);
  }

  // Fetch paginated data
  getData(pageNumber: number = 1) {
    this._MeilisearchService.getAll(pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.meiliData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  // Initialize form for editing
  editMelie(id: string) {
    this._MeilisearchService.getMeileById(id).subscribe({
      next: (res) => {
        this.editmelie = new FormGroup({
          id: new FormControl(res.result.id),
          label: new FormControl(res.result.label, Validators.required),
          url: new FormControl(res.result.url, Validators.required),
          apiKey: new FormControl(res.result.apiKey, Validators.required),
        });
        // Optionally open the modal programmatically if needed
      },
      error: (err) => {
        console.error('Error fetching data for edit:', err);
      }
    });
  }

  // Update product details
  updateMelie(): void {
    if (this.editmelie.valid) {
      this._MeilisearchService.updateMelie(this.editmelie.value).subscribe({
        next: (res) => {
          this.getData(this.currentPage); // Refresh data
        },
        error: (err) => {
          console.error('Error updating item:', err);
        }
      });
    }
  }

  // Handle form submission to add a new MeiliSearch instance
  addMeili(data: FormGroup) {
    if (data.valid) {
      this._MeilisearchService.addMeile(data.value).subscribe({
        next: (res) => {
          console.log('Success:', res);
          this.closeModal(); // Close modal on success
          this.getData(this.currentPage); // Refresh the data after adding new entry
          data.reset(); // Reset form
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }

  // Delete a MeiliSearch instance
  deleteMeili(id: string) {
    this._MeilisearchService.deleteMeile(id).subscribe({
      next: (res) => {
        console.log('Item deleted:', res);
        this.getData(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      }
    });
  }

  // Change pagination page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  // Close the modal
  closeModal() {
    const modalElement = document.querySelector('#exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

  }
}
